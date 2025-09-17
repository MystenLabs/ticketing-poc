#!/bin/bash

# check dependencies are available.
for i in jq curl sui bc; do
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

publish_res=$(sui client publish --json ${MOVE_PACKAGE_PATH})

echo ${publish_res} >.publish.res.json

# Check if the command succeeded (exit status 0)
if [[ "$publish_res" =~ "error" ]]; then
  # If yes, print the error message and exit the script
  echo "Error during move contract publishing.  Details : $publish_res"
  exit 1
fi

publishedObjs=$(echo "$publish_res" | jq -r '.objectChanges[] | select(.type == "published")')

PACKAGE_ID=$(echo "$publishedObjs" | jq -r '.packageId')

newObjs=$(echo "$publish_res" | jq -r '.objectChanges[] | select(.type == "created")')

PUBLISHER_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::Publisher")).objectId')

# Extract KeyRegistry ID
KEY_REGISTRY_ID=$(echo "$newObjs" | jq -r 'select (.objectType | endswith("::key_registry::KeyRegistry")).objectId')

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
