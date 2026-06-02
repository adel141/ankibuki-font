(function () {
  const input = document.getElementById("tester-input");
  const preview = document.getElementById("preview-text");
  const slider = document.getElementById("font-size");
  const sizeOutput = document.getElementById("size-output");
  const copyButton = document.getElementById("copy-css");
  const embedCode = document.getElementById("embed-code");
  const themeToggles = Array.from(document.querySelectorAll("[data-theme-toggle]"));
  const defaultText = "আঁকিবুঁকি বাংলা ফন্ট";

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

  function updatePreview() {
    const value = input.value.trim();
    preview.textContent = value || defaultText;
  }

  function updateSize() {
    const size = slider.value;
    preview.style.fontSize = size + "px";
    sizeOutput.textContent = size + "px";
  }

  input.addEventListener("input", updatePreview);
  slider.addEventListener("input", updateSize);
  themeToggles.forEach(function (button) {
    button.addEventListener("click", function () {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  });
  updatePreview();
  updateSize();
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
