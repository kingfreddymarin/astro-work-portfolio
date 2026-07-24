# FJML Studio Refactor: Split Architecture

## Overview

This monorepo refactors the original single-app Astro portfolio into two focused applications:

1. **portfolio-nextjs** — Marketing site (home, about, work, services, contact)
2. **dashboard-remix** — Operations dashboard (inbox, tasks, workbench)

Both apps share a unified Firebase backend and FJML brand design system.

## Architecture

```
studio-workspace/
├── packages/
│   ├── shared/              # Shared types, email-templates, firebase config
│   ├── firebase/            # Firebase SDKs (future)
│   └── ui/                  # Brand components (future)
│
├── apps/
│   ├── portfolio-nextjs/    # Marketing site (Next.js)
│   ├── dashboard-remix/     # Operations dashboard (React Router)
│   ├── legacy-astro/        # Original Astro app (deprecated)
│   └── functions/           # Cloud Functions
│
├── pnpm-workspace.yaml
└── root package.json
```

## Quick Start

### Development

```bash
# Install dependencies (monorepo root)
pnpm install

# Run portfolio dev server
pnpm run dev:portfolio

# Run dashboard dev server
pnpm run dev:dashboard

# Run Astro (legacy) dev server
pnpm run dev:astro
```

### Build

```bash
# Build all apps
pnpm run build:all

# Build specific app
pnpm run build:portfolio
pnpm run build:dashboard
```

## Shared Infrastructure

### Firebase

- **Project**: fjml-studio
- **Database**: Firestore
- **Collections**:
  - `leads` — Inquiries from portfolio contact form (written by portfolio, read by dashboard)
  - `builds` — Saved configurations (CRUD by authenticated users)
  - `shared_builds` — Public configurations
  - `tasks` — Dashboard task board (admin-only)
  - `kb_pages` / `kb_settings` — Studio Knowledge app (separate)

### Email Templates

Shared via `@fjml-studio/shared/email-templates`. Used by:
- Cloud Functions (send transactional emails on lead creation)
- Portfolio API route (fallback mailto if Firebase unavailable)
- Dashboard (future: email preview in inbox)

## Apps

### Portfolio (Next.js)

**Purpose**: Marketing site, lead capture

**Routes**:
- `/` — Home (hero)
- `/about` — About, FAQ
- `/work` — Case studies
- `/services` — Services, configurator (future)
- `/contact` — Contact form + lead submission
- `/api/leads` — POST endpoint to write leads to Firestore

**Key Files**:
- `src/app/layout.tsx` — Root layout with nav/footer
- `src/app/globals.css` — FJML brand styling
- `src/app/api/leads/route.ts` — Lead submission API

**Deployment**: Vercel (recommended) or Firebase Hosting

### Dashboard (React Router)

**Purpose**: Admin/operator interface for leads, tasks, configurations

**Routes**:
- `/` — Redirect to /login
- `/login` — Google Sign-In
- `/dashboard` — Inbox (leads list), Tasks pane, Workbench
- `/logout` — Logout endpoint

**Key Files**:
- `app/routes/login.tsx` — Firebase authentication
- `app/routes/dashboard.tsx` — Main dashboard with leads inbox
- `app/app.css` — Base styling

**Features** (MVP):
- ✅ Google Sign-In via Firebase Auth
- ✅ Displays all leads from Firestore in inbox
- ✅ Responsive layout with FJML branding
- 🔮 Task board (TODO)
- 🔮 Workbench (saved builds) (TODO)
- 🔮 Admin/operator role separation (TODO)

**Deployment**: Vercel (recommended) or Firebase Hosting

## Firestore Rules

Existing rules handle both apps:

```
- Portfolio can: CREATE leads, CREATE/UPDATE/DELETE own builds, READ shared_builds
- Dashboard can: READ all leads (admin), READ/CREATE tasks
- All authenticated users: READ/UPDATE own data
```

Rules already in place; no changes needed for split.

## Migration Checklist

- [x] **Phase 1**: Monorepo setup
  - [x] Create pnpm workspace
  - [x] Extract shared packages (types, email-templates, config)
  - [x] Scaffold portfolio-nextjs
  - [x] Scaffold dashboard-remix

