// Premium effects and animations
(function () {
  "use strict";

  // Typewriter effect for brand title
  function initTypewriter() {
    const textElement = document.querySelector(".typewriter-text");
    const cursorElement = document.querySelector(".typewriter-cursor");
    const fullText = "Eternal Focus Photography";

    if (!textElement) return;

    let currentIndex = 0;
    const typeSpeed = 120; // milliseconds per character

    function typeCharacter() {
      if (currentIndex < fullText.length) {
        textElement.textContent += fullText.charAt(currentIndex);
        currentIndex++;
        setTimeout(typeCharacter, typeSpeed);
      } else {
        // After typing is complete, stop cursor blinking after 2 seconds
        setTimeout(() => {
          if (cursorElement) {
            cursorElement.style.display = "none";
          }
        }, 2000);
      }
    }

    // Start typing after a small delay
    setTimeout(typeCharacter, 500);
  }

  // Enhanced scroll reveal animation with directional slides
  function initScrollReveal() {
    // More aggressive observer settings for better triggering
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add a small delay to make the animation more noticeable
          setTimeout(() => {
            entry.target.classList.add("revealed");
          }, 100);
        } else {
          // Remove the revealed class when element exits viewport
          // This allows the animation to retrigger when scrolling back
          entry.target.classList.remove("revealed");
        }
      });
    }, observerOptions);

    // Wait for DOM to be fully loaded before setting up animations
    setTimeout(() => {
      // Section animations now handled by individual elements within sections
      console.log("Setting up individual element animations...");

      // Testimonial cards - alternating upward cascade
      document.querySelectorAll(".testimonial-card").forEach((card, index) => {
        // Testimonials alternate between slide-up and slight angle variations
        const testimonialPatterns = ["slide-up", "slide-left", "slide-right"];
        const direction =
          testimonialPatterns[index % testimonialPatterns.length];
        card.classList.add("scroll-reveal", direction);
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
      });

      // Add animations to section headers individually
      document
        .querySelectorAll(
          ".services-header, .testimonials-header, .highlights-header, .contact-header"
        )
        .forEach((header, index) => {
          header.classList.add("scroll-reveal", "slide-up");
          header.style.transitionDelay = `${index * 0.1}s`;
          observer.observe(header);
        });

      // Add directional animations to individual elements within sections

      // Artist Introduction Section - Photo from left, Text from right
      const introLeft = document.querySelector(".intro-left");
      const introRight = document.querySelector(".intro-right");
      if (introLeft) {
        introLeft.classList.add("scroll-reveal", "slide-left");
        introLeft.style.transitionDelay = "0.2s";
        observer.observe(introLeft);
      }
      if (introRight) {
        introRight.classList.add("scroll-reveal", "slide-right");
        introRight.style.transitionDelay = "0.4s";
        observer.observe(introRight);
      }

      // Contact Section - Image from left, Form from right
      const contactLeft = document.querySelector(".contact-left");
      const contactRight = document.querySelector(".contact-right");
      if (contactLeft) {
        contactLeft.classList.add("scroll-reveal", "slide-left");
        contactLeft.style.transitionDelay = "0.2s";
        observer.observe(contactLeft);
      }
      if (contactRight) {
        contactRight.classList.add("scroll-reveal", "slide-right");
        contactRight.style.transitionDelay = "0.4s";
        observer.observe(contactRight);
      }

      // Services masonry - dynamic directional animations
      const serviceCards = document.querySelectorAll(".service-card");
      serviceCards.forEach((card, index) => {
        // More varied animation patterns
        const patterns = [
          "slide-left",
          "slide-right",
          "slide-up",
          "slide-down",
          "slide-left",
          "slide-right", // Favor horizontal slides for services
        ];
        const direction = patterns[index % patterns.length];
        card.classList.remove(
          "scroll-reveal",
          "slide-up",
          "slide-left",
          "slide-right",
          "slide-down"
        );
        card.classList.add("scroll-reveal", direction);
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
      });

      // Portfolio highlights - dynamic alternating patterns
      const highlightItems = document.querySelectorAll(".highlight-item");
      highlightItems.forEach((item, index) => {
        // Create wave-like pattern: left, up, right, down, repeat
        const wavePattern = [
          "slide-left",
          "slide-up",
          "slide-right",
          "slide-down",
        ];
        const direction = wavePattern[index % wavePattern.length];
        item.classList.remove(
          "scroll-reveal",
          "slide-up",
          "slide-left",
          "slide-right",
          "slide-down"
        );
        item.classList.add("scroll-reveal", direction);
        item.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(item);
      });
    }, 500); // Wait 500ms after DOM load
  }

  // Smooth scrolling for anchor links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // Parallax effect for slideshow
  function initParallax() {
    const slideshow = document.querySelector(".hero-slideshow");
    if (!slideshow) return;

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const speed = scrolled * 0.5;
      slideshow.style.transform = `translateY(${speed}px)`;
    });
  }

  // Dynamic header background on scroll
  function initDynamicHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      if (scrolled > 50) {
        header.style.background = "rgba(255, 255, 255, 0.95)";
        header.style.backdropFilter = "blur(20px)";
        header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
      } else {
        header.style.background = "rgba(255, 255, 255, 0.05)";
        header.style.backdropFilter = "blur(10px)";
        header.style.boxShadow = "none";
      }
    });
  }

  // Magnetic effect for buttons (disabled for stability)
  function initMagneticButtons() {
    // Magnetic effect disabled to prevent unwanted button movement
    // Buttons now use stable hover effects from CSS only
  }

  // Add loading animation
  function initLoadingAnimation() {
    window.addEventListener("load", () => {
      document.body.style.opacity = "0";
      document.body.style.transition = "opacity 0.5s ease";

      setTimeout(() => {
        document.body.style.opacity = "1";
      }, 100);
    });
  }

  // Typewriter effect for main title
  function initTypewriterEffect() {
    const title = document.querySelector(".brand-text h1");
    if (!title) return;

    const text = title.textContent;
    title.textContent = "";
    title.style.borderRight = "2px solid var(--accent)";

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          title.style.borderRight = "none";
        }, 1000);
      }
    }, 100);
  }

  // Initialize all effects when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    initTypewriter();
    initSmoothScrolling();
    initParallax();
    initDynamicHeader();
    initMagneticButtons();
    initLoadingAnimation();

    // Initialize scroll reveal after a small delay to ensure all elements are rendered
    setTimeout(() => {
      initScrollReveal();
    }, 300);
  });

  // Also initialize on window load as backup
  window.addEventListener("load", () => {
    setTimeout(() => {
      initScrollReveal();
    }, 500);
  });
})();
