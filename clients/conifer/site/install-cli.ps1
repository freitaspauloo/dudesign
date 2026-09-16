# Conifer CLI - Windows installer. View this plain file before running it:
#
#   curl.exe -fsSL https://www.conifer.build/install-cli.ps1 | iex
#
# Paste that into an already-open PowerShell window. `curl.exe` is the
# real curl (PowerShell's `curl` alias is Invoke-WebRequest and is slow
# across Windows versions). Do not wrap the line in `powershell -c`.
#
# To pin a release (or allow a downgrade), save the file and run it directly:
#
#   .\install-cli.ps1 -Version v1.2.3 [-AllowDowngrade]
#
# Downloads a published CLI release from ConiferKit/CLI-release, verifies its
# published SHA-256 checksum BEFORE writing anything, installs conifer.exe
# (and llama-mtmd-cli.exe when the release archive ships it) into a per-user
# directory, records the files it owns in ~/.conifer/install.json, and puts
# the install directory on your user Path. Nothing is installed from bytes
# that failed verification - a missing or mismatched checksum aborts before
# anything is written. Nothing leaves your machine. It never elevates.
#
# This installs the CLI (the product). The desktop app has its own installer
# at https://www.conifer.build/install.ps1; macOS/Linux CLI installs use
# https://www.conifer.build/install-cli.sh - this script mirrors its contract:
# fail-closed verification, ownership manifest, idempotent re-install,
# downgrade refusal, and a transactional swap with rollback.
#
# Runs under Windows PowerShell 5.1 AND PowerShell 7+: no pipeline-chain
# operators, no ternary, no null-coalescing anywhere in this file.
[CmdletBinding()]
param(
  # Pin a release, e.g. -Version v1.2.3. Default: the latest release.
  [string]$Version = '',
  # Downgrades are refused unless BOTH -Version and -AllowDowngrade are given.
  [switch]$AllowDowngrade,
  # Skip the user Path (HKCU) update - for tests and managed environments.
  [switch]$NoPathUpdate
)

$ErrorActionPreference = 'Stop'

# Mirrors INSTALLER_VERSION in install-cli.sh - bump the two together.
$InstallerVersion = '1.0.0'

# Where the artifacts live. Overridable so the install path can be exercised
# against a fixture server - an installer nobody can test is how a broken
# install path ships.
$Base = $env:CONIFER_CLI_RELEASE_BASE
if (-not $Base) { $Base = 'https://github.com/ConiferKit/CLI-release/releases/latest/download' }

# -Version rewrites the stable "latest" permalink into the pinned-tag form,
# exactly like install-cli.sh does for --version.
if ($Version) {
  if ($Version -notmatch '^v?[0-9]') {
    Write-Host '  x -Version must be a release version such as v1.2.3.' -ForegroundColor Red
    exit 1
  }
  if ($Base -match '/latest/download$') {
    $Base = ($Base -replace '/latest/download$', "/download/$Version")
  }
}

# Where the binaries land: the per-user install convention, no elevation ever.
# The same directory `conifer setup` uses, so the two paths converge on one
# canonical location. Overridable with CONIFER_BIN_DIR.
$BinDir = $env:CONIFER_BIN_DIR
if (-not $BinDir) { $BinDir = Join-Path $env:LOCALAPPDATA 'Programs\conifer' }

# The ownership manifest: which files this installer owns and their digests.
# The installer refuses to replace binaries it does not own.
$ConiferHome = $env:CONIFER_HOME
if (-not $ConiferHome) { $ConiferHome = Join-Path $env:USERPROFILE '.conifer' }
$Manifest = Join-Path $ConiferHome 'install.json'

$DestConifer = Join-Path $BinDir 'conifer.exe'
$DestMtmd = Join-Path $BinDir 'llama-mtmd-cli.exe'

# One artifact per platform - EXACTLY the name release.yml publishes and the
# CLI's own self-updater (conifer update) expects. x86_64 only today; Windows
# 11 on ARM runs it under x64 emulation. The zip carries the whole bundle:
# conifer.exe plus llama-mtmd-cli.exe (there is no separate Windows mtmd
# asset), so the mtmd install below is gated on it being present in the
# archive rather than on a second download.
$Asset = 'conifer-windows-x86_64.exe.zip'
$arch = $env:PROCESSOR_ARCHITECTURE
if ($arch -eq 'ARM64') {
  Write-Host '  note: no native ARM64 build today - installing the x86_64 build (Windows 11 runs it under emulation).'
} elseif ($arch -ne 'AMD64') {
  Write-Host "  x No Windows build for $arch - x86_64 only today." -ForegroundColor Red
  exit 1
}

