# Build Portfolio Frontend Plan

## 1. Backend API Summary

Base URL: `http://localhost:8000` (FastAPI, mounted at `/api/v1`). Public endpoints require no auth. CORS already allows the frontend origin (see `Backend/app/core/config.py`).

### Main endpoint — `GET /api/v1/public/portfolio`
Returns everything in one call:

```json
{
  "profile": {
    "id": "...",
    "name": "...",
    "headline": "...",
    "short_bio": "...",
    "about": "...",
    "profile_image": {"file_id": "...", "url": "...", "alt": "...", "filename": "...", "content_type": "...", "size": 0} | null,
    "resume": {...} | null,
    "location": "...",
    "email": "...",
    "phone": "...",
    "resume_url": "...",
    "availability": true
  },
  "experiences": [
    {
      "id": "...", "company": "...", "position": "...", "employment_type": "Full-time",
      "location": "...", "start_date": "2024-01", "end_date": "2025-06" | null,
      "is_current": false, "description": "...", "technologies": ["..."],
      "company_url": "...", "logo": {...} | null, "display_order": 0
    }
  ],
  "education": [
    {"id": "...", "institution": "...", "degree": "...", "field": "...",
     "start_date": "2020-08", "end_date": "2024-05" | null, "description": "...",
     "grade": "...", "location": "...", "logo": {...} | null, "display_order": 0}
  ],
  "projects": [
    {"id": "...", "title": "...", "slug": "...", "short_description": "...", "description": "...",
     "thumbnail": {...} | null, "images": [...], "technologies": ["..."],
     "github_url": "...", "live_url": "...", "featured": false, "status": "completed", "display_order": 0}
  ],
  "skills": [{"id": "...", "name": "...", "category": "...", "level": "Intermediate", "icon": "...", "display_order": 0}],
  "certifications": [{"id": "...", "title": "...", "issuer": "...", "issue_date": "2023-09",
     "credential_id": "...", "credential_url": "...", "certificate_image": {...} | null, "display_order": 0}],
  "achievements": [{"id": "...", "title": "...", "description": "...", "date": "...", "url": "...", "icon": "...", "display_order": 0}],
  "social_links": [{"id": "...", "platform": "...", "url": "...", "icon": "...", "display_order": 0, "enabled": true}],
  "settings": {"id": "...", "site_name": "...", "site_tagline": "...", "footer_text": "...", "maintenance_mode": false, "seo": {}}
}
```

### Other public endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/public/experiences` | List experiences |
| GET | `/api/v1/public/education` | List education |
| GET | `/api/v1/public/projects` | List projects |
| GET | `/api/v1/public/projects/{slug}` | Single project detail (404 if not found) |
| GET | `/api/v1/public/skills` | List skills |
| GET | `/api/v1/public/certifications` | List certifications |
| GET | `/api/v1/public/achievements` | List achievements |
| GET | `/api/v1/public/socials` | Enabled social links only |
| POST | `/api/v1/public/contact` | Submit contact form `{name, email, subject, message}` |
| GET | `/health` | Health check |
| GET | `/api/v1/media/{file_id}` | Serve images (public; URLs come from `MediaObject.url`) |
| GET | `/docs` | Swagger UI |

Note: dashboard page should load the single `/public/portfolio` endpoint — one fetch for all sections.

## 2. Frontend Tech Decisions (already in place)
- **React 19 + Vite 8 + TypeScript**, `src/index.css` now imports Tailwind via `@import "tailwindcss"` (v4 is configured through the `@tailwindcss/vite` plugin in `vite.config.ts`).
- Use Tailwind utility classes for all styling; keep dark/light via CSS vars in `index.css` or a `dark` class strategy.
- **shadcn/ui** — component library (Radix primitives + Tailwind). Added via CLI (`npx shadcn@latest add ...`), requires the `@/*` path alias (already set up). All shadcn components live in `src/components/ui/`.
- **framer-motion** — animation library (`framer-motion` package). Use `motion` components (`<motion.div>`, `AnimatePresence`) for section reveals, hero entrance, hover effects, scroll-triggered animations (`whileInView`).
- **react-router-dom** — add for `/projects/:slug` detail page.
- No router/react-router installed yet.

## 3. Proposed Folder Structure

```
src/
  index.css            # Tailwind import + shadcn CSS variables (already set up)
  main.tsx             # BrowserRouter + App
  App.tsx              # Routes + layout shell (Header, Outlet, Footer)
  components/
    ui/                # shadcn/ui components (button, card, badge, input, ...)
    Header.tsx         # site name + nav (from settings + anchors)
    Footer.tsx         # footer_text + social links
    Section.tsx        # reusable section wrapper (id, title, subtitle) + framer-motion reveal
    Motion.tsx         # shared framer-motion variants (fadeUp, stagger, whileInView)  [optional]
  lib/
    api.ts             # fetch wrapper + getPortfolio()/getProject(slug)/submitContact()
    utils.ts           # shadcn `cn()` helper
    types.ts           # TS interfaces mirroring backend schemas
    format.ts          # helpers: formatDate("2024-01" -> "Jan 2024")
  hooks/
    usePortfolio.ts    # hooks / context that loads /public/portfolio once
  sections/
    Hero.tsx           # profile.name, headline, short_bio, profile_image, availability, resume_url
    About.tsx          # profile.about
    Skills.tsx         # grouped by skill.category
    Projects.tsx       # projects (featured grid, links to detail)
    Experience.tsx     # timeline from experiences
    Education.tsx      # education cards
    Certifications.tsx # certifications list
    Achievements.tsx   # achievements grid
    Contact.tsx        # contact form -> POST /public/contact
  pages/
    Home.tsx           # renders all sections in order
    ProjectDetail.tsx  # GET /public/projects/{slug} via slug param
```

