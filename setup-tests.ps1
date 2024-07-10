# Check if we're running on Windows, otherwise return as we have nothing to do on other platforms
if ($IsWindows -eq $false) {
  return
}

# Making sure we have the scripts current folder
$root = $PSScriptRoot

if ("$root" -eq "") {
  # Fallback for PowerShell 2.0
  $root = Split-Path -parent "$MyInvocation.MyCommand.Definition"
}

# Make sure the scripts folder has tests subfolder
$testPath = Join-Path -Path "$root" -ChildPath "tests"

if (-not (Test-Path -Path "$testPath")) {
  Write-Error "'tests' folder not found in root`r`n"
}

$typesPath = Join-Path -Path "$root" -ChildPath "node_modules\types"

New-Item -ItemType Directory -Path "$typesPath" -Force -ErrorAction SilentlyContinue

# Check if there's a file or folder already and remove if so
$fvttFile = Join-Path -Path "$typesPath" -ChildPath "fvtt-types"

if (Test-Path -Path "$fvttFile") {
  # Remove only if it's not a Junction
  if (-not (Get-Item -Path "$fvttFile").Attributes.HasFlag([System.IO.FileAttributes]::ReparsePoint)) {
    Remove-Item -Path "$fvttFile" -Recurse -Force
  } else {
    return # fvtt-types is already a Junction and should stay
  }
}

# Create the junction to root
New-Item -ItemType Junction -Path "$fvttFile" -Value "$root"

# Check if the junction was created
if (-not (Test-Path -Path "$fvttFile")) {
  Write-Error "Failed to create junction in tests to fvtt-types root`r`n"
}
