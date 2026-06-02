# Ankibuki (আঁকিবুঁকি)
<p align="center">
<img width="1023" height="433" alt="image" src="https://github.com/user-attachments/assets/e88522e6-c63f-441f-a066-d9316ea305e1" />
</p>


Ankibuki is a playful Bangla scribble display font inspired by doodles, sketchbooks, classroom notes, and expressive handwriting. It is designed for posters, children's books, social media graphics, event titles, and creative Bangla branding.
<img width="500" height="610" alt="image" src="https://github.com/user-attachments/assets/e5a64616-7248-414e-9a45-fb359bf0675f" />


  <h2 align="center">Bangla Characters</h3>
  
  <p align="center">
  <img width="1658" height="836" alt="image" src="https://github.com/user-attachments/assets/56983a20-9397-4cf2-b0ab-051f6cf9c364" />
  </p>
  
  <h3 align="center">English Characters</h3>
  <img width="1727" height="611" alt="image" src="https://github.com/user-attachments/assets/50e77625-3a91-427f-aeb8-3cb44159e397" />



## Repository layout

This repository follows the Google Fonts upstream structure:

- `sources/` contains the UFO source and the one-command build script.
- `fonts/ttf/` contains generated TrueType binaries.
- `documentation/` contains project images and supporting documentation.
- `AUTHORS.txt`, `CONTRIBUTORS.txt`, and `OFL.txt` contain project attribution and licensing information.






## Repository Structure

```text
/
├── /Ankibuki-Regular.ufo
│   └── fontinfo.plist
├── documentation/
│   ├── image-license.txt
│   └── image.png
├── fonts/
│   ├── ttf/
│   │     └── Ankibuki-Regular.ttf
│   └── webfont
│         ├── Ankibuki-Regular.woff
│         └── Ankibuki-Regular.woff2
├── sources/
│   ├── Ankibubki-Regular.ufo/
│   └── build.sh
├── website/
│   ├── assets
│   │     ├── favicon
│   │     │    └──favicon.png
│   │     └── fonts
│   |          └── Ankibuki-Regular.woff2
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── CONTRIBUTORS.txt
├── OFL.txt
├── AUTHORS.txt
├── README.md
├── buils.ps1
└── requirements.txt
```








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



## Installation

### Desktop Installation

1. Download the latest font release.
2. Install the font on your operating system.
3. Restart applications if necessary.
4. Select **Ankibuki** from your font menu.

### Web Installation

```css
@font-face {
    font-family: "Ankibuki";
    src: url("./fonts/Ankibuki-Regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
}

body {
    font-family: "Ankibuki", sans-serif;
}
```

## License

Ankibuki is licensed under the SIL Open Font License, Version 1.1. See `OFL.txt` for details.
