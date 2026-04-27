#!/bin/bash

set -euo pipefail

# check dependencies are available.
for i in jq curl sui bc python3; do
  if ! command -v ${i} >/dev/null 2>&1; then
    echo "${i} is not installed"
    exit 1
  fi
done

MOVE_PACKAGE_PATH=./move

# Get active environment and address from sui client
ACTIVE_ENV=$(sui client active-env)
ACTIVE_ADDRESS=$(sui client active-address)

echo "🌐 Network: ${ACTIVE_ENV}"
echo "👤 Active Address: ${ACTIVE_ADDRESS}"
echo "📦 Move Package: ${MOVE_PACKAGE_PATH}"

suffix="$ACTIVE_ENV"

ENV_FILE="./app/.env.$suffix"
mkdir -p "$(dirname "$ENV_FILE")"
if [ ! -f "$ENV_FILE" ]; then
  touch "$ENV_FILE"
  echo "📄 Created new environment file: $ENV_FILE"
fi

# Check gas balance
GAS_COINS=$(sui client gas --json)
TOTAL_BALANCE=$(echo "$GAS_COINS" | jq -r '[.[] | .mistBalance] | add // 0')
TOTAL_SUI=$(echo "scale=2; $TOTAL_BALANCE / 1000000000" | bc)

echo "💰 Total gas balance: ${TOTAL_SUI} SUI"

if [ "$TOTAL_BALANCE" -lt 2000000000 ]; then
  echo "⚠️  Warning: Gas balance might be insufficient for deployment"
fi

# Confirmation prompt
echo ""
echo ""
read -p "Do you want to proceed with deployment? [y/N]: " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Deployment cancelled."
  exit 0
fi

PUBLISH_RAW_FILE=".publish.raw.log"
PUBLISH_JSON_FILE=".publish.res.json"

# Capture both stdout/stderr so warnings are preserved for debugging.
# Do not let set -e exit before we can print output.
set +e
publish_output="$(sui client publish --json ${MOVE_PACKAGE_PATH} 2>&1)"
publish_exit_code=$?
set -e

printf "%s\n" "$publish_output" > "$PUBLISH_RAW_FILE"

echo "🧾 Full publish output:"
echo "----------------------------------------"
printf "%s\n" "$publish_output"
echo "----------------------------------------"
echo "📝 Saved raw output to: $PUBLISH_RAW_FILE"

if [ "$publish_exit_code" -ne 0 ]; then
  echo "Error during move contract publishing (exit code: $publish_exit_code)."
  echo "Inspect $PUBLISH_RAW_FILE for details."
  exit "$publish_exit_code"
fi

# Extract first valid JSON object from raw output (warnings can prefix JSON).
publish_res="$(python3 - "$PUBLISH_RAW_FILE" <<'PY'
import json
import pathlib
import sys

text = pathlib.Path(sys.argv[1]).read_text()
decoder = json.JSONDecoder()

for i, ch in enumerate(text):
    if ch != "{":
        continue
    try:
        obj, _ = decoder.raw_decode(text[i:])
        print(json.dumps(obj))
        raise SystemExit(0)
    except json.JSONDecodeError:
        continue

raise SystemExit(1)
PY
)"

if [ -z "${publish_res:-}" ]; then
  echo "Error during move contract publishing. Could not extract JSON output."
  echo "Inspect $PUBLISH_RAW_FILE for details."
  exit 1
fi

printf "%s\n" "$publish_res" > "$PUBLISH_JSON_FILE"
echo "📝 Saved parsed JSON to: $PUBLISH_JSON_FILE"

# Detect explicit publish error payloads.
if [ "$(echo "$publish_res" | jq -r 'has("error")')" = "true" ]; then
  echo "Error during move contract publishing:"
  echo "$publish_res" | jq -r '.error'
  exit 1
fi

PACKAGE_ID=$(echo "$publish_res" | jq -r 'first(.objectChanges[] | select(.type == "published") | .packageId)')
PUBLISHER_ID=$(echo "$publish_res" | jq -r 'first(.objectChanges[] | select(.type == "created" and (.objectType | contains("::Publisher"))) | .objectId)')
KEY_REGISTRY_ID=$(echo "$publish_res" | jq -r 'first(.objectChanges[] | select(.type == "created" and (.objectType | endswith("::key_registry::KeyRegistry"))) | .objectId)')

if [ -z "$PACKAGE_ID" ] || [ "$PACKAGE_ID" = "null" ]; then
  echo "Error: could not extract package ID from publish output."
  exit 1
fi

if [ -z "$KEY_REGISTRY_ID" ] || [ "$KEY_REGISTRY_ID" = "null" ]; then
  echo "Error: could not extract key registry ID from publish output."
  exit 1
fi

# Update .env file (append or update existing values)

# Remove existing lines if they exist, then clean up
if [ -s "$ENV_FILE" ]; then
  # File exists and has content
  grep -v "^NEXT_PUBLIC_PACKAGE=" "$ENV_FILE" > "${ENV_FILE}.tmp" 2>/dev/null || cp "$ENV_FILE" "${ENV_FILE}.tmp"
  grep -v "^NEXT_PUBLIC_KEY_REGISTRY=" "${ENV_FILE}.tmp" > "$ENV_FILE" 2>/dev/null || cp "${ENV_FILE}.tmp" "$ENV_FILE"
  rm -f "${ENV_FILE}.tmp"
else
  # File is empty or doesn't exist, ensure it's created
  touch "$ENV_FILE"
fi

# Append new values
cat >>$ENV_FILE<<-VITE_API_ENV
NEXT_PUBLIC_PACKAGE=$PACKAGE_ID
NEXT_PUBLIC_KEY_REGISTRY=$KEY_REGISTRY_ID
VITE_API_ENV

echo ""
echo "✅ Contract Deployment finished!"
echo "📦 Package ID: $PACKAGE_ID"
echo "📰 Publisher ID: $PUBLISHER_ID" 
echo "🔑 KeyRegistry ID: $KEY_REGISTRY_ID"
echo ""
