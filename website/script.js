(function () {
  const input = document.getElementById("tester-input");
  const preview = document.getElementById("preview-text");
  const artboard = document.getElementById("preview-artboard");
  const previewImage = document.getElementById("preview-image");
  const textFrame = document.getElementById("text-frame");
  const pageSize = document.getElementById("page-size");
  const canvasWidth = document.getElementById("canvas-width");
  const canvasWidthOutput = document.getElementById("canvas-width-output");
  const canvasHeight = document.getElementById("canvas-height");
  const canvasHeightOutput = document.getElementById("canvas-height-output");
  const slider = document.getElementById("font-size");
  const sizeOutput = document.getElementById("size-output");
  const lineHeight = document.getElementById("line-height");
  const lineHeightOutput = document.getElementById("line-height-output");
  const textRotate = document.getElementById("text-rotate");
  const textRotateOutput = document.getElementById("text-rotate-output");
  const paddingInput = document.getElementById("editor-padding");
  const paddingOutput = document.getElementById("padding-output");
  const textOpacity = document.getElementById("text-opacity");
  const textOpacityOutput = document.getElementById("text-opacity-output");
  const textColor = document.getElementById("text-color");
  const backgroundColor = document.getElementById("background-color");
  const outlineWidth = document.getElementById("outline-width");
  const outlineWidthOutput = document.getElementById("outline-width-output");
  const outlineColor = document.getElementById("outline-color");
  const transparentBackground = document.getElementById("transparent-background");
  const imageInput = document.getElementById("background-image-input");
  const imageOpacity = document.getElementById("image-opacity");
  const imageOpacityOutput = document.getElementById("image-opacity-output");
  const imageFit = document.getElementById("image-fit");
  const textShadowToggle = document.getElementById("text-shadow-toggle");
  const textShadowColor = document.getElementById("text-shadow-color");
  const clearImage = document.getElementById("clear-image");
  const resetEditor = document.getElementById("reset-editor");
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
  let frameState = { x: 50, y: 50, width: 92 };
  let frameDrag = null;

  function saveTheme(theme) {
    try {
      localStorage.setItem("ankibuki-theme", theme);
    } catch (error) {
      return;
    }
  }

  function copyInputText(){
    const copyCss = document.getElementById("embed-code");
    navigator.clipboard.writeText(copyCss.value).then(()=>{
      alert("Copied to clipboard!");
    }).catch(err=>{
      console.error("Failed to copy: ", err);
    });
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

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function pageSizeParts(value) {
    return value.split("x").map(function (part) {
      return Number(part);
    });
  }

  function updatePreview() {
    preview.textContent = editorText();
  }

  function updateCanvasSize(markCustom) {
    const width = Number(canvasWidth.value);
    const height = Number(canvasHeight.value);

    if (markCustom) {
      pageSize.value = "custom";
    }

    setPreviewVar("--preview-width", String(width));
    setPreviewVar("--preview-height", String(height));
    canvasWidthOutput.textContent = width + "px";
    canvasHeightOutput.textContent = height + "px";
  }

  function updateCanvasPreset() {
    if (pageSize.value === "custom") return;

    const parts = pageSizeParts(pageSize.value);
    canvasWidth.value = parts[0];
    canvasHeight.value = parts[1];
    updateCanvasSize(false);
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

  function updateFrame() {
    frameState.width = clamp(frameState.width, 24, 100);
    const halfWidth = frameState.width / 2;
    frameState.x = clamp(frameState.x, halfWidth, 100 - halfWidth);
    frameState.y = clamp(frameState.y, 5, 95);
    setPreviewVar("--preview-text-x", frameState.x + "%");
    setPreviewVar("--preview-text-y", frameState.y + "%");
    setPreviewVar("--preview-text-width", frameState.width + "%");
  }

  function updateRotation() {
    setPreviewVar("--preview-rotate", textRotate.value + "deg");
    textRotateOutput.textContent = textRotate.value + "deg";
  }

  function updatePadding() {
    const value = paddingInput.value;
    setPreviewVar("--preview-padding", value + "px");
    paddingOutput.textContent = value + "px";
  }

  function updateTextEffects() {
    const opacity = Number(textOpacity.value);
    const stroke = Number(outlineWidth.value);
    const hasShadow = textShadowToggle.checked;

    setPreviewVar("--preview-text-opacity", String(opacity));
    setPreviewVar("--preview-stroke-width", stroke + "px");
    setPreviewVar("--preview-stroke-color", outlineColor.value);
    setPreviewVar("--preview-shadow", hasShadow ? "6px 6px 0 " + textShadowColor.value : "none");
    textOpacityOutput.textContent = Math.round(opacity * 100) + "%";
    outlineWidthOutput.textContent = stroke + "px";
    outlineColor.disabled = stroke === 0;
    textShadowColor.disabled = !hasShadow;
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

  function updateImageFit() {
    setPreviewVar("--preview-image-fit", imageFit.value);
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

  function resetEditorSettings() {
    pageSize.value = "1600x1000";
    canvasWidth.value = "1600";
    canvasHeight.value = "1000";
    slider.value = "64";
    lineHeight.value = "1.15";
    frameState = { x: 50, y: 50, width: 92 };
    textRotate.value = "0";
    paddingInput.value = "44";
    textOpacity.value = "1";
    imageOpacity.value = "0.42";
    imageFit.value = "cover";
    textColor.value = "#171717";
    backgroundColor.value = "#fffaf0";
    outlineWidth.value = "0";
    outlineColor.value = "#171717";
    transparentBackground.checked = false;
    textShadowToggle.checked = false;
    textShadowColor.value = "#ffd93d";
    updateAlign("center");
    updateCanvasSize(false);
    updateSize();
    updateLineHeight();
    updateFrame();
    updateRotation();
    updatePadding();
    updateTextEffects();
    updateColors();
    updateImageOpacity();
    updateImageFit();
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

  function drawImageFit(context, image, width, height, opacity, fit) {
    if (fit === "stretch") {
      context.save();
      context.globalAlpha = opacity;
      context.drawImage(image, 0, 0, width, height);
      context.restore();
      return;
    }

    const scale = fit === "contain"
      ? Math.min(width / image.naturalWidth, height / image.naturalHeight)
      : Math.max(width / image.naturalWidth, height / image.naturalHeight);
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
    const width = Number(canvasWidth.value);
    const height = Number(canvasHeight.value);
    const scale = width / artboard.clientWidth;
    const padding = Number(paddingInput.value) * scale;
    const fontSize = Number(slider.value) * scale;
    const lineGap = Number(lineHeight.value);
    const textBoxWidth = Math.min(width - padding * 2, width * (frameState.width / 100));
    const centerX = width * (frameState.x / 100);
    const centerY = height * (frameState.y / 100);
    const rotation = Number(textRotate.value) * Math.PI / 180;
    const strokeWidth = Number(outlineWidth.value) * scale;
    const context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;
    if (!transparentBackground.checked) {
      context.fillStyle = backgroundColor.value;
      context.fillRect(0, 0, width, height);
    }

    if (uploadedImage && previewImage.complete && previewImage.naturalWidth) {
      drawImageFit(context, previewImage, width, height, Number(imageOpacity.value), imageFit.value);
    }

    context.fillStyle = textColor.value;
    context.font = `${fontSize}px Ankibuki, sans-serif`;
    context.textBaseline = "middle";
    context.textAlign = currentAlign;

    const lines = wrapCanvasText(context, editorText(), textBoxWidth);
    const lineHeightPx = fontSize * lineGap;
    const blockHeight = Math.max(lineHeightPx, lines.length * lineHeightPx);
    const startY = -blockHeight / 2 + lineHeightPx / 2;
    const x = currentAlign === "left" ? -textBoxWidth / 2 : currentAlign === "right" ? textBoxWidth / 2 : 0;

    context.save();
    context.translate(centerX, centerY);
    context.rotate(rotation);
    context.globalAlpha = Number(textOpacity.value);
    if (textShadowToggle.checked) {
      context.shadowColor = textShadowColor.value;
      context.shadowOffsetX = 6 * scale;
      context.shadowOffsetY = 6 * scale;
    }
    if (strokeWidth > 0) {
      context.strokeStyle = outlineColor.value;
      context.lineWidth = strokeWidth;
      context.lineJoin = "round";
    }
    lines.forEach(function (line, index) {
      const y = startY + index * lineHeightPx;
      if (strokeWidth > 0) {
        context.strokeText(line, x, y, textBoxWidth);
      }
      context.fillText(line, x, y, textBoxWidth);
    });
    context.restore();

    downloadDataUrl(canvas.toDataURL("image/png"), "ankibuki-specimen.png");
  }

  function exportTxt() {
    const lines = [
      "Ankibuki type tester export",
      "",
      editorText(),
      "",
      "Settings:",
      "Page size: " + canvasWidth.value + " x " + canvasHeight.value + "px",
      "Font size: " + slider.value + "px",
      "Line space: " + Number(lineHeight.value).toFixed(2),
      "Text position: " + Math.round(frameState.x) + "%, " + Math.round(frameState.y) + "%",
      "Text box: " + Math.round(frameState.width) + "%",
      "Rotation: " + textRotate.value + "deg",
      "Text opacity: " + Math.round(Number(textOpacity.value) * 100) + "%",
      "Text color: " + textColor.value,
      "Background: " + (transparentBackground.checked ? "transparent" : backgroundColor.value),
      "Alignment: " + currentAlign,
      "Outline: " + outlineWidth.value + "px " + outlineColor.value,
      "Shadow: " + (textShadowToggle.checked ? textShadowColor.value : "off"),
      "Image fit: " + imageFit.value
    ];

    downloadBlob(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }), "ankibuki-text.txt");
  }

  input.addEventListener("input", updatePreview);
  pageSize.addEventListener("change", updateCanvasPreset);
  canvasWidth.addEventListener("input", function () {
    updateCanvasSize(true);
  });
  canvasHeight.addEventListener("input", function () {
    updateCanvasSize(true);
  });
  slider.addEventListener("input", updateSize);
  lineHeight.addEventListener("input", updateLineHeight);
  textRotate.addEventListener("input", updateRotation);
  paddingInput.addEventListener("input", updatePadding);
  textOpacity.addEventListener("input", updateTextEffects);
  textColor.addEventListener("input", updateColors);
  backgroundColor.addEventListener("input", updateColors);
  outlineWidth.addEventListener("input", updateTextEffects);
  outlineColor.addEventListener("input", updateTextEffects);
  transparentBackground.addEventListener("change", updateColors);
  imageOpacity.addEventListener("input", updateImageOpacity);
  imageFit.addEventListener("change", updateImageFit);
  textShadowToggle.addEventListener("change", updateTextEffects);
  textShadowColor.addEventListener("input", updateTextEffects);
  clearImage.addEventListener("click", function () {
    imageInput.value = "";
    setUploadedImage("");
  });
  resetEditor.addEventListener("click", resetEditorSettings);
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
  textFrame.addEventListener("pointerdown", function (event) {
    if (event.button !== undefined && event.button !== 0) return;

    const rect = artboard.getBoundingClientRect();
    frameDrag = {
      mode: event.target.classList.contains("resize-handle") ? "resize" : "move",
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startFrame: { x: frameState.x, y: frameState.y, width: frameState.width },
      rect
    };
    textFrame.classList.add("is-editing");
    try {
      textFrame.setPointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture can fail for synthetic events; direct editing still works.
    }
    event.preventDefault();
  });
  textFrame.addEventListener("pointermove", function (event) {
    if (!frameDrag || frameDrag.pointerId !== event.pointerId) return;

    const dx = (event.clientX - frameDrag.startX) / frameDrag.rect.width * 100;
    const dy = (event.clientY - frameDrag.startY) / frameDrag.rect.height * 100;
    if (frameDrag.mode === "resize") {
      frameState.width = frameDrag.startFrame.width + dx * 2;
    } else {
      frameState.x = frameDrag.startFrame.x + dx;
      frameState.y = frameDrag.startFrame.y + dy;
    }
    updateFrame();
  });
  textFrame.addEventListener("pointerup", function (event) {
    if (!frameDrag || frameDrag.pointerId !== event.pointerId) return;

    frameDrag = null;
    textFrame.classList.remove("is-editing");
    if (textFrame.hasPointerCapture && textFrame.hasPointerCapture(event.pointerId)) {
      textFrame.releasePointerCapture(event.pointerId);
    }
  });
  textFrame.addEventListener("pointercancel", function (event) {
    if (!frameDrag || frameDrag.pointerId !== event.pointerId) return;

    frameDrag = null;
    textFrame.classList.remove("is-editing");
  });
  textFrame.addEventListener("keydown", function (event) {
    const moveStep = event.shiftKey ? 5 : 1;
    const resizeStep = event.shiftKey ? 8 : 3;
    let handled = true;

    if (event.key === "ArrowLeft") {
      frameState.x -= moveStep;
    } else if (event.key === "ArrowRight") {
      frameState.x += moveStep;
    } else if (event.key === "ArrowUp") {
      frameState.y -= moveStep;
    } else if (event.key === "ArrowDown") {
      frameState.y += moveStep;
    } else if (event.key === "-" || event.key === "_") {
      frameState.width -= resizeStep;
    } else if (event.key === "=" || event.key === "+") {
      frameState.width += resizeStep;
    } else {
      handled = false;
    }

    if (handled) {
      updateFrame();
      event.preventDefault();
    }
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
  updateCanvasSize(false);
  updateSize();
  updateLineHeight();
  updateFrame();
  updateRotation();
  updatePadding();
  updateTextEffects();
  updateColors();
  updateImageOpacity();
  updateImageFit();
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
