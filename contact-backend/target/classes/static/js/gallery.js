// Automatic carousel logic for 3-photo row
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("auto-carousel");
  if (!carousel) return;
  const images = Array.from(carousel.children);
  let startIdx = 0;
  function showSlides(idx) {
    for (let i = 0; i < images.length; i++) {
      images[i].style.display = "none";
    }
    for (let i = 0; i < 3; i++) {
      images[(idx + i) % images.length].style.display = "block";
    }
  }
  showSlides(startIdx);
  setInterval(() => {
    startIdx = (startIdx + 1) % images.length;
    showSlides(startIdx);
  }, 2500);
});
/* Premium gallery script: filters + lightbox with keyboard & touch */
(function () {
  const gallery = document.getElementById("gallery");
  let figures = [];
  let imgs = [];
  if (gallery) {
    figures = Array.from(gallery.querySelectorAll(".photo"));
    imgs = figures.map((f) => f.querySelector("img"));
  }
  const filters = Array.from(document.querySelectorAll(".filter"));
  // SVG icon set used for controls (inline for simplicity)
  const ICONS = {
    prev: `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>`,
    next: `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"></path></svg>`,
    play: `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 3v18l15-9z"></path></svg>`,
    close: `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.3 5.71L12 12l6.3 6.29-1.41 1.41L10.59 13.4 4.29 19.7 2.88 18.29 9.18 12 2.88 5.71 4.29 4.3 10.59 10.6 16.88 4.3z"></path></svg>`,
  };
  let current = -1;
  let overlay = null;
  let startX = 0;

  // set footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function createOverlay() {
    overlay = document.createElement("div");
    overlay.className = "lb-overlay";
    overlay.tabIndex = -1;

    const content = document.createElement("div");
    content.className = "lb-content";

    const prev = document.createElement("button");
    prev.className = "lb-arrow lb-prev";
    prev.innerHTML = ICONS.prev;
    prev.title = "Previous";

    const img = document.createElement("img");
    img.className = "lb-image";
    img.alt = "";
    img.setAttribute("loading", "eager");

    const next = document.createElement("button");
    next.className = "lb-arrow lb-next";
    next.innerHTML = ICONS.next;
    next.title = "Next";

    const closeBtn = document.createElement("button");
    closeBtn.className = "lb-close";
    closeBtn.innerHTML = ICONS.close;
    closeBtn.title = "Close";

    const caption = document.createElement("div");
    caption.className = "lb-caption";

    content.appendChild(prev);
    content.appendChild(img);
    content.appendChild(next);
    content.appendChild(closeBtn);
    overlay.appendChild(content);
    overlay.appendChild(caption);
    document.body.appendChild(overlay);

    // events
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener("click", close);
    prev.addEventListener("click", showPrev);
    next.addEventListener("click", showNext);

    // touch gestures
    img.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
    img.addEventListener("touchend", (e) => {
      const endX =
        e.changedTouches && e.changedTouches[0]
          ? e.changedTouches[0].clientX
          : 0;
      const diff = endX - startX;
      if (diff > 40) showPrev();
      if (diff < -40) showNext();
    });
  }

  function open(index) {
    if (!overlay) createOverlay();
    current = index;
    updateOverlay();
    overlay.classList.add("show");
    overlay.focus();
    document.addEventListener("keydown", onKey);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("show");
    document.removeEventListener("keydown", onKey);
  }

  function showPrev() {
    current = (current - 1 + imgs.length) % imgs.length;
    updateOverlay();
  }
  function showNext() {
    current = (current + 1) % imgs.length;
    updateOverlay();
  }

  function preload(idx) {
    const src = imgs[idx] && imgs[idx].getAttribute("src");
    if (!src) return;
    const i = new Image();
    i.src = src;
  }

  function updateOverlay() {
    if (!overlay) return;
    const imgEl = overlay.querySelector(".lb-image");
    const captionEl = overlay.querySelector(".lb-caption");
    const src = imgs[current].getAttribute("src");
    const alt = imgs[current].getAttribute("alt") || "";
    imgEl.src = src;
    imgEl.alt = alt;
    captionEl.textContent = alt + ` — ${current + 1} / ${imgs.length}`;
    // preload neighbors
    preload((current + 1) % imgs.length);
    preload((current - 1 + imgs.length) % imgs.length);
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  }

  // attach click handlers and tabindex
  imgs.forEach((img, idx) => {
    img.addEventListener("click", () => open(idx));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") open(idx);
    });
    img.tabIndex = 0;
  });

  // filters
  function applyFilter(name) {
    figures.forEach((f) => {
      const tags = (f.getAttribute("data-tags") || "").split(/\s+/);
      if (name === "all" || tags.includes(name)) {
        f.style.display = "";
      } else {
        f.style.display = "none";
      }
    });
  }

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  // initial
  applyFilter("all");

  /* ---------- Cinematic slideshow (autoplay only, no controls) ---------- */
  const slideshow = document.querySelector(".hero-slideshow");
  if (slideshow) {
    console.log("Slideshow found, initializing...");
    const slides = Array.from(slideshow.querySelectorAll(".slide"));
    console.log("Slides found:", slides.length);
    const captionEl = slideshow.querySelector(".slideshow-caption");
    let ssIndex = 0;
    let ssTimer = null;
    let isPlaying = false;
    const SS_INTERVAL = 5000;

    // Add simple arrow controls
    const prevBtn = document.getElementById("ss-prev");
    const nextBtn = document.getElementById("ss-next");
    if (prevBtn)
      prevBtn.addEventListener("click", () => showSlide(ssIndex - 1));
    if (nextBtn)
      nextBtn.addEventListener("click", () => showSlide(ssIndex + 1));

    function ensureBg(slide) {
      if (!slide.style.backgroundImage) {
        const src = slide.getAttribute("data-src");
        if (src) slide.style.backgroundImage = `url(${src})`;
      }
    }

    function showSlide(i) {
      ssIndex = (i + slides.length) % slides.length;
      console.log(
        "Showing slide",
        ssIndex,
        "with src",
        slides[ssIndex].getAttribute("data-src")
      );
      slides.forEach((s, idx) => {
        if (idx === ssIndex) {
          ensureBg(s);
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
      const cap = slides[ssIndex].getAttribute("data-caption") || "";
      if (captionEl) captionEl.textContent = cap;
    }

    function nextSlide() {
      showSlide(ssIndex + 1);
    }
    function prevSlide() {
      showSlide(ssIndex - 1);
    }

    // Start autoplay. The UI intentionally does not show a "pause" state —
    // the center control is a single "play" affordance to (re)start the slideshow.
    function play() {
      if (ssTimer) return;
      isPlaying = true;
      console.log("Starting autoplay");
      ssTimer = setInterval(nextSlide, SS_INTERVAL);
    }
    // Internal pause used only for visibilitychange / cleanup; it does not update UI.
    function pause() {
      if (!ssTimer) return;
      isPlaying = false;
      clearInterval(ssTimer);
      ssTimer = null;
    }

    console.log("Initializing slideshow");
    showSlide(0);
    play();

    // pause autoplay when tab hidden, resume when visible (if it was playing)
    let wasPlayingBeforeHidden = false;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (isPlaying) {
          wasPlayingBeforeHidden = true;
          pause();
        } else {
          wasPlayingBeforeHidden = false;
        }
      } else {
        if (wasPlayingBeforeHidden) {
          play();
          wasPlayingBeforeHidden = false;
        }
      }
    });

    // small parallax on scroll for premium feel
    let lastY = 0;
    function onScroll() {
      lastY = window.scrollY || window.pageYOffset;
      requestAnimationFrame(() => {
        const offset = Math.max(-30, Math.min(30, lastY * -0.03));
        slideshow.style.transform = `translateY(${offset}px)`;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal for gallery items ---------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  figures.forEach((f) => observer.observe(f));

  // contact form handler — send to backend
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = "Sending...";
        btn.disabled = true;
      }
      try {
        const response = await fetch("/send-inquiry", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          console.log("Response OK, calling showNotification for success"); // Debug log
          console.log(
            "showNotification function exists:",
            typeof showNotification
          ); // Debug log
          if (typeof showNotification === "function") {
            showNotification(
              "Thank you! Your inquiry was sent successfully. I'll get back to you soon! ✨",
              "success"
            );
          } else {
            console.error("showNotification function not found!");
          }
          contactForm.reset();
        } else {
          showNotification(
            "Sorry, there was a problem sending your inquiry. Please try again later.",
            "error"
          );
        }
      } catch (err) {
        console.log("Calling showNotification for error"); // Debug log
        console.log(
          "showNotification function exists:",
          typeof showNotification
        ); // Debug log
        if (typeof showNotification === "function") {
          showNotification(
            "Network error. Please check your connection and try again.",
            "error"
          );
        } else {
          console.error("showNotification function not found!");
        }
      }
      if (btn) {
        btn.textContent = "Let's Create Magic Together";
        btn.disabled = false;
      }
    });
  }
})();

