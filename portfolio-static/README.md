Photoshoot Portfolio — Premium Static UI

This project is a premium-looking static photography portfolio scaffold. It uses pure HTML/CSS/JS (no build step required) and includes six SVG placeholder images so you can open it locally.

What's included

- `index.html` — updated premium UI with hero, filter chips, masonry gallery, contact CTA, and footer
- `css/styles.css` — premium styles (hero, glass cards, masonry layout, transitions)
- `js/gallery.js` — gallery script with filtering, animated lightbox, keyboard + touch support, and neighbor preloading
- `images/*.svg` — 6 placeholder images

How to run locally

Open the `index.html` file in your browser. On macOS you can run:

```zsh
open /Users/lakshmigunapati/Downloads/Photoshoot-Portfolio/portfolio-static/index.html
```

Or run a simple local server (recommended for development):

```zsh
cd /Users/lakshmigunapati/Downloads/Photoshoot-Portfolio/portfolio-static
python3 -m http.server 8000
# then open http://localhost:8000
```

Features & next steps

- Filters: click chips to filter by category (Weddings, Portraits, Landscapes, Street).
- Masonry layout: CSS-based responsive columns for a magazine-like feel.
- Lightbox: animated, keyboard navigable, and supports basic touch swipes on mobile.
 - Full-bleed slideshow: autoplaying cinematic slideshow with play/pause controls and captions (pauses on hidden tabs).
- Replace placeholders with real JPG/WEBP files and add `srcset` variants for responsive images.
- Improve accessibility: add full focus-trap in the lightbox and ARIA roles for controls.
- Optional: I can scaffold a Next.js version with automatic image optimization and per-photo pages for SEO if you want a deploy-ready site.

Tell me which improvement you'd like me to implement next (replace placeholders with sample JPEGs and srcset, scaffold Next.js, add contact form, or tweak the UI colors/typography). I can implement it now.
