# Agent instructions

See [CLAUDE.md](./CLAUDE.md) — it is the single source of working notes for this repo.

The short version: this repo deploys the **root Astro app** to https://fjml-studio.web.app;
the site is one route with nine client-side views; and `.view > section { min-height: 0 }` in
`src/styles/global.css` is load-bearing — overriding it silently breaks scrolling on mobile.