# ---------------------------------------------------------------------------
# WINDOWS BUILD CAPABILITY NOTE.
# The published Windows asset is now the EMBEDDED build (--features embedded):
# it carries the bundled palm runtime (so `conifer setup` installs palm and
# puts it on your PATH) and the embedded engine. If we ever revert to the thin
# artifact, flip this note AND the $Asset name above back to the `-thin` names
# - they are the only two places that encode the build assumption.
# ---------------------------------------------------------------------------
$ThinBuildNote = @(
  '  This Windows build carries the full Conifer runtime: the palm router',
  '  (installed by `conifer setup`) plus the embedded engine, and it routes',
  '  to Conifer Cloud, BYOK providers, and Conifer hosts on your network.'
)

# Pull a semantic version out of a binary's `--version` output; empty string
# when unrecognizable. Mirrors version_from in install-cli.sh.
function Get-BinaryVersion {
  param([string]$Exe)
  $text = ''
  $previousPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try { $text = (& $Exe --version 2>&1 | Out-String) } catch { $text = '' }
  $ErrorActionPreference = $previousPreference
  foreach ($token in ($text -split '\s+')) {
    if ($token -match '^v?[0-9]+\.[0-9]+\.[0-9]+([-.][A-Za-z0-9.]+)?$') {
      return ($token -replace '^v', '')
    }
  }
  return ''
}

# Compare the first three numeric fields. Returns 0 (same), 1 (incoming is
# newer), 2 (incoming is OLDER - a downgrade). Mirrors version_order in
# install-cli.sh, including its exit codes.
function Compare-ConiferVersion {
  param([string]$Installed, [string]$Incoming)
  $a = $Installed -split '[.\-]'
  $b = $Incoming -split '[.\-]'
  for ($i = 0; $i -lt 3; $i++) {
    $ai = 0
    $bi = 0
    if ($i -lt $a.Length) { [void][int]::TryParse($a[$i], [ref]$ai) }
    if ($i -lt $b.Length) { [void][int]::TryParse($b[$i], [ref]$bi) }
    if ($ai -lt $bi) { return 1 }
    if ($ai -gt $bi) { return 2 }
  }
  return 0
}

function Get-FileSha256 {
  param([string]$Path)
  return (Get-FileHash -Path $Path -Algorithm SHA256).Hash.ToLower()
}