## Animation conventions (framer-motion)
- **Section reveals:** wrap each section in `<motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>`.
- **Stagger lists** (projects, skills, timeline): use `container` variants with `staggerChildren` + child `item` variants.
- **Hero entrance:** animate on mount (`initial` → `animate`), not just on scroll.
- **Page transitions:** optional `AnimatePresence` around routed pages.
- Keep `prefers-reduced-motion` in mind (`useReducedMotion` from framer-motion where heavy animation is used).

## 4. Implementation Steps

### Step 1 — Types (`src/lib/types.ts`)
Define `Portfolio`, `Profile`, `Experience`, `Education`, `Project`, `Skill`, `Certification`, `Achievement`, `SocialLink`, `SiteSettings`, `MediaObject` , and a `ContactPayload`/`ContactResponse` — mirroring the schemas above.

### Step 2 — API layer (`src/lib/api.ts`)
- `const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1'` (same-origin). In dev, `vite.config.ts` proxies `/api` and `/health` → `http://localhost:8000`, so no CORS errors regardless of dev port. Set `VITE_API_URL` (`.env.local`) for production/deployments where a proxy isn't available.
- `async function request<T>(path, options)` with `Content-Type: application/json`, error handling that surfaces `detail`.
- `getPortfolio(): Promise<Portfolio>` → `GET /public/portfolio`.
- `getProject(slug): Promise<Project>` → `GET /public/projects/{slug}`.
- `submitContact(payload): Promise<ContactResponse>` → `POST /public/contact`.

### Step 3 — Data loading (`src/hooks/usePortfolio.ts`)
- `PortfolioProvider` + `usePortfolio()` context: fetch on mount, expose `{ data, loading, error, refresh }`.
- Show a loading spinner and an error state with a retry button.

### Step 4 — Layout
- `Header` — site name from `settings.site_name`, sticky nav with anchor links to sections (`#about`, `#skills`, `#projects`, `#experience`, `#contact`).
- `Footer` — `settings.footer_text` + social links from `social_links`.
- Redirect handling when `settings.maintenance_mode` is true (optional).

### Step 5 — Sections (Home page)
- **Hero:** profile image (use `MediaObject.url`), name, headline, short_bio, available badge, `resume_url` / `resume.url` download button.
- **About:** render `profile.about` (support paragraphs/markdown-ish line breaks).
- **Skills:** group `skills` by `category`, render chips with `name` + `level`.
- **Projects:** show featured projects first; card uses `thumbnail.url`, `short_description`, `technologies`, `github_url`, `live_url`, and a card link to `/projects/{slug}`.
- **Experience:** vertical timeline using `start_date`/`end_date`/`is_current`, company, position, `technologies`.
- **Education:** cards with institution, degree, field, dates, grade.
- **Certifications:** issuer, title, `issue_date`, `credential_url`.
- **Achievements:** grid of title + description + url.
- **Contact:** form `{name, email, subject, message}` → `submitContact`, built with shadcn `Form`/`Input`/`Textarea` + `Button`; toasts via `sonner`; validate `message >= 10 chars`; success/error feedback; also show profile.email + location.

### Step 6 — Project detail page
- Route `/projects/:slug`, fetch single project, render full `description`, image gallery (`images`), tech stack, `live_url`/`github_url` buttons.

### Step 7 — Styling polish
- Implement all styling with Tailwind utilities + shadcn components (respect `components.json` theme variables).
- Respect `prefers-color-scheme` by toggling a `dark` class on `<html>`; keep shadcn CSS variable tokens as the single source of truth for colors.
- Mobile responsive: nav collapses, grids go single-column via `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- Add framer-motion reveals/per-section stagger; keep animations subtle and performant.

## 5. Suggested Order of Work
0. ~~Setup~~ (DONE): shadcn/ui initialized (Nova preset, Geist font, CSS variables in `index.css`), framer-motion 13 installed, `@/*` alias configured in `vite.config.ts`/`tsconfig.app.json`. Components added: `button`, `card`, `badge`, `input`, `label`, `textarea`, `separator`, `skeleton`, `sonner` (in `src/components/ui/`). ESLint tuned to ignore `react-refresh/only-export-components` in `src/components/ui/**`.
1. Types 2. API layer 3. Data hook/context 4. Layout (Header/Footer) 5. Home sections (Hero → Contact) 6. Detail page + routing 7. Contact form wiring 8. Polish + responsive + animations + empty/error states.

## 6. Pitfalls / Notes
- `start_date`/`end_date` come as `"YYYY-MM"` strings — format client-side.
- `MediaObject.url` already points at the backend media endpoint; use as `src` directly.
- Order data by `display_order` as returned (backend already orders).
- `is_current: true` projects/experience mean no end date.
- Backend runs on port 8000 by default; if it differs, update the proxy `target` in `vite.config.ts` or set `VITE_API_URL` via `.env.local`.
- shadcn components import from `@/lib/utils` (`cn`) and rely on CSS variables in `index.css` — don't remove them.
- For dark mode with shadcn + Tailwind v4, the `dark` class variant is configured in `index.css` (`@custom-variant dark`); toggle the class on `<html>`.