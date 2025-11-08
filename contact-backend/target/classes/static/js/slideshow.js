// Simple slideshow script for .hero-slideshow
(function () {
  const slides = Array.from(
    document.querySelectorAll(".hero-slideshow .slide")
  );
  const caption = document.querySelector(".hero-slideshow .slideshow-caption");
  const prevBtn = document.getElementById("ss-prev");
  const nextBtn = document.getElementById("ss-next");
  let current = 0;
  let timer = null;

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      if (!slide.imgEl) {
        // Lazy create image element
        const img = document.createElement("img");
        img.src = slide.getAttribute("data-src");
        img.alt = slide.getAttribute("data-caption") || "";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        img.style.background = "#222";
        img.onerror = function () {
          img.style.display = "none";
          if (!slide.errorMsg) {
            const msg = document.createElement("div");
            msg.textContent = "Image not found: " + img.src;
            msg.style.color = "#fff";
            msg.style.background = "#222";
            msg.style.padding = "32px";
            msg.style.textAlign = "center";
            msg.style.position = "absolute";
            msg.style.top = 0;
            msg.style.left = 0;
            msg.style.right = 0;
            msg.style.bottom = 0;
            slide.appendChild(msg);
            slide.errorMsg = msg;
          }
        };
        slide.appendChild(img);
        slide.imgEl = img;
      }
      if (i === idx) {
        slide.classList.add("active");
        if (slide.imgEl) slide.imgEl.style.display = "block";
        if (slide.errorMsg) slide.errorMsg.style.display = "block";
      } else {
        slide.classList.remove("active");
        if (slide.imgEl) slide.imgEl.style.display = "none";
        if (slide.errorMsg) slide.errorMsg.style.display = "none";
      }
    });
    if (caption) {
      caption.textContent = slides[idx].getAttribute("data-caption") || "";
    }
    current = idx;
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }
  function prevSlide() {
    showSlide((current - 1 + slides.length) % slides.length);
  }

  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  // Autoplay every 4s
  function startAutoplay() {
    timer = setInterval(nextSlide, 4000);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  showSlide(0);
  startAutoplay();

  // Pause on hover
  const slideshow = document.querySelector(".hero-slideshow");
  if (slideshow) {
    slideshow.addEventListener("mouseenter", stopAutoplay);
    slideshow.addEventListener("mouseleave", startAutoplay);
  }
})();
