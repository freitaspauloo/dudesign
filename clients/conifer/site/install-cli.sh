#!/bin/sh
# Conifer CLI installer. View this plain file before running it:
#   curl -fsSL https://www.conifer.build/install-cli.sh | sh
#
# It downloads a published release, checks its SHA-256 before writing anything,
# and records the files it owns in ~/.conifer/install.json. It never uses sudo.
set -e

INSTALLER_VERSION="1.0.0"
MINISIGN_PUBLIC_KEY=""
DEFAULT_RELEASE_BASE="https://github.com/ConiferKit/CLI-release/releases/latest/download"
BASE_URL="${CONIFER_CLI_RELEASE_BASE:-$DEFAULT_RELEASE_BASE}"
REQUESTED_VERSION=""
ALLOW_DOWNGRADE=0
TMP=$(mktemp -d)
SETUP_ARGS_FILE="$TMP/setup-args"
STAGED_CONIFER=""
STAGED_MTMD=""
STAGED_MANIFEST=""
BACKUP_CONIFER=""
BACKUP_MTMD=""
BACKUP_MANIFEST=""
cleanup() { rm -rf "$TMP" "$STAGED_CONIFER" "$STAGED_MTMD" "$STAGED_MANIFEST" "$BACKUP_CONIFER" "$BACKUP_MTMD" "$BACKUP_MANIFEST"; }
trap cleanup EXIT INT TERM

usage() {
  echo "usage: install-cli.sh [--version vX.Y.Z] [--allow-downgrade] [setup arguments]" >&2
}

append_setup_arg() {
  printf '%s\n' "$1" >> "$SETUP_ARGS_FILE"
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --version)
      shift
      if [ "$#" -eq 0 ]; then usage; exit 1; fi
      REQUESTED_VERSION="$1" ;;
    --allow-downgrade) ALLOW_DOWNGRADE=1 ;;
    *) append_setup_arg "$1" ;;
  esac
  shift
done

if [ -n "$REQUESTED_VERSION" ]; then
  case "$REQUESTED_VERSION" in
    v[0-9]*|[0-9]*) ;;
    *) echo "  ✗ --version must be a release version such as v1.2.3." >&2; exit 1 ;;
  esac
  case "$BASE_URL" in
    */latest/download) BASE_URL="${BASE_URL%/latest/download}/download/$REQUESTED_VERSION" ;;
  esac
fi

BIN_DIR="${CONIFER_BIN_DIR:-}"
if [ -z "$BIN_DIR" ]; then
  if [ -w /usr/local/bin ]; then BIN_DIR=/usr/local/bin; else BIN_DIR="$HOME/.local/bin"; fi
fi
CONIFER_HOME="${CONIFER_HOME:-$HOME/.conifer}"
MANIFEST="$CONIFER_HOME/install.json"

OS=$(uname -s)
ARCH=$(uname -m)
THIN_NOTE=""
case "$OS" in
  Darwin)
    if [ "$ARCH" = "x86_64" ] && [ "$(sysctl -in hw.optional.arm64 2>/dev/null)" = "1" ]; then ARCH=arm64; fi
    case "$ARCH" in arm64) ASSET="conifer-macos-arm64.tar.gz" ;; *) echo "  ✗ No macOS build for $ARCH — Apple Silicon only." >&2; exit 1 ;; esac ;;
  Linux)
    case "$ARCH" in
      x86_64) ASSET="conifer-linux-x86_64-thin.tar.gz"; THIN_NOTE="the Linux build is a thin client: it drives a Conifer host on your network and does not run models locally." ;;
      *) echo "  ✗ No Linux build for $ARCH — x86_64 only today." >&2; exit 1 ;;
    esac ;;
  *)
    echo "  ✗ Unsupported OS: $OS." >&2
    echo "    Windows: paste this in PowerShell:" >&2
    echo "      curl.exe -fsSL https://www.conifer.build/install-cli.ps1 | iex" >&2
    echo "    (it installs conifer-windows-x86_64.exe.zip, checksum-verified)" >&2
    exit 1 ;;
esac

if command -v shasum >/dev/null 2>&1; then CHECK="shasum -a 256 -c";
elif command -v sha256sum >/dev/null 2>&1; then CHECK="sha256sum -c";
else
  echo "  ✗ Neither shasum nor sha256sum is available, so the download can't be verified." >&2
  exit 1
fi

fetch() {
  case "$BASE_URL" in https://*) curl --proto '=https' --tlsv1.2 -fsSL -o "$1" "$2" ;; *) curl -fsSL -o "$1" "$2" ;; esac
}

