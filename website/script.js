(function () {
  const input = document.getElementById("tester-input");
  const preview = document.getElementById("preview-text");
  const artboard = document.getElementById("preview-artboard");
  const previewImage = document.getElementById("preview-image");
  const slider = document.getElementById("font-size");
  const sizeOutput = document.getElementById("size-output");
  const lineHeight = document.getElementById("line-height");
  const lineHeightOutput = document.getElementById("line-height-output");
  const paddingInput = document.getElementById("editor-padding");
  const paddingOutput = document.getElementById("padding-output");
  const textColor = document.getElementById("text-color");
  const backgroundColor = document.getElementById("background-color");
  const transparentBackground = document.getElementById("transparent-background");
  const imageInput = document.getElementById("background-image-input");
  const imageOpacity = document.getElementById("image-opacity");
  const imageOpacityOutput = document.getElementById("image-opacity-output");
  const clearImage = document.getElementById("clear-image");
  const downloadPng = document.getElementById("download-png");
  const downloadTxt = document.getElementById("download-txt");
  const alignButtons = Array.from(document.querySelectorAll("[data-align]"));
  const copyButton = document.getElementById("copy-css");
  const embedCode = document.getElementById("embed-code");
  const themeToggles = Array.from(document.querySelectorAll("[data-theme-toggle]"));
  const backToTop = document.getElementById("back-to-top");
  const defaultText = "আঁকিবুঁকি বাংলা ফন্ট";

  let uploadedImage = null;
  let currentAlign = "center";

  function saveTheme(theme) {
    try {
      localStorage.setItem("ankibuki-theme", theme);
    } catch (error) {
      return;
    }
  }

  function updateThemeButton() {
    const isDark = document.documentElement.dataset.theme === "dark";
    themeToggles.forEach(function (button) {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Switch to light version" : "Switch to dark version");

      const shortLabel = button.querySelector(".theme-toggle-text");
      const actionLabel = button.querySelector(".theme-action-text");
      if (shortLabel) shortLabel.textContent = isDark ? "Light" : "Dark";
      if (actionLabel) actionLabel.textContent = isDark ? "Light Version" : "Dark Version";
    });
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
    updateThemeButton();
  }

  function editorText() {
    return input.value.trim() || defaultText;
  }

  function setPreviewVar(name, value) {
    artboard.style.setProperty(name, value);
  }

  function updatePreview() {
    preview.textContent = editorText();
  }

  function updateSize() {
    const size = slider.value;
    setPreviewVar("--preview-font-size", size + "px");
    sizeOutput.textContent = size + "px";
  }

  function updateLineHeight() {
    const value = Number(lineHeight.value).toFixed(2);
    setPreviewVar("--preview-line-height", value);
    lineHeightOutput.textContent = value;
  }

  function updatePadding() {
    const value = paddingInput.value;
    setPreviewVar("--preview-padding", value + "px");
    paddingOutput.textContent = value + "px";
  }

  function updateColors() {
    setPreviewVar("--preview-text-color", textColor.value);
    const isTransparent = transparentBackground.checked;
    setPreviewVar("--preview-bg-color", isTransparent ? "transparent" : backgroundColor.value);
    artboard.classList.toggle("is-transparent", isTransparent);
    backgroundColor.disabled = isTransparent;
  }

  function updateImageOpacity() {
    const value = imageOpacity.value;
    setPreviewVar("--preview-image-opacity", value);
    imageOpacityOutput.textContent = Math.round(Number(value) * 100) + "%";
  }

  function updateAlign(nextAlign) {
    currentAlign = nextAlign;
    setPreviewVar("--preview-align", currentAlign);
    alignButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.align === currentAlign));
    });
  }

  function setUploadedImage(src) {
    uploadedImage = src;
    previewImage.src = src || "";
    previewImage.classList.toggle("has-image", Boolean(src));
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function downloadDataUrl(dataUrl, fileName) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function wrapCanvasText(context, text, maxWidth) {
    const paragraphs = text.split(/\r?\n/);
    const lines = [];

    paragraphs.forEach(function (paragraph) {
      if (!paragraph.trim()) {
        lines.push("");
        return;
      }

      let line = "";
      Array.from(paragraph).forEach(function (char) {
        const testLine = line + char;
        if (line && context.measureText(testLine).width > maxWidth) {
          lines.push(line);
          line = char;
        } else {
          line = testLine;
        }
      });
      lines.push(line);
    });

    return lines;
  }

  function drawCoverImage(context, image, width, height, opacity) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const dx = (width - drawWidth) / 2;
    const dy = (height - drawHeight) / 2;

    context.save();
    context.globalAlpha = opacity;
    context.drawImage(image, dx, dy, drawWidth, drawHeight);
    context.restore();
  }

  async function exportPng() {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const canvas = document.createElement("canvas");
    const width = 1600;
    const height = 1000;
    const scale = width / artboard.clientWidth;
    const padding = Number(paddingInput.value) * scale;
    const fontSize = Number(slider.value) * scale;
    const lineGap = Number(lineHeight.value);
    const context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;
    if (!transparentBackground.checked) {
      context.fillStyle = backgroundColor.value;
      context.fillRect(0, 0, width, height);
    }

    if (uploadedImage && previewImage.complete && previewImage.naturalWidth) {
      drawCoverImage(context, previewImage, width, height, Number(imageOpacity.value));
    }

    context.fillStyle = textColor.value;
    context.font = `${fontSize}px Ankibuki, sans-serif`;
    context.textBaseline = "middle";
    context.textAlign = currentAlign;

    const maxTextWidth = width - padding * 2;
    const lines = wrapCanvasText(context, editorText(), maxTextWidth);
    const lineHeightPx = fontSize * lineGap;
    const blockHeight = Math.max(lineHeightPx, lines.length * lineHeightPx);
    const startY = height / 2 - blockHeight / 2 + lineHeightPx / 2;
    const x = currentAlign === "left" ? padding : currentAlign === "right" ? width - padding : width / 2;

    lines.forEach(function (line, index) {
      context.fillText(line, x, startY + index * lineHeightPx, maxTextWidth);
    });

    downloadDataUrl(canvas.toDataURL("image/png"), "ankibuki-specimen.png");
  }

  function exportTxt() {
    const lines = [
      "Ankibuki type tester export",
      "",
      editorText(),
      "",
      "Settings:",
      "Font size: " + slider.value + "px",
      "Line space: " + Number(lineHeight.value).toFixed(2),
      "Text color: " + textColor.value,
      "Background: " + (transparentBackground.checked ? "transparent" : backgroundColor.value),
      "Alignment: " + currentAlign
    ];

    downloadBlob(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }), "ankibuki-text.txt");
  }

  input.addEventListener("input", updatePreview);
  slider.addEventListener("input", updateSize);
  lineHeight.addEventListener("input", updateLineHeight);
  paddingInput.addEventListener("input", updatePadding);
  textColor.addEventListener("input", updateColors);
  backgroundColor.addEventListener("input", updateColors);
  transparentBackground.addEventListener("change", updateColors);
  imageOpacity.addEventListener("input", updateImageOpacity);
  clearImage.addEventListener("click", function () {
    imageInput.value = "";
    setUploadedImage("");
  });
  downloadPng.addEventListener("click", exportPng);
  downloadTxt.addEventListener("click", exportTxt);
  imageInput.addEventListener("change", function () {
    const file = imageInput.files && imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", function () {
      setUploadedImage(String(reader.result || ""));
    });
    reader.readAsDataURL(file);
  });
  alignButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      updateAlign(button.dataset.align || "center");
    });
  });
  themeToggles.forEach(function (button) {
    button.addEventListener("click", function () {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  });
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updatePreview();
  updateSize();
  updateLineHeight();
  updatePadding();
  updateColors();
  updateImageOpacity();
  updateAlign(currentAlign);
  updateThemeButton();

  copyButton.addEventListener("click", function () {
    const css = embedCode.textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(css).then(function () {
        copyButton.textContent = "Copied";
        window.setTimeout(function () {
          copyButton.textContent = "Copy CSS";
        }, 1400);
      });
      return;
    }

    copyButton.textContent = "Select CSS";
    window.setTimeout(function () {
      copyButton.textContent = "Copy CSS";
    }, 1400);
  });
})();
