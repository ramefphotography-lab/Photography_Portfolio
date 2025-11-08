// Ultra-smooth slideshow with perfect right-to-left sliding
(function () {
  "use strict";

  if (window.slideshowInitialized) return;
  window.slideshowInitialized = true;

  const SLIDE_DURATION = 3000;
  const slides = document.querySelectorAll(".hero-slideshow .slide");
  const caption = document.querySelector(".hero-slideshow .slideshow-caption");
  const prevBtn = document.getElementById("ss-prev");
  const nextBtn = document.getElementById("ss-next");

  let currentIndex = 0;
  let isAnimating = false;
  let autoTimer = null;

  if (!slides || slides.length === 0) return;

  // Initialize images
  slides.forEach((slide, index) => {
    const dataSrc = slide.getAttribute("data-src");
    if (dataSrc) {
      slide.innerHTML = "";

      const img = document.createElement("img");
      img.src = dataSrc;
      img.alt = slide.getAttribute("data-caption") || `Slide ${index + 1}`;
      img.loading = "eager";
      img.decoding = "sync";
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
        opacity: 0;
        transition: opacity 0.5s ease;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        backface-visibility: hidden;
        transform: translateZ(0);
      `;

      img.onload = () => (img.style.opacity = "1");
      img.onerror = () => {
        slide.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#333;color:#fff;font-size:18px;">
            Image ${index + 1} not found
          </div>
        `;
      };

      slide.appendChild(img);
    }
  });

  // Slide transition function with direction support
  function goToSlide(targetIndex, direction = "next") {
    if (isAnimating || targetIndex === currentIndex) return;

    // Normalize index
    if (targetIndex >= slides.length) targetIndex = 0;
    if (targetIndex < 0) targetIndex = slides.length - 1;

    isAnimating = true;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[targetIndex];

    // Reset all slides to default position
    slides.forEach((slide) => {
      slide.classList.remove("active", "sliding-out");
      slide.style.zIndex = "1";
    });

    // Set up initial positions based on direction
    if (direction === "next") {
      // Next: slides come from right to left
      slides.forEach((slide) => (slide.style.transform = "translateX(100%)"));
      currentSlide.style.transform = "translateX(0)";
      currentSlide.style.zIndex = "2";
      nextSlide.style.transform = "translateX(100%)";
      nextSlide.style.zIndex = "3";
    } else {
      // Previous: slides come from left to right
      slides.forEach((slide) => (slide.style.transform = "translateX(-100%)"));
      currentSlide.style.transform = "translateX(0)";
      currentSlide.style.zIndex = "2";
      nextSlide.style.transform = "translateX(-100%)";
      nextSlide.style.zIndex = "3";
    }

    // Force reflow
    nextSlide.offsetHeight;

    // Start animation
    requestAnimationFrame(() => {
      if (direction === "next") {
        // Next: current slide moves left, new slide enters from right
        currentSlide.style.transform = "translateX(-100%)";
        nextSlide.style.transform = "translateX(0)";
      } else {
        // Previous: current slide moves right, new slide enters from left
        currentSlide.style.transform = "translateX(100%)";
        nextSlide.style.transform = "translateX(0)";
      }

      // Update caption immediately
      if (caption) {
        caption.textContent =
          slides[targetIndex].getAttribute("data-caption") || "";
      }

      currentIndex = targetIndex;

      // Animation complete
      setTimeout(() => {
        isAnimating = false;
      }, 1200);
    });
  }

  // Navigation functions
  function nextSlide() {
    goToSlide((currentIndex + 1) % slides.length, "next");
  }

  function prevSlide() {
    goToSlide((currentIndex - 1 + slides.length) % slides.length, "prev");
  }

  // Auto-play control
  function startAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, SLIDE_DURATION);
  }

  function stopAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function restartAutoPlay() {
    stopAutoPlay();
    setTimeout(startAutoPlay, 100);
  }

  // Manual navigation
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      prevSlide();
      restartAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      nextSlide();
      restartAutoPlay();
    });
  }

  // Initialize
  if (slides.length > 0) {
    slides[currentIndex].style.transform = "translateX(0)";
    slides[currentIndex].style.zIndex = "3";

    if (caption) {
      caption.textContent =
        slides[currentIndex].getAttribute("data-caption") || "";
    }

    startAutoPlay();
  }

  // Cleanup
  window.addEventListener("beforeunload", stopAutoPlay);
})();