- [x] **Phase 2**: Portfolio migration
  - [x] Pages: home, about, work, services, contact
  - [x] Lead submission form + API route
  - [x] Brand styling (FJML Signal design system)
  - [ ] Configurator component (Astro → React)
  - [ ] Case study overlays (future)

- [x] **Phase 3**: Dashboard extraction
  - [x] Auth (Google Sign-In)
  - [x] Leads inbox (list from Firestore)
  - [ ] Task board (CRUD)
  - [ ] Workbench (saved builds)
  - [ ] Studio apps launcher (link to PromptCraft, Studio Knowledge)
  - [ ] Admin vs operator role separation

- [ ] **Phase 4**: Integration & deployment
  - [ ] Test cross-app data flow (portfolio writes leads → dashboard reads)
  - [ ] Verify email notifications still work via Cloud Functions
  - [ ] SSO handover between apps (dashboard → studio apps)
  - [ ] DNS/domain setup (portfolio.*, dashboard.*, etc.)

- [ ] **Phase 5**: Cutover
  - [ ] Deploy portfolio-nextjs to production
  - [ ] Deploy dashboard-remix to production
  - [ ] Update fjml-studio.web.app to point to portfolio
  - [ ] Monitor and rollback if needed
  - [ ] Archive Astro app, tag as v1.0.0-final

## Key Decisions

| Aspect | Choice | Why |
|--------|--------|-----|
| **Portfolio framework** | Next.js | SEO, server-side rendering, industry standard for marketing sites |
| **Dashboard framework** | React Router | Server-side data loading, form actions, lighter than remix v2 |
| **Firebase** | Single project | Shared auth, simpler ops, existing setup |
| **Monorepo** | Yes | Shared code, unified CI/CD, easier version management |
| **Hosting** | Vercel + Firebase Hosting | Fast, integrated Git, no vendor lock-in |
| **Auth** | Firebase + Google Sign-In | No changes, already working across apps |

## Gotchas & Known Issues

1. **Email templates duplication**: Currently shared via import. Could move to Firestore or env-based config if needed.
2. **Third-party cookie restrictions**: If apps on different domains, SSO handover via query params + localStorage.
3. **Configurator**: Largest component (48KB). Deferred to phase 2 — migrating it to React is a substantial task.
4. **Task persistence**: Task board currently client-only. Add `tasks` collection in Firestore for persistence.
5. **Admin access**: Currently, anyone who can auth can see all leads. Implement role check in Firestore rules.

## Running Locally

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Firebase CLI (for functions/rules deployment)

### Setup

```bash
# Clone and install
cd ~/Documents/projects/astro-work-portfolio
pnpm install

# Set up environment (if needed)
# Create .env files in portfolio-nextjs and dashboard-remix with Firebase config
# (already embedded in code for MVP)

# Run dev servers in separate terminals
pnpm run dev:portfolio   # http://localhost:3000
pnpm run dev:dashboard   # http://localhost:5173
```

### Testing Lead Flow

1. Go to portfolio `/contact`, submit a lead
2. Check Firestore console to verify it was written
3. Go to dashboard, log in with Google
4. Verify the lead appears in the inbox

## Deployment

### Portfolio (Next.js)

```bash
cd apps/portfolio-nextjs
npm run build
npm run start  # local test
# Or push to Vercel for auto-deploy
```

### Dashboard (React Router)

```bash
cd apps/dashboard-remix
npm run build
npm run start  # local test
# Or push to Vercel for auto-deploy
```

### Cloud Functions

```bash
cd functions
firebase deploy --only functions
```

## Future Work

1. **Configurator**: Migrate Astro component to React
2. **Task board**: Add Firestore persistence
3. **Workbench**: Show saved builds, allow editing
4. **Studio apps launcher**: Update links, SSO handover
5. **Admin dashboard**: Role-based access, user management
6. **Email templates**: Move to Firestore or shared static config
7. **Analytics**: Integrate with Google Analytics / Mixpanel
8. **Mobile**: Responsive improvements for dashboard on mobile

## Support

For issues or questions:
- Check Firestore rules in `firestore.rules`
- Review Cloud Functions logs in Firebase console
- Verify Firebase config in `packages/shared/src/firebase-config.ts`
