# Ankorius landing page

Plain HTML/CSS/JS — no build step. Open `index.html` directly, or serve the folder with any static host (Netlify, Vercel, S3, GitHub Pages, etc.).

## Before you launch

1. **Logo** — save your logo file as `assets/logo.png` (transparent background works best, ~76px tall @2x). It'll swap in automatically; the text wordmark shows until then.
2. **Contact form** — the form posts to a placeholder Formspree endpoint. To make it live:
   - Create a free form at [formspree.io](https://formspree.io) (or use your own backend).
   - In `index.html`, replace `YOUR_FORM_ID` in the `<form action="https://formspree.io/f/YOUR_FORM_ID">` line with your real form ID.
3. **Phone & email** — currently set to `+44 7444 434280` and `info@ankorius.com` throughout `index.html` (header, contact section, footer). Update in those spots if they ever change.
4. **Copy** — service descriptions, the About text, and process steps are starting copy based on "cleaning, maintenance, electrical, waste removal" — edit freely in `index.html` to match your exact offering and tone.

## Structure

- `index.html` — all page content/sections
- `css/styles.css` — design tokens (colors, type, spacing) + all styling
- `js/main.js` — mobile nav, scroll reveal, sticky header, form validation/submit
- `assets/` — drop `logo.png` here
