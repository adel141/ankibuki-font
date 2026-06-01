#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PYTHON="${PYTHON:-python3}"
if [ -x ".venv/Scripts/python.exe" ]; then
  PYTHON=".venv/Scripts/python.exe"
elif [ -x ".venv/bin/python" ]; then
  PYTHON=".venv/bin/python"
fi

mkdir -p fonts/ttf

"$PYTHON" -m fontmake \
  -u sources/Ankibuki-Regular.ufo \
  -o ttf \
  --output-dir fonts/ttf \
  --overlaps-backend pathops