# The comparison key for "do these two strings name the same installed file?".
#
# Two spellings of one path have to compare equal. `conifer update` records
# owned_files.conifer through Rust's std::fs::canonicalize, which on Windows
# returns the EXTENDED-LENGTH form (\\?\C:\Users\...\conifer.exe), while this
# script builds the plain form from $LOCALAPPDATA. Compared raw, any machine
# that had ever self-updated refused its own re-install as "foreign or
# unmanaged binary" - and because that exit lands BEFORE the `conifer setup`
# hand-off at the bottom of this file, the credential and the signed model
# catalog never got written either, which is how "the model catalog isn't
# showing up" and Claude Code's assumed 200k context window both follow from a
# failed re-install.
#
# AUTHORITY: install_path_key in CLI/src/lifecycle.rs. PowerShell cannot import
# Rust, so this is a hand-kept mirror; the Rust side is the one under test
# (lifecycle::tests::install_path_identity_folds_spelling_but_never_two_real_files
# pins the rule). If you change one, change both - the cases that matter are
# \\?\ and \\?\UNC\ stripping, '/'->'\', trailing-separator trim, and case
# folding. This script has no test runner of its own, so keep it trivial
# enough to verify by reading.
function Get-InstallPathKey {
  param([string]$Path)
  if (-not $Path) { return '' }
  $p = $Path
  if ($p.StartsWith('\\?\UNC\')) {
    $p = '\\' + $p.Substring(8)
  } elseif ($p.StartsWith('\\?\')) {
    $p = $p.Substring(4)
  }
  $p = $p.Replace('/', '\')
  while ($p.Length -gt 1 -and $p.EndsWith('\')) { $p = $p.Substring(0, $p.Length - 1) }
  return $p.ToLowerInvariant()
}

# Everything that turns a landed binary into a WORKING install: the user Path,
# the proof it runs, and the hand-off to the onboarding wizard. Extracted
# because there are two ways to arrive here - a fresh swap, and an install that
# was already byte-current - and only the first used to reach it. Reads $BinDir
# / $DestConifer / $NoPathUpdate / $ThinBuildNote from the parent scope, the
# same convention Remove-StagedFiles uses so it behaves identically as a file
# and piped through iex. Every step is idempotent, so calling it on an
# unchanged install is safe.
function Complete-ConiferInstall {
  # The user Path, through .NET deliberately: it writes HKCU\Environment without
  # setx's silent 1024-char truncation AND broadcasts the change, so terminals
  # opened after this pick it up without a re-login. Append-only and only when
  # absent - re-running is safe and never reorders what you already have.
  if (-not $NoPathUpdate) {
    $UserPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    if ($null -eq $UserPath) { $UserPath = '' }
    if (($UserPath -split ';') -notcontains $BinDir) {
      $sep = ''
      if ($UserPath -ne '' -and -not $UserPath.EndsWith(';')) { $sep = ';' }
      [Environment]::SetEnvironmentVariable('Path', $UserPath + $sep + $BinDir, 'User')
      Write-Host "  -> added $BinDir to your user Path (already-open terminals need a restart to see it)"
    }
  }

  # Prove the installed binary actually runs before claiming success.
  $FinalVersion = Get-BinaryVersion $DestConifer
  Write-Host ''
  Write-Host "  Done - conifer $FinalVersion"
  Write-Host "  at $DestConifer"
  Write-Host ''
  foreach ($NoteLine in $ThinBuildNote) { Write-Host $NoteLine }
  Write-Host ''

  # Put the fresh install dir on THIS process's PATH, mirroring install-cli.sh's
  # `export PATH="$BIN_DIR:$PATH"` at the same point. The HKCU Path update above
  # only reaches terminals opened AFTER this one, so without this a `conifer`
  # typed in this same window - and the setup launch just below, plus any palm it
  # spawns - would be command-not-found until a restart. In-process only; nothing
  # is persisted here. When this script arrived via `irm | iex` the change sticks
  # in the caller's live session, so `conifer` works immediately, matching the
  # sh installer's "already active here".
  if (($env:Path -split ';') -notcontains $BinDir) {
    $env:Path = "$BinDir;$env:Path"
  }

  # Hand off to the onboarding wizard, exactly as install-cli.sh exec's
  # "$BIN_DIR/conifer" setup at the end of a successful macOS/Linux install. Gated
  # on CONIFER_NO_SETUP (CI and managed installs opt out - the same env var the sh
  # honors) AND on an INTERACTIVE session. A piped `irm | iex` install arrives over
  # a pipe but still runs in a real interactive console, so the gate keys off the
  # SESSION ([Environment]::UserInteractive), NOT whether stdin is redirected -
  # keying it off a redirected-input probe would wrongly suppress the launch for
  # the very path the install one-liner uses, defeating the fix. Launch by the FULL exe
  # path ($DestConifer): the persisted user Path is not in this process, so a bare
  # `conifer` would not resolve. `&` runs it in the same console, so the wizard is
  # fully interactive; when it exits, control returns to the caller.
  if ($env:CONIFER_NO_SETUP -ne '1' -and [Environment]::UserInteractive) {
    Write-Host '  -> launching conifer setup (set CONIFER_NO_SETUP=1 to skip)'
    Write-Host ''
    & $DestConifer setup
  } else {
    Write-Host '  next: conifer setup   (sign in and launch your first agent)'
    Write-Host ''
  }
}

Write-Host ''
Write-Host '  Installing the Conifer CLI...'
Write-Host ''

# Windows PowerShell 5.x defaults to TLS 1.0; GitHub's download host needs 1.2.
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

# curl.exe is on Windows 10 1803+ and is version-tolerant. Invoke-WebRequest
# is the fallback on older hosts; it is the slow path (`irm`) we do not lead with.
function Get-RemoteFile {
  param([string]$Uri, [string]$OutFile)
  $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
  if ($curl) {
    & curl.exe -fsSL --retry 3 --retry-delay 1 -o $OutFile $Uri
    if ($LASTEXITCODE -ne 0) { throw "curl.exe failed ($LASTEXITCODE) fetching $Uri" }
    return
  }
  # -ProxyUseDefaultCredentials: corporate authenticating proxies 407 plain
  # requests; harmless everywhere else. curl.exe already honours the system
  # proxy, so this only has to cover the Invoke-WebRequest fallback.
  Invoke-WebRequest -Uri $Uri -OutFile $OutFile -UseBasicParsing -ProxyUseDefaultCredentials
}

$Work = Join-Path ([System.IO.Path]::GetTempPath()) ("conifer-cli-install-" + [System.IO.Path]::GetRandomFileName())
New-Item -ItemType Directory -Force -Path $Work | Out-Null
$Zip = Join-Path $Work $Asset
$Sha = "$Zip.sha256"

# Fail CLOSED on a download that didn't happen. The stable permalink 404s
# whenever a release is missing, still building, or hasn't been promoted - a
# bare PowerShell exception told users nothing, so say what's actually going on.
Write-Host "  -> downloading $Asset"
try {
  Get-RemoteFile -Uri "$Base/$Asset" -OutFile $Zip
} catch {
  Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
  Write-Host '  The Conifer CLI is not available yet, or the release service could not be reached.'
  Write-Host "  ($($_.Exception.Message))"
  Write-Host '  Check https://conifer.build/download for the current release status.'
  exit 1
}
# The artifact and its checksum can fail independently; a landed artifact with
# no checksum is still unverifiable bytes.
try {
  Get-RemoteFile -Uri "$Base/$Asset.sha256" -OutFile $Sha
} catch {
  Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
  Write-Host '  The release checksum could not be fetched, so the download cannot be verified.'
  Write-Host "  ($($_.Exception.Message))"
  Write-Host '  Refusing to install unverified bytes. Check https://conifer.build/download.'
  exit 1
}

# Refusing to skip verification beats installing quietly. The published
# .sha256 is bare hex (the release pipeline's Get-FileHash output); take the
# first token so a "hash  filename" form verifies identically.
Write-Host '  -> verifying sha256'
$Expected = ((Get-Content $Sha -Raw).Trim() -split '\s+')[0].ToLower()
$Actual = Get-FileSha256 $Zip
if (-not $Expected -or $Expected -ne $Actual) {
  Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
  Write-Host '  x Checksum verification FAILED - the download does not match the published artifact. Nothing was installed.' -ForegroundColor Red
  exit 1
}
$ArtifactSha256 = $Expected

Write-Host '  -> unpacking'
Expand-Archive -Path $Zip -DestinationPath (Join-Path $Work 'unzipped') -Force
$Exe = Get-ChildItem (Join-Path $Work 'unzipped') -Recurse -Filter 'conifer.exe' | Select-Object -First 1
if (-not $Exe) {
  Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
  Write-Host '  x The archive did not contain conifer.exe - refusing to guess. Nothing was installed.' -ForegroundColor Red
  exit 1
}
# The mtmd helper ships inside the same zip today. Gate on its presence so a
# release that drops or renames it degrades to a note instead of a hard fail.
$MtmdExe = Get-ChildItem (Join-Path $Work 'unzipped') -Recurse -Filter 'llama-mtmd-cli.exe' | Select-Object -First 1

$NewVersion = Get-BinaryVersion $Exe.FullName
if (-not $NewVersion) {
  Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
  Write-Host '  x The downloaded conifer binary has an unrecognizable version output.' -ForegroundColor Red
  exit 1
}

# Ownership is deliberately checked only after release verification. A bad
# download must not cause any install-directory or manifest write - and this
# installer only ever replaces binaries it recorded in ~/.conifer/install.json.
$InstalledVersion = ''
if (Test-Path $DestConifer) {
  $OwnedConifer = ''
  if (Test-Path $Manifest) {
    try { $OwnedConifer = [string](Get-Content $Manifest -Raw | ConvertFrom-Json).owned_files.conifer } catch { $OwnedConifer = '' }
  }
  if ((Get-InstallPathKey $OwnedConifer) -ne (Get-InstallPathKey $DestConifer)) {
    Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
    Write-Host "  x Refusing to replace foreign or unmanaged binary: $DestConifer" -ForegroundColor Red
    Write-Host "    If a previous install was interrupted, remove that file and re-run this installer:"
    Write-Host "      Remove-Item '$DestConifer'"
    exit 1
  }
  $InstalledVersion = Get-BinaryVersion $DestConifer
  if (-not $InstalledVersion) {
    Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
    Write-Host "  x Refusing to replace unmanaged binary with unrecognizable version: $DestConifer" -ForegroundColor Red
    exit 1
  }
}

New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
New-Item -ItemType Directory -Force -Path $ConiferHome | Out-Null

# Stage next to the destination so the final swap is a same-volume rename.
$StagedConifer = Join-Path $BinDir ".conifer.exe.staged.$PID"
$StagedMtmd = ''
$StagedManifest = Join-Path $ConiferHome ".install.json.staged.$PID"
Copy-Item -Force $Exe.FullName $StagedConifer
if ($MtmdExe) {
  $StagedMtmd = Join-Path $BinDir ".llama-mtmd-cli.exe.staged.$PID"
  Copy-Item -Force $MtmdExe.FullName $StagedMtmd
} else {
  Write-Host '  note: this release archive does not include llama-mtmd-cli.exe; skipping it.'
}
$ConiferSha256 = Get-FileSha256 $StagedConifer
$MtmdSha256 = $null
if ($StagedMtmd) { $MtmdSha256 = Get-FileSha256 $StagedMtmd }

function Remove-StagedFiles {
  # Reads $StagedConifer/$StagedMtmd/$StagedManifest from the parent scope so
  # it behaves the same run as a file or piped through iex.
  foreach ($staged in @($StagedConifer, $StagedMtmd, $StagedManifest)) {
    if ($staged) { Remove-Item -Force $staged -ErrorAction SilentlyContinue }
  }
}

if ($InstalledVersion) {
  # Idempotent re-install: the same release already fully in place is a no-op,
  # not a rewrite.
  $BundleComplete = $false
  if ($InstalledVersion -eq $NewVersion) {
    if ((Get-FileSha256 $DestConifer) -eq $ConiferSha256) {
      if (-not $StagedMtmd) {
        $BundleComplete = $true
      } elseif ((Test-Path $DestMtmd) -and ((Get-FileSha256 $DestMtmd) -eq $MtmdSha256)) {
        $BundleComplete = $true
      }
    }
  }
  if ($BundleComplete) {
    Remove-StagedFiles
    Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
    Write-Host "  Conifer $NewVersion is already installed and complete; no changes made."
    # NOT exit 0. Matching binaries mean there is nothing to WRITE - they do
    # not mean the machine is set up. Everything that makes the CLI usable is
    # written by `conifer setup`: the credential, and the signed model catalog
    # at ~/.conifer/catalog-lkg.v1.json. Exiting here is why re-running the
    # one-liner to repair a half-finished install did nothing at all: the
    # binaries were already current, so the script congratulated itself and
    # left, and `conifer models` stayed empty (which in turn leaves Claude Code
    # assuming its default 200k window, because palm has no model list to
    # publish a real one from). Fall through to the Path + setup hand-off,
    # which are both idempotent.
    Complete-ConiferInstall
    exit 0
  }
  $Order = Compare-ConiferVersion $InstalledVersion $NewVersion
  $DowngradeAllowed = $false
  if ($Version -and $AllowDowngrade) { $DowngradeAllowed = $true }
  if ($Order -eq 2 -and -not $DowngradeAllowed) {
    Remove-StagedFiles
    Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
    Write-Host "  x Refusing to downgrade $InstalledVersion to $NewVersion." -ForegroundColor Red
    Write-Host '    A downgrade requires an explicit -Version and -AllowDowngrade.' -ForegroundColor Red
    exit 1
  }
}

# Stage the ownership manifest. Same shape as install-cli.sh writes on
# macOS/Linux, so tooling reads one format everywhere.
$PreviousVersion = $null
if ($InstalledVersion) { $PreviousVersion = $InstalledVersion }
$OwnedMtmdPath = $null
if ($StagedMtmd) { $OwnedMtmdPath = $DestMtmd }
$ManifestBody = [ordered]@{
  version = 1
  installer_version = $InstallerVersion
  channel = 'stable'
  release_tag = "v$NewVersion"
  artifact_sha256 = $ArtifactSha256
  owned_files = [ordered]@{
    conifer = $DestConifer
    llama_mtmd_cli = $OwnedMtmdPath
  }
  file_sha256 = [ordered]@{
    conifer = $ConiferSha256
    llama_mtmd_cli = $MtmdSha256
  }
  installed_version = $NewVersion
  installed_at = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
  previous_version = $PreviousVersion
}
[System.IO.File]::WriteAllText($StagedManifest, ($ManifestBody | ConvertTo-Json -Compress -Depth 4))

# Transactional swap: park the previous bundle, land the new one, and restore
# the previous bundle if anything in between fails. A running conifer.exe
# locks its file against deletion but not against rename, so parking by
# rename works even mid-session (the same trick the self-updater uses).
Write-Host "  -> installing $NewVersion to $BinDir"
$BackupConifer = ''
$BackupMtmd = ''
$BackupManifest = ''
try {
  if (Test-Path $DestConifer) {
    $BackupConifer = "$DestConifer.backup.$PID"
    Remove-Item -Force $BackupConifer -ErrorAction SilentlyContinue
    Move-Item -Force $DestConifer $BackupConifer
  }
  if ($StagedMtmd -and (Test-Path $DestMtmd)) {
    $BackupMtmd = "$DestMtmd.backup.$PID"
    Remove-Item -Force $BackupMtmd -ErrorAction SilentlyContinue
    Move-Item -Force $DestMtmd $BackupMtmd
  }
  if (Test-Path $Manifest) {
    $BackupManifest = "$Manifest.backup.$PID"
    Remove-Item -Force $BackupManifest -ErrorAction SilentlyContinue
    Move-Item -Force $Manifest $BackupManifest
  }
  # The MANIFEST lands first: it is the ownership record, and a manifest
  # naming a not-yet-swapped binary is recoverable (the next run verifies
  # and re-swaps) — the reverse (new binary, no manifest) permanently
  # tripped the foreign-binary refusal on every retry (audit 2026-08-07
  # I5: a Ctrl-C between the moves locked the installer out of its own
  # install).
  Move-Item -Force $StagedManifest $Manifest
  Move-Item -Force $StagedConifer $DestConifer
  if ($StagedMtmd) { Move-Item -Force $StagedMtmd $DestMtmd }
} catch {
  # Roll back: clear whatever half-landed, then restore the parked bundle. A
  # destination is only cleared when its previous copy is safe - either it
  # was parked successfully or nothing was there before - so a failed PARK
  # never leads to deleting the user's original binary.
  if (-not $BackupConifer -or (Test-Path $BackupConifer)) { Remove-Item -Force $DestConifer -ErrorAction SilentlyContinue }
  if (-not $BackupMtmd -or (Test-Path $BackupMtmd)) { Remove-Item -Force $DestMtmd -ErrorAction SilentlyContinue }
  if (-not $BackupManifest -or (Test-Path $BackupManifest)) { Remove-Item -Force $Manifest -ErrorAction SilentlyContinue }
  if ($BackupConifer -and (Test-Path $BackupConifer)) { try { Move-Item -Force $BackupConifer $DestConifer } catch {} }
  if ($BackupMtmd -and (Test-Path $BackupMtmd)) { try { Move-Item -Force $BackupMtmd $DestMtmd } catch {} }
  if ($BackupManifest -and (Test-Path $BackupManifest)) { try { Move-Item -Force $BackupManifest $Manifest } catch {} }
  Remove-StagedFiles
  Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
  Write-Host '  x Replacement was interrupted; the previous Conifer bundle was restored.' -ForegroundColor Red
  exit 1
}
# Success: drop the parked copies. A previous exe still running keeps its
# parked file locked against deletion; it stays parked until the next run.
foreach ($Backup in @($BackupConifer, $BackupMtmd, $BackupManifest)) {
  if ($Backup) { Remove-Item -Force $Backup -ErrorAction SilentlyContinue }
}
Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue

Complete-ConiferInstall
