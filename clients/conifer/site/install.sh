#!/bin/sh
# Conifer — macOS installer.
#
#   curl -fsSL https://conifer.build/install.sh | sh
#
# Downloads the latest build, verifies Apple's notarization ticket, installs it
# to /Applications, and opens it. Conifer is signed with a Developer ID and
# notarized by Apple (as of 1.2.1), so there is nothing to bypass and nothing
# to de-quarantine. Nothing leaves your machine. View this script before
# running it — that's the whole point of it being a plain file.
set -e

# Where the app lands. Overridable (e.g. CONIFER_APP_DIR="$HOME/Applications")
# for users without admin rights — and so this script can be exercised by
# test/install-scripts.test.ts against a temp dir on any platform. An installer
# nobody can test is how a broken install path ships.
# CONIFER_APP_DIR is the override. JUNIPER_APP_DIR remains a silent legacy
# alias so existing automation keeps working.
APP_DIR="${CONIFER_APP_DIR:-${JUNIPER_APP_DIR:-/Applications}}"

# Fail SOFT if the default install directory can't be written: enterprise /
# non-admin machines often lock /Applications (the 2026-08-26 demo hit exactly
# this and reached for sudo — this script never escalates, deliberately).
# macOS treats ~/Applications as a first-class app folder, so fall back there
# instead of refusing. An EXPLICIT override that isn't writable still fails
# fast — the user named a destination, so honor it or say why not.
if [ ! -w "$APP_DIR" ]; then
  if [ -z "${CONIFER_APP_DIR:-}${JUNIPER_APP_DIR:-}" ]; then
    APP_DIR="$HOME/Applications"
    mkdir -p "$APP_DIR"
    echo "  → /Applications is not writable by this user — installing to $APP_DIR instead"
  else
    echo "  ✗ $APP_DIR is not writable by this user, so Conifer can't be installed." >&2
    echo "    Pick a writable CONIFER_APP_DIR (e.g. CONIFER_APP_DIR=\"\$HOME/Applications\"), then try again." >&2
    exit 1
  fi
fi

# Release asset (stable, version-less permalink). Conifer_universal.dmg is
# attached on desktop-v2.0.26 and later.
DMG_URL="https://github.com/ConiferKit/sage/releases/latest/download/Conifer_universal.dmg"
DMG="$HOME/Downloads/Conifer.dmg"

printf '\n  🌲 Installing Conifer…\n\n'

# Fail CLOSED on a download that didn't happen. The stable permalink 404s
# whenever a release is missing, still building, or hasn't been promoted —
# a bare curl error told users nothing, so say what's actually going on.
echo "  → downloading"
if ! curl -fL -o "$DMG" "$DMG_URL"; then
  rm -f "$DMG"
  echo "  Conifer is not available yet, or the release service could not be reached." >&2
  echo "  Check https://conifer.build/download for the current release status." >&2
  exit 1
fi

# Eject leftover mounts from a previous run (find = no shell-glob errors).
# Also matches the pre-rename volume name so a half-finished old run is cleaned.
find /Volumes -maxdepth 1 \( -name 'Conifer*' -o -name 'Juniper*' \) 2>/dev/null | while read -r v; do
  hdiutil detach "$v" -force >/dev/null 2>&1 || true
done

echo "  → mounting"
MNT=$(hdiutil attach -nobrowse "$DMG" | grep -o '/Volumes/.*')
# Current releases ship Conifer.app. Tolerate the pre-rename bundle name if
# an older image is still on disk so a retry does not fail closed on the name.
APP="$MNT/Conifer.app"
[ -d "$APP" ] || APP="$MNT/Juniper.app"

# Conifer's Apple Team ID. Verified against the shipped build:
#   Authority=Developer ID Application: Charles Muehlberger (9N96KK95NN)
APPLE_TEAM_ID="9N96KK95NN"

# Nothing was copied yet, so rejecting here leaves the machine untouched.
reject_build() {
  hdiutil detach "$MNT" >/dev/null 2>&1 || true
  rm -f "$DMG"
  echo "    ⚠ $1 — nothing was installed." >&2
  echo "      If this persists, re-download" >&2
  echo "      from https://conifer.build/download (and let us know)." >&2
  exit 1
}

# Trust is checked on the MOUNTED app, BEFORE it reaches /Applications. Signed +
# notarized builds print "accepted · source=Notarized Developer ID". Verifying
# after the copy (as this script used to) meant a build Gatekeeper rejected was
# already installed — and then opened anyway.
echo "  → verifying signature"
if VERDICT=$(spctl --assess --type execute -v "$APP" 2>&1); then
  echo "    $(printf '%s' "$VERDICT" | tr '\n' ' ')"
else
  reject_build "Gatekeeper did not accept this build"
fi

# Gatekeeper accepts ANY notarized Developer ID app, so it alone cannot tell you
# the app is ours. Pin Conifer's Apple team as well: a different — even validly
# notarized — publisher must not pass this bootstrap path.
TEAM_REQUIREMENT="anchor apple generic and certificate leaf[subject.OU] = \"$APPLE_TEAM_ID\""
if ! codesign --verify --deep --strict -R="$TEAM_REQUIREMENT" "$APP" 2>/dev/null; then
  reject_build "This build is not signed by the expected Conifer Apple team"
fi

echo "  → copying to $APP_DIR"
cp -R "$APP" "$APP_DIR"/
hdiutil detach "$MNT" >/dev/null

printf '\n  ✓ Done — opening Conifer.\n\n'
# Open whichever bundle name the mounted image carried (see APP above).
open "$APP_DIR/$(basename "$APP")"
