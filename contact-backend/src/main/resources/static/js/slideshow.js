// Ultra-smooth slideshow with perfect right-to-left sliding
(function () {
  "use strict";

  if (window.slideshowInitialized) return;
  window.slideshowInitialized = true;

  // Ensure DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlideshow);
  } else {
    initSlideshow();
  }

  function initSlideshow() {
    const SLIDE_DURATION = 3000;
    const slides = document.querySelectorAll(".hero-slideshow .slide");
    const prevBtn = document.getElementById("ss-prev");
    const nextBtn = document.getElementById("ss-next");
    const dots = document.querySelectorAll(".dot");

    console.log("Slideshow initialization:");
    console.log("- Slides found:", slides.length);
    console.log("- Dots found:", dots.length);

    let currentIndex = 0;
    let isAnimating = false;
    let autoTimer = null;

    if (!slides || slides.length === 0) {
      console.error(
        "No slides found! Make sure .hero-slideshow .slide elements exist."
      );
      return;
    }

    console.log("Starting image initialization...");

    // Initialize images
    slides.forEach((slide, index) => {
      const dataSrc = slide.getAttribute("data-src");
      console.log(`Slide ${index}: data-src = "${dataSrc}"`);

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
          background: transparent;
        `;

        img.onload = () => {
          console.log(`Image ${index} loaded successfully: ${dataSrc}`);
          img.style.opacity = "1";
          slide.style.background = "transparent";
        };

        img.onerror = (e) => {
          console.error(`Failed to load image ${index}: ${dataSrc}`, e);
          slide.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f0f0f0;color:#333;font-size:18px;text-align:center;padding:20px;">
              <div>
                <div>Image ${index + 1} failed to load</div>
                <div style="font-size:12px;margin-top:10px;opacity:0.7;">${dataSrc}</div>
              </div>
            </div>
          `;
        };

        slide.appendChild(img);
      } else {
        console.warn(`Slide ${index} has no data-src attribute`);
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
        slides.forEach(
          (slide) => (slide.style.transform = "translateX(-100%)")
        );
        currentSlide.style.transform = "translateX(0)";
        currentSlide.style.zIndex = "2";
        nextSlide.style.transform = "translateX(-100%)";
        nextSlide.style.zIndex = "3";
      }

      // Force reflow
      nextSlide.offsetHeight;

      // Update index and dots
      currentIndex = targetIndex;
      updateDots();

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

        // Caption functionality removed

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

    // Dots functions
    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    function goToSlideFromDot(index) {
      if (index !== currentIndex && !isAnimating) {
        // Calculate the shortest path for smooth transitions
        const totalSlides = slides.length;
        const forwardDistance =
          (index - currentIndex + totalSlides) % totalSlides;
        const backwardDistance =
          (currentIndex - index + totalSlides) % totalSlides;

        // Choose direction based on shortest path
        const direction = forwardDistance <= backwardDistance ? "next" : "prev";
        goToSlide(index, direction);
      }
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

    // Dot click listeners
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goToSlideFromDot(index);
        restartAutoPlay();
      });
    });

    // Initialize
    if (slides.length > 0) {
      console.log("Initializing slideshow with", slides.length, "slides");

      // Ensure all slides start hidden except the first one
      slides.forEach((slide, index) => {
        slide.style.position = "absolute";
        slide.style.top = "0";
        slide.style.left = "0";
        slide.style.width = "100%";
        slide.style.height = "100%";

        if (index === currentIndex) {
          slide.style.transform = "translateX(0)";
          slide.style.zIndex = "3";
          slide.classList.add("active");
          console.log(`First slide (${index}) made active`);
        } else {
          slide.style.transform = "translateX(100%)";
          slide.style.zIndex = "1";
          slide.classList.remove("active");
        }
      });

      // Initialize dots
      updateDots();

      startAutoPlay();
    }

    // Cleanup
    window.addEventListener("beforeunload", stopAutoPlay);
  } // End initSlideshow function
})();
