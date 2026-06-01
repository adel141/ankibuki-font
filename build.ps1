param(
    [string]$UfoPath = "sources\Ankibuki-Regular.ufo",
    [string]$OutputDir = "fonts\ttf"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $UfoPath)) {
    throw "UFO source not found: $UfoPath"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$Python = ".\.venv\Scripts\python.exe"
if (-not (Test-Path -LiteralPath $Python)) {
    $Python = "python"
}

& $Python -m fontmake `
    -u $UfoPath `
    -o ttf `
    --output-dir $OutputDir `
    --overlaps-backend pathops
