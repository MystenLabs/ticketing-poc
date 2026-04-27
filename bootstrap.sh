#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/app"
MOVE_INIT_FILE="$ROOT_DIR/move/sources/init.move"
ENV_EXAMPLE_FILE="$APP_DIR/.env.development.local.example"
ENV_LOCAL_FILE="$APP_DIR/.env.local"
PUBLISH_RESULT_FILE="$ROOT_DIR/.publish.res.json"

log() {
  printf "==> %s\n" "$1"
}

warn() {
  printf "WARNING: %s\n" "$1" >&2
}

err() {
  printf "ERROR: %s\n" "$1" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || err "'$1' is required but not installed."
}

read_env_var() {
  local file="$1"
  local key="$2"
  python3 - "$file" "$key" <<'PY'
import pathlib
import re
import sys

file_path = pathlib.Path(sys.argv[1])
key = sys.argv[2]
if not file_path.exists():
    print("")
    raise SystemExit(0)

pattern = re.compile(rf"^\s*{re.escape(key)}\s*=\s*(.*)\s*$")
for raw_line in file_path.read_text().splitlines():
    line = raw_line.strip()
    if not line or line.startswith("#"):
        continue
    match = pattern.match(raw_line)
    if not match:
        continue
    value = match.group(1).strip()
    if (value.startswith('"') and value.endswith('"')) or (
        value.startswith("'") and value.endswith("'")
    ):
        value = value[1:-1]
    print(value)
    raise SystemExit(0)
print("")
PY
}

upsert_env_var() {
  local file="$1"
  local key="$2"
  local value="$3"
  python3 - "$file" "$key" "$value" <<'PY'
import pathlib
import re
import sys

file_path = pathlib.Path(sys.argv[1])
key = sys.argv[2]
value = sys.argv[3]

if file_path.exists():
    lines = file_path.read_text().splitlines()
else:
    lines = []

pattern = re.compile(rf"^\s*{re.escape(key)}\s*=")
updated = False
new_lines = []
for line in lines:
    if pattern.match(line):
        new_lines.append(f"{key}={value}")
        updated = True
    else:
        new_lines.append(line)

if not updated:
    if new_lines and new_lines[-1].strip() != "":
        new_lines.append("")
    new_lines.append(f"{key}={value}")

file_path.write_text("\n".join(new_lines) + "\n")
PY
}

derive_public_key_hex() {
  local private_key="$1"
  local derived_hex

  if ! command -v node >/dev/null 2>&1; then
    err "'node' is required to derive DEFAULT_PK from ADMIN_PRIVATE_KEY_ED25519."
  fi

  if [ ! -d "$APP_DIR/node_modules/@mysten/sui" ]; then
    err "Missing app dependencies. Run 'cd app && pnpm install' first."
  fi

  derived_hex="$(cd "$APP_DIR" && node --input-type=module -e "
    import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
    import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

    const privateKey = process.argv[1];
    const decoded = decodeSuiPrivateKey(privateKey);

    if (decoded.scheme !== 'ED25519') {
      throw new Error('ADMIN_PRIVATE_KEY_ED25519 must be an Ed25519 key.');
    }

    const keypair = Ed25519Keypair.fromSecretKey(decoded.secretKey);
    const publicKeyHex = Buffer.from(keypair.getPublicKey().toRawBytes()).toString('hex');
    process.stdout.write(publicKeyHex);
  " "$private_key")"

  if [[ ! "$derived_hex" =~ ^[0-9a-f]{64}$ ]]; then
    err "Derived public key is invalid. Expected 64 hex chars, got: '$derived_hex'"
  fi

  printf "%s" "$derived_hex"
}

update_default_pk_in_move() {
  local hex_key="$1"
  python3 - "$MOVE_INIT_FILE" "$hex_key" <<'PY'
import pathlib
import re
import sys

path = pathlib.Path(sys.argv[1])
hex_key = sys.argv[2]
content = path.read_text()

pattern = re.compile(r'const\s+DEFAULT_PK:\s*vector<u8>\s*=\s*x"[0-9a-fA-F]*";')
replacement = f'const DEFAULT_PK: vector<u8> = x"{hex_key}";'

if not pattern.search(content):
    raise SystemExit("Could not find DEFAULT_PK constant in move/sources/init.move")

updated = pattern.sub(replacement, content, count=1)
path.write_text(updated)
PY
}

