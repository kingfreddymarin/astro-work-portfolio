# Portfolio — Astro

A clean, minimal personal portfolio built with [Astro](https://astro.build).
Ships near-zero JavaScript. Fast by default.

## Quick start

```bash
npm install
npm run dev        # localhost:4321
npm run build      # production build → dist/
npm run preview    # preview the build locally
```

## Customize your content

All your personal info lives in one file:

```
src/data/portfolio.js
```

Edit your name, bio, projects, skills, and links there —
no need to touch any component files.

## Project structure

```
src/
├── data/
│   └── portfolio.js      ← Edit this to personalize
├── components/
│   ├── Nav.astro
│   ├── Hero.astro
│   ├── About.astro
│   ├── Projects.astro
│   ├── Skills.astro
│   ├── Contact.astro
│   └── Footer.astro
├── layouts/
│   └── Layout.astro      ← SEO meta tags live here
├── pages/
│   └── index.astro       ← Composes all components
└── styles/
    └── global.css        ← Design tokens & shared styles
```

## Deploy to Vercel (recommended)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select your repo — Vercel auto-detects Astro
4. Click Deploy ✓

## Deploy to Netlify

```bash
npm run build
# drag-and-drop the dist/ folder to netlify.com/drop
```

## Update `astro.config.mjs`

Set your real domain:
```js
site: 'https://yourname.dev',
```