version_from() {
  "$1" --version 2>/dev/null | awk '{ for (i = 1; i <= NF; i++) if ($i ~ /^v?[0-9]+\.[0-9]+\.[0-9]+([-.][A-Za-z0-9.]+)?$/) { sub(/^v/, "", $i); print $i; exit } }'
}

manifest_conifer_path() { sed -n 's/.*"owned_files":{"conifer":"\([^"]*\)".*/\1/p' "$MANIFEST" | head -n 1; }

hash_file() {
  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$1" | awk '{print $1}'
  else
    sha256sum "$1" | awk '{print $1}'
  fi
}

same_file_digest() { [ "$(hash_file "$1")" = "$(hash_file "$2")" ]; }

version_order() {
  awk -v installed="$1" -v incoming="$2" 'BEGIN {
    split(installed, a, /[-.]/); split(incoming, b, /[-.]/);
    for (i = 1; i <= 3; i++) { if ((a[i] + 0) < (b[i] + 0)) exit 1; if ((a[i] + 0) > (b[i] + 0)) exit 2 }
    exit 0
  }'
}

json_escape() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }

first_path_conifer() {
  OLD_IFS=$IFS
  IFS=:
  for directory in $PATH; do
    [ -z "$directory" ] && directory=.
    if [ -x "$directory/conifer" ] && [ ! -d "$directory/conifer" ]; then
      IFS=$OLD_IFS
      printf '%s\n' "$directory/conifer"
      return 0
    fi
  done
  IFS=$OLD_IFS
  return 1
}

path_contains_fresh_install() {
  OLD_IFS=$IFS
  IFS=:
  for directory in $PATH; do
    [ -z "$directory" ] && directory=.
    if [ "$directory/conifer" = "$BIN_DIR/conifer" ]; then
      IFS=$OLD_IFS
      return 0
    fi
  done
  IFS=$OLD_IFS
  return 1
}