main() {
  log "Checking prerequisites"
  require_cmd "sui"
  require_cmd "jq"
  require_cmd "python3"
  require_cmd "node"

  [ -f "$MOVE_INIT_FILE" ] || err "Missing $MOVE_INIT_FILE"
  [ -f "$ENV_EXAMPLE_FILE" ] || err "Missing $ENV_EXAMPLE_FILE"
  [ -f "$ROOT_DIR/publish.sh" ] || err "Missing $ROOT_DIR/publish.sh"

  if [ ! -f "$ENV_LOCAL_FILE" ]; then
    log "Creating app/.env.local from example"
    cp "$ENV_EXAMPLE_FILE" "$ENV_LOCAL_FILE"
  fi

  local admin_private_key
  admin_private_key="$(read_env_var "$ENV_LOCAL_FILE" "ADMIN_PRIVATE_KEY_ED25519")"

  if [ -z "$admin_private_key" ]; then
    printf "Enter ADMIN_PRIVATE_KEY_ED25519 (input hidden): "
    read -r -s admin_private_key
    printf "\n"
    [ -n "$admin_private_key" ] || err "ADMIN_PRIVATE_KEY_ED25519 cannot be empty."
    upsert_env_var "$ENV_LOCAL_FILE" "ADMIN_PRIVATE_KEY_ED25519" "$admin_private_key"
  fi

  if [[ "$admin_private_key" != suiprivkey1* ]]; then
    err "ADMIN_PRIVATE_KEY_ED25519 must be bech32 and start with 'suiprivkey1'."
  fi

  log "Deriving DEFAULT_PK from admin private key"
  local default_pk_hex
  default_pk_hex="$(derive_public_key_hex "$admin_private_key")"
  update_default_pk_in_move "$default_pk_hex"
  log "Updated move/sources/init.move DEFAULT_PK"

  log "Publishing Move package (interactive confirmation follows)"
  bash "$ROOT_DIR/publish.sh"

  [ -f "$PUBLISH_RESULT_FILE" ] || err "Publish did not generate $PUBLISH_RESULT_FILE"

  local package_id key_registry_id
  package_id="$(jq -r 'first(.objectChanges[] | select(.type == "published") | .packageId)' "$PUBLISH_RESULT_FILE")"
  key_registry_id="$(jq -r 'first(.objectChanges[] | select(.type == "created" and (.objectType | endswith("::key_registry::KeyRegistry"))) | .objectId)' "$PUBLISH_RESULT_FILE")"

  [ -n "$package_id" ] && [ "$package_id" != "null" ] || err "Could not extract package ID from publish result."
  [ -n "$key_registry_id" ] && [ "$key_registry_id" != "null" ] || err "Could not extract key registry ID from publish result."

  upsert_env_var "$ENV_LOCAL_FILE" "NEXT_PUBLIC_PACKAGE" "$package_id"
  upsert_env_var "$ENV_LOCAL_FILE" "NEXT_PUBLIC_KEY_REGISTRY" "$key_registry_id"

  log "Bootstrap complete"
  printf "NEXT_PUBLIC_PACKAGE=%s\n" "$package_id"
  printf "NEXT_PUBLIC_KEY_REGISTRY=%s\n" "$key_registry_id"
  printf "Updated env file: %s\n" "$ENV_LOCAL_FILE"
  printf "\n"
  printf "Action required before running the app:\n"
  printf "  - Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in %s\n" "$ENV_LOCAL_FILE"
  printf "  - Set NEXT_PUBLIC_ENOKI_API_KEY in %s\n" "$ENV_LOCAL_FILE"
  printf "  - Set ENOKI_SECRET_KEY in %s\n" "$ENV_LOCAL_FILE"
  printf "Once set, run: cd app && pnpm dev\n"
}

main "$@"
