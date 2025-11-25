(function () {
  "use strict";
  function initCustomSelect(rootId) {
    const root = document.getElementById(rootId);
    if (!root) {
      console.warn(`Custom select element not found: ${rootId}`);
      return;
    }
    const trigger = root.querySelector(".custom-select-trigger");
    const list = root.querySelector(".custom-select-options");
    const hidden = root.querySelector('input[type="hidden"]');

    const options = Array.from(list.querySelectorAll("li"));

    function open() {
      root.classList.add("open");
      root.setAttribute("aria-expanded", "true");
      list.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      // focus first option
      const sel = list.querySelector('li[aria-selected="true"]') || options[0];
      sel && sel.scrollIntoView({ block: "nearest" });
    }
    function close() {
      root.classList.remove("open");
      root.setAttribute("aria-expanded", "false");
      list.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
    }

    function selectOption(option) {
      const value = option.dataset.value || option.textContent.trim();
      trigger.textContent = option.textContent.trim();
      hidden.value = value;
      options.forEach((o) => o.removeAttribute("aria-selected"));
      option.setAttribute("aria-selected", "true");
      close();
    }

    // click trigger
    trigger.addEventListener("click", (e) => {
      const expanded = root.classList.contains("open");
      if (expanded) close();
      else open();
    });

    // option click
    options.forEach((opt) => {
      opt.addEventListener("click", () => selectOption(opt));
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) close();
    });

    // keyboard navigation
    root.addEventListener("keydown", (e) => {
      const openNow = root.classList.contains("open");
      const focused = document.activeElement;
      const currentIndex = options.findIndex(
        (o) => o.getAttribute("aria-selected") === "true"
      );
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!openNow) {
          open();
          return;
        }
        const nextIndex = Math.min(
          options.length - 1,
          currentIndex === -1 ? 0 : currentIndex + 1
        );
        options[nextIndex].focus();
        options[nextIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!openNow) {
          open();
          return;
        }
        const prevIndex = Math.max(
          0,
          currentIndex === -1 ? 0 : currentIndex - 1
        );
        options[prevIndex].focus();
        options[prevIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!openNow) {
          open();
          return;
        }
        // if focused on an option, select it
        if (focused && focused.parentElement === list) {
          selectOption(focused);
        } else {
          open();
        }
      } else if (e.key === "Escape") {
        close();
      }
    });

    // make options focusable
    options.forEach((o) => {
      o.setAttribute("tabindex", "0");
    });

    // close on blur for accessibility
    trigger.addEventListener("blur", () =>
      setTimeout(() => {
        if (!root.contains(document.activeElement)) close();
      }, 120)
    );

    // set initial value if any
    const firstSelected = options.find(
      (o) => o.getAttribute("aria-selected") === "true"
    );
    if (firstSelected) selectOption(firstSelected);
  }

  // Initialize on DOMContentLoaded with error handling
  function init() {
    try {
      initCustomSelect("contact-type-select");
      console.log("Custom select initialized successfully");
    } catch (error) {
      console.error("Failed to initialize custom select:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
