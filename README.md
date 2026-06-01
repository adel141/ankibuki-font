# Ankibuki

![Ankibuki specimen](documentation/image.png)

Ankibuki is a playful Bangla scribble display font inspired by doodles, sketchbooks, classroom notes, and expressive handwriting. It is designed for posters, children's books, social media graphics, event titles, and creative Bangla branding.

## Repository layout

This repository follows the Google Fonts upstream structure:

- `sources/` contains the UFO source and the one-command build script.
- `fonts/ttf/` contains generated TrueType binaries.
- `documentation/` contains project images and supporting documentation.
- `AUTHORS.txt`, `CONTRIBUTORS.txt`, and `OFL.txt` contain project attribution and licensing information.

## Building

Create a virtual environment and install the pinned build dependencies:

```sh
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

Build the TTF:

```sh
bash sources/build.sh
```

On Windows PowerShell, you can also run:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

The generated font will be written to `fonts/ttf/Ankibuki-Regular.ttf`.

## License

Ankibuki is licensed under the SIL Open Font License, Version 1.1. See `OFL.txt` for details.