write_manifest() {
  previous_json=null
  if [ -n "$1" ]; then previous_json="\"$(json_escape "$1")\""; fi
  cat > "$STAGED_MANIFEST" <<EOF
{"version":1,"installer_version":"$INSTALLER_VERSION","channel":"stable","release_tag":"v$NEW_VERSION","artifact_sha256":"$ARTIFACT_SHA256","owned_files":{"conifer":"$(json_escape "$BIN_DIR/conifer")","llama_mtmd_cli":"$(json_escape "$BIN_DIR/llama-mtmd-cli")"},"file_sha256":{"conifer":"$CONIFER_SHA256","llama_mtmd_cli":"$MTMD_SHA256"},"installed_version":"$NEW_VERSION","installed_at":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","previous_version":$previous_json}
EOF
}

rollback_pair() {
  rm -f "$BIN_DIR/conifer" "$BIN_DIR/llama-mtmd-cli"
  [ -n "$BACKUP_CONIFER" ] && [ -f "$BACKUP_CONIFER" ] && mv "$BACKUP_CONIFER" "$BIN_DIR/conifer"
  [ -n "$BACKUP_MTMD" ] && [ -f "$BACKUP_MTMD" ] && mv "$BACKUP_MTMD" "$BIN_DIR/llama-mtmd-cli"
  [ -n "$BACKUP_MANIFEST" ] && [ -f "$BACKUP_MANIFEST" ] && mv "$BACKUP_MANIFEST" "$MANIFEST"
}

install_pair() {
  if [ -f "$BIN_DIR/conifer" ]; then BACKUP_CONIFER="$BIN_DIR/.conifer.backup.$$"; mv "$BIN_DIR/conifer" "$BACKUP_CONIFER"; fi
  if [ -f "$BIN_DIR/llama-mtmd-cli" ]; then BACKUP_MTMD="$BIN_DIR/.llama-mtmd-cli.backup.$$"; mv "$BIN_DIR/llama-mtmd-cli" "$BACKUP_MTMD"; fi
  if [ -f "$MANIFEST" ]; then BACKUP_MANIFEST="$CONIFER_HOME/.install.json.backup.$$"; mv "$MANIFEST" "$BACKUP_MANIFEST"; fi
  if ! mv "$STAGED_CONIFER" "$BIN_DIR/conifer" || ! mv "$STAGED_MTMD" "$BIN_DIR/llama-mtmd-cli" || ! mv "$STAGED_MANIFEST" "$MANIFEST"; then
    echo "  ✗ Replacement was interrupted; the previous Conifer bundle was restored." >&2
    rollback_pair
    exit 1
  fi
  rm -f "$BACKUP_CONIFER" "$BACKUP_MTMD" "$BACKUP_MANIFEST"
  BACKUP_CONIFER=""; BACKUP_MTMD=""; BACKUP_MANIFEST=""
}

printf '\n  🌲 Installing the Conifer CLI…\n\n'
echo "  → downloading $ASSET"
if ! fetch "$TMP/$ASSET" "$BASE_URL/$ASSET"; then echo "  The Conifer CLI is not available yet, or the release service could not be reached." >&2; echo "  Check https://conifer.build/download for the current release status." >&2; exit 1; fi
if ! fetch "$TMP/$ASSET.sha256" "$BASE_URL/$ASSET.sha256"; then echo "  The release checksum could not be fetched, so the download can't be verified." >&2; echo "  Refusing to install unverified bytes. Check https://conifer.build/download." >&2; exit 1; fi
echo "  → verifying checksum"
if ! (cd "$TMP" && $CHECK "$ASSET.sha256") >/dev/null 2>&1; then echo "    ⚠ Checksum verification FAILED — nothing was installed." >&2; exit 1; fi
ARTIFACT_SHA256=$(awk 'NR == 1 { print $1 }' "$TMP/$ASSET.sha256")

if [ -z "$MINISIGN_PUBLIC_KEY" ]; then
  echo "  note: detached minisign verification is not enabled for this installer yet."
elif fetch "$TMP/$ASSET.minisig" "$BASE_URL/$ASSET.minisig"; then
  if command -v minisign >/dev/null 2>&1; then
    minisign -Vm "$TMP/$ASSET" -x "$TMP/$ASSET.minisig" -P "$MINISIGN_PUBLIC_KEY"
  else
    echo "  ✗ This release has a minisig; install minisign to verify the detached trust root." >&2; exit 1
  fi
fi

echo "  → unpacking"
tar -xzf "$TMP/$ASSET" -C "$TMP"
if [ ! -f "$TMP/conifer" ] || [ ! -f "$TMP/llama-mtmd-cli" ]; then
  echo "    ⚠ The archive did not contain the complete Conifer bundle — nothing was installed." >&2; exit 1
fi
NEW_VERSION=$(version_from "$TMP/conifer")
if [ -z "$NEW_VERSION" ]; then echo "  ✗ The downloaded conifer binary has an unrecognizable version output." >&2; exit 1; fi

# Ownership is deliberately checked only after release verification. A bad
# download must not cause any install-directory or manifest write.
if [ -e "$BIN_DIR/conifer" ]; then
  if [ ! -f "$MANIFEST" ] || [ "$(manifest_conifer_path)" != "$BIN_DIR/conifer" ]; then
    echo "  ✗ Refusing to replace foreign or unmanaged binary: $BIN_DIR/conifer" >&2; exit 1
  fi
  INSTALLED_VERSION=$(version_from "$BIN_DIR/conifer")
  if [ -z "$INSTALLED_VERSION" ]; then echo "  ✗ Refusing to replace unmanaged binary with unrecognizable version: $BIN_DIR/conifer" >&2; exit 1; fi
else
  INSTALLED_VERSION=""
fi

mkdir -p "$BIN_DIR" "$CONIFER_HOME" 2>/dev/null || true
if [ ! -d "$BIN_DIR" ] || [ ! -w "$BIN_DIR" ] || [ ! -d "$CONIFER_HOME" ] || [ ! -w "$CONIFER_HOME" ]; then echo "  ✗ Install directory is not writable by this user." >&2; exit 1; fi
STAGED_CONIFER="$BIN_DIR/.conifer.staged.$$"
STAGED_MTMD="$BIN_DIR/.llama-mtmd-cli.staged.$$"
STAGED_MANIFEST="$CONIFER_HOME/.install.json.staged.$$"
cp "$TMP/conifer" "$STAGED_CONIFER"; cp "$TMP/llama-mtmd-cli" "$STAGED_MTMD"
chmod 0755 "$STAGED_CONIFER" "$STAGED_MTMD"
CONIFER_SHA256=$(hash_file "$STAGED_CONIFER")
MTMD_SHA256=$(hash_file "$STAGED_MTMD")

SKIP_INSTALL=0
if [ -n "$INSTALLED_VERSION" ]; then
  if [ "$INSTALLED_VERSION" = "$NEW_VERSION" ] && [ -f "$BIN_DIR/llama-mtmd-cli" ] && same_file_digest "$BIN_DIR/conifer" "$STAGED_CONIFER" && same_file_digest "$BIN_DIR/llama-mtmd-cli" "$STAGED_MTMD"; then
    echo "  ✓ Conifer $NEW_VERSION is already installed — checking your PATH and setup."
    # Do NOT exit here: a re-run almost always means the person is trying to
    # GET SET UP (conifer wasn't on PATH, or they ^C'd setup the first time).
    # Skip the byte-copy, then fall through to the PATH fix + setup launch so
    # the re-run actually helps instead of dead-ending at "command not found".
    rm -f "$STAGED_CONIFER" "$STAGED_MTMD" "$STAGED_MANIFEST" 2>/dev/null || true
    SKIP_INSTALL=1
  else
    if version_order "$INSTALLED_VERSION" "$NEW_VERSION"; then ORDER=0; else ORDER=$?; fi
    if [ "$ORDER" -eq 2 ] && { [ -z "$REQUESTED_VERSION" ] || [ "$ALLOW_DOWNGRADE" -ne 1 ]; }; then
      echo "  ✗ Refusing to downgrade $INSTALLED_VERSION to $NEW_VERSION." >&2
      echo "    A downgrade requires an explicit --version and --allow-downgrade." >&2
      exit 1
    fi
  fi
fi
if [ "$SKIP_INSTALL" -ne 1 ]; then
  write_manifest "$INSTALLED_VERSION"
  echo "  → installing $NEW_VERSION to $BIN_DIR"
  install_pair

  printf '\n  ✓ Done — '
  "$BIN_DIR/conifer" --version || true
  [ -n "$THIN_NOTE" ] && printf '\n  note: %s\n' "$THIN_NOTE"
fi

FIRST_PATH=$(first_path_conifer || true)
if ! path_contains_fresh_install; then
  # $BIN_DIR (usually ~/.local/bin) is not on PATH, so `conifer` would be
  # "command not found" after install — and the setup launch below needs it,
  # as does palm. Persist it to the user's shell rc(s) — both the interactive
  # rc AND the login-shell profile, because macOS Terminal/SSH start LOGIN
  # shells that read .zprofile/.bash_profile, not .zshrc/.bashrc — and export
  # it for THIS process so setup + palm work right now. Idempotent per file.
  case "${SHELL:-}" in
    */zsh)  RC_FILES="$HOME/.zshrc $HOME/.zprofile" ;;
    */bash) RC_FILES="$HOME/.bashrc $HOME/.bash_profile" ;;
    *)      RC_FILES="$HOME/.profile" ;;
  esac
  EXPORT_LINE="export PATH=\"$BIN_DIR:\$PATH\""
  RC_WROTE=""
  if [ -d "$HOME" ] && [ -w "$HOME" ]; then
    for RC in $RC_FILES; do
      grep -qsF "$BIN_DIR" "$RC" 2>/dev/null && continue
      printf '\n# Added by the Conifer installer\n%s\n' "$EXPORT_LINE" >> "$RC" 2>/dev/null \
        && RC_WROTE="${RC_WROTE:+$RC_WROTE, }$RC"
    done
  fi
  if [ -n "$RC_WROTE" ]; then
    printf '\n  ✓ added %s to your PATH in %s\n    (already active here; new terminals pick it up automatically)\n' "$BIN_DIR" "$RC_WROTE"
  else
    printf '\n  note: %s is not on your PATH — add:\n    %s\n' "$BIN_DIR" "$EXPORT_LINE"
  fi
  export PATH="$BIN_DIR:$PATH"
