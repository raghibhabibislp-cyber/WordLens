/**
 * WordLens — Tailwind Play CDN configuration.
 * Loaded after the Tailwind CDN script and before the application script.
 * Palette channels live in css/styles.css so one token set drives Tailwind
 * utilities and hand-written CSS alike.
 */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        linen: "rgb(var(--wl-linen-rgb) / <alpha-value>)",
        parchment: "rgb(var(--wl-parchment-rgb) / <alpha-value>)",
        stoneDesk: "rgb(var(--wl-stone-desk-rgb) / <alpha-value>)",
        espresso: "rgb(var(--wl-espresso-rgb) / <alpha-value>)",
        umber: "rgb(var(--wl-umber-rgb) / <alpha-value>)",
        sage: "rgb(var(--wl-sage-rgb) / <alpha-value>)",
        sageLight: "rgb(var(--wl-sage-light-rgb) / <alpha-value>)",
        riverSlate: "rgb(var(--wl-river-slate-rgb) / <alpha-value>)",
        slateLight: "rgb(var(--wl-slate-light-rgb) / <alpha-value>)",
        terracotta: "rgb(var(--wl-terracotta-rgb) / <alpha-value>)",
        brass: "rgb(var(--wl-brass-rgb) / <alpha-value>)",
        nightDesk: "rgb(var(--wl-night-desk-rgb) / <alpha-value>)",
        nightCard: "rgb(var(--wl-night-card-rgb) / <alpha-value>)",
        nightBorder: "rgb(var(--wl-night-border-rgb) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--wl-font-serif)"],
        sans: ["var(--wl-font-sans)"],
        mono: ["var(--wl-font-mono)"],
      },
      boxShadow: {
        archival: "var(--wl-shadow-archival)",
        "index-card": "var(--wl-shadow-index-card)",
        tactile: "var(--wl-shadow-tactile)",
      },
    },
  },
};