// Beautiful notification system - moved outside IIFE to be globally accessible
function showNotification(message, type = "success") {
  console.log("showNotification called with:", message, type); // Debug log

  try {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((n) => n.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    const isSuccess = type === "success";
    const icon = isSuccess ? "✨" : "⚠️";
    const bgColor = isSuccess
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "linear-gradient(135deg, #b08c69 0%, #a67c52 100%)";

    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Styling
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 0;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      z-index: 10000;
      min-width: 320px;
      max-width: 500px;
      transform: translateX(100%);
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    `;

    const content = notification.querySelector(".notification-content");
    content.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
    `;

    const iconEl = notification.querySelector(".notification-icon");
    iconEl.style.cssText = `
      font-size: 20px;
      flex-shrink: 0;
    `;

    const messageEl = notification.querySelector(".notification-message");
    messageEl.style.cssText = `
      flex: 1;
      font-size: 14px;
      line-height: 1.4;
      font-weight: 500;
    `;

    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: rgba(255,255,255,0.8);
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
      flex-shrink: 0;
    `;

    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.background = "rgba(255,255,255,0.1)";
      closeBtn.style.color = "white";
    });

    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.background = "none";
      closeBtn.style.color = "rgba(255,255,255,0.8)";
    });

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove and close button functionality
    const removeNotification = () => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 400);
    };

    closeBtn.addEventListener("click", removeNotification);

    // Auto-remove after delay (longer for success messages)
    const autoRemoveDelay = isSuccess ? 5000 : 4000;
    setTimeout(removeNotification, autoRemoveDelay);
  } catch (error) {
    console.error("Notification system failed:", error);
    console.error("Original message was:", message);
    // Create a simple fallback notification if the fancy one fails
    const fallback = document.createElement("div");
    fallback.textContent = message;
    fallback.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: #333; color: white;
      padding: 15px; border-radius: 8px; z-index: 10000; max-width: 300px;
    `;
    document.body.appendChild(fallback);
    setTimeout(() => fallback.remove(), 4000);
  }
}
