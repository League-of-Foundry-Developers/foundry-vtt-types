# Making sure we have the scripts current folder
$root = $PSScriptRoot

if ($root -eq $null) {
  # Fallback for PowerShell 2.0
  $root = Split-Path -parent $MyInvocation.MyCommand.Definition
}

# Make sure the scripts folder has tests subfolder
$testPath = Join-Path -Path $root -ChildPath "tests"

if (-not (Test-Path -Path $testPath)) {
  Write-Error "'tests' folder not found in root"
}

$nodePath = Join-Path -Path $testPath -ChildPath "node_modules"

if (-not (Test-Path -Path $nodePath)) {
  Write-Error "'node_modules' folder not found in tests, run 'npm install' for this project first"
}

$typesPath = Join-Path -Path $nodePath -ChildPath "@types"

if (-not (Test-Path -Path $typesPath)) {
  Write-Error "'@types' folder not found in tests/node_modules, run 'npm install' for this project first"
}

# Check if there's a file or folder already and remove if so
$fvttFile = Join-Path -Path $typesPath -ChildPath "fvtt-types"

if (Test-Path -Path $fvttFile) {
  Remove-Item -Path $fvttFile -Recurse -Force
}

# Create the junction to root
New-Item -ItemType Junction -Path $fvttFile -Value $root

# Check if the junction was created
if (-not (Test-Path -Path $fvttFile)) {
  Write-Error "Failed to create junction to root"
}