elif [ -n "$FIRST_PATH" ] && [ "$FIRST_PATH" != "$BIN_DIR/conifer" ]; then
  printf '\n  ⚠ PATH SHADOW: %s runs before the fresh install at %s.\n' "$FIRST_PATH" "$BIN_DIR/conifer" >&2
  printf '    Move %s before that directory in PATH, or remove the older copy.\n' "$BIN_DIR" >&2
fi

if [ "${CONIFER_NO_SETUP:-}" != "1" ] && [ -t 1 ] && ( : </dev/tty ) 2>/dev/null; then
  printf '\n  → launching conifer setup (set CONIFER_NO_SETUP=1 to skip)\n\n'
  trap - EXIT INT TERM
  set --
  # The args file only exists when setup arguments were actually passed; a plain
  # `curl | bash` never creates it, so reading it unconditionally printed
  # "line 260: .../setup-args: No such file or directory" mid-install. Read it
  # only when present; otherwise launch setup with no extra args.
  if [ -f "$SETUP_ARGS_FILE" ]; then
    while IFS= read -r setup_arg || [ -n "$setup_arg" ]; do
      set -- "$@" "$setup_arg"
    done < "$SETUP_ARGS_FILE"
  fi
  exec "$BIN_DIR/conifer" setup "$@" </dev/tty
fi
printf '\n  next: conifer setup   (sign in and launch your first agent)\n\n'
