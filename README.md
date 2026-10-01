# Wishly — PS 02 Custom Occasion Page Generator | Team Wishly

Fill a short form, upload a few photos, and get an animated birthday / anniversary / farewell website with its own shareable link, QR code and WhatsApp preview.

## Team

| Name | Roll No. | GitHub | Primary responsibility |
|------|----------|--------|------------------------|
| Keshav Mittal | — | [@keshavmittal09](https://github.com/keshavmittal09) | Backend lead: models, auth, pages API, public API (lock/password/views), wishes, admin API, seed |
| Kratika Rathi | — | [@kratikarathi123](https://github.com/kratikarathi123) | Frontend: 6-step wizard, live phone preview, autosave, media & music steps, auth pages |
| Khushi Saraswat | — | [@Khushi-saraswat-007](https://github.com/Khushi-saraswat-007) | Motion / UI lead: Wishly design, intro / hero / message sections, Y2K Chrome, Group Chat, Neon Night |
| Khush Agnihotri | — | [@Khushagnihotri](https://github.com/Khushagnihotri) | Motion: gallery, video, timeline, finale (candles), stickers, Scrapbook, Film Reel, Pixel Quest, Retro Desktop |
| Krishna Bansal | — | [@Krishnabansal144](https://github.com/Krishnabansal144) | Media & DevOps: Cloudinary uploads, music library, OG images, QR/share, dashboard, insights, admin UI, brat, Coquette |

## Live links

- Frontend + API (Next.js on Vercel): _add URL_
- Demo video: _add link_
- Sample pages (after `npm run seed` / first boot): `/w/riya-birthday-demo` (Neon Night · Hinglish birthday), `/w/mom-dad-anniversary-demo` (Royal Gold · English anniversary), `/w/kabir-ishita-wedding-demo` (Film Reel · Hindi wedding), `/w/rohan-birthday-demo` (Pixel Quest), `/w/zoya-birthday-soon` (scheduled → countdown), `/w/aanya-birthday-secret` (password: `surprise`)
- Full-screen template demos with sample data: `/templates` → `/w/demo`, `/w/demo-pastel`, `/w/demo-royal`, `/w/demo-y2k-chrome`, `/w/demo-brat`, `/w/demo-scrapbook`, `/w/demo-film-reel`, `/w/demo-pixel-quest`, `/w/demo-group-chat`, `/w/demo-retro-desktop`, `/w/demo-coquette`

## Test credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | Admin@123 |
| Creator (has sample pages) | demo@demo.com | Demo@1234 |

## Tech stack

Next.js 16 (App Router, Route Handlers) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis · canvas-confetti · MongoDB + Mongoose · zod · bcryptjs · jsonwebtoken · nanoid · slugify · Cloudinary (signed direct uploads) · browser-image-compression · react-dropzone · dnd-kit · react-hook-form · qrcode / qrcode.react · next/og (OG images) · lucide-react · Web Audio API (synth music) · mongodb-memory-server (zero-config local DB)

## Features

**P0**
- [x] AUTH-1/2: signup, login, logout (bcrypt + JWT in an httpOnly cookie), protected dashboard / wizard / admin, seeded admin
- [x] FORM-1: 6-step wizard (Occasion → Recipient → Words & Language → Media → Style → Review) with a progress bar, back/next and per-step validation
- [x] LANG-1: English / Hinglish / हिंदी. All template copy switches; Devanagari font (Mukta)
- [x] MEDIA-1: up to 15 photos (jpg/png/webp/gif/heic ≤ 8 MB) + 2 videos (≤ 50 MB, ≤ 60 s), drag & drop, reorder (dnd-kit), delete, captions
- [x] TPL-1: **11 templates**, each with its own layout, palette, fonts, intro and motion
- [x] GEN-1/2: unique slug (`slugify(name-occasion)` + 4 chars, retried on collision), copy link, QR (downloadable PNG), WhatsApp, Instagram, native share
- [x] PAGE-1: cinematic intro, 3-layer parallax hero, word-by-word message reveal, animated gallery with lightbox, confetti finale
- [x] DASH-1: dashboard cards (thumbnail, recipient, occasion, status, views, date) with open / edit / duplicate / share / unpublish / delete

**P1**
- [x] FORM-2: autosave to localStorage + server · FORM-3: live phone-frame preview (desktop) / preview button (mobile)
- [x] MEDIA-2: client-side compression + per-file upload progress bars
- [x] TPL-2: occasion-aware decorations and confetti (cake/balloons, hearts/petals, rings, sparkles…)
- [x] GEN-3: dynamic OG image + meta (rich WhatsApp preview with the name)
- [x] PAGE-2: memory timeline, video section (auto-plays muted in view, tap to unmute), background music with mute toggle, Lenis smooth scroll
- [x] PAGE-3: countdown lock (server never returns content before `revealAt`) · PAGE-4: password gate with a short-lived unlock token
- [x] PAGE-5: wishes wall (name + message + emoji), owner/admin can delete, 3 per visitor per hour, profanity filter
- [x] DASH-2: insights page (views per day, unique visitors, wishes) · ADM-1: admin stats, disable pages, users, wish moderation
- [x] PERF-1: lazy-loaded media, code-split templates, CSS-only ambient animation, `prefers-reduced-motion` respected

**P2 / extras**
- [x] PAGE-6: blow out the candles (tap or microphone) / gift-box open
- [x] Music library (royalty-free + Web Audio synth tracks) or upload your own song
- [x] GIFs (search via GIPHY when a key is set, or paste any link) and meme captions on photos
- [x] Draggable emoji stickers
- [~] LANG-2: "Write it for me" uses built-in message suggestions per occasion + language (no LLM call)
- [ ] DEPLOY-1: one-click deploy to Vercel/Netlify (not implemented)

## Architecture

```
Browser ── Next.js App Router ─────────────────────────────────────────────
  /              landing          /create, /pages/:id/edit   6-step wizard ─┐ postMessage
  /templates     gallery          /dashboard, /pages/:id/insights           │
  /w/:slug       public page  ◄── server: generateMetadata + OG image       │
  /preview       iframe renderer for the live phone preview  ◄──────────────┘
        │                         (same template components as /w/:slug)
        ▼
  /api/v1/* Route Handlers ── zod validation ── central error handler ── rate limits
        │                 │
        ▼                 ▼
   MongoDB (Mongoose)   Cloudinary (signed direct uploads; fallback: files in MongoDB)
   users · pages · wishes · pageviews · templates · assets
```

One renderer, many templates: pages are stored as **data only**. `/w/[slug]` loads that data and picks a React template from `templates/registry.ts`. Every template is `templates/Shell.tsx` (shared animated sections in `sections/`) plus a style config (`sections/variants.ts`) and its own decor layer. The wizard preview renders the exact same component in an iframe.

## Local setup

```bash
git clone https://github.com/keshavmittal09/Custom-Occasion-Page-Generator
cd Custom-Occasion-Page-Generator
npm install
cp .env.example .env.local   # optional locally — fill MONGO_URI / Cloudinary for real services
npm run dev                  # http://localhost:3000
```

- With no `MONGO_URI`, the app starts a local MongoDB automatically (data in `.data/mongo`) and **seeds demo accounts and sample pages on first boot**.
- `npm run seed` re-runs the seed against `MONGO_URI` (e.g. Atlas). It's safe to run more than once.
- With no Cloudinary keys, uploads are stored in MongoDB (4 MB per file).

**Deploying to Vercel:** set `MONGO_URI`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL` and the Cloudinary keys. `.npmrc` already sets `legacy-peer-deps` for React 19.

## API

Base `/api/v1`. Success: `{ success: true, data, message? }`. Error: `{ success: false, error: { code, message, details? } }`. List endpoints accept `?page&limit&sort&search` and return `{ items, page, limit, total, totalPages }`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` (`/auth/signup`), `/auth/login`, `/auth/logout` | Public / Auth | Account management |
| GET | `/auth/me` | Auth | Current user |
| GET | `/templates` | Public | Template list (id, name, preview, occasions) |
| POST | `/pages` | Creator | Create draft |
| GET / PATCH / DELETE | `/pages/:id` | Owner (DELETE: owner or admin) | Load, autosave, delete (+ media, wishes, views) |
| GET | `/pages/mine` | Creator | Dashboard list |
| POST | `/pages/:id/publish` | Owner | Validate, slug, go live → `{ slug, url, status, qrCode, ogImage }` |
| POST | `/pages/:id/unpublish` · `/pages/:id/duplicate` | Owner | Take offline · clone as draft |
| GET | `/pages/:id/insights` | Owner, Admin | Views by day, uniques, wishes |
| DELETE | `/pages/:id/wishes/:wishId` | Owner, Admin | Remove a wish |
| GET | `/public/pages/:slug` | Public | Page data (locked → only first name + `revealAt`) |
| POST | `/public/pages/:slug/unlock` | Public | Password → short-lived view token |
| POST | `/public/pages/:slug/view` | Public | Count a view (visitor cookie, 30-minute window) |
| GET / POST | `/public/pages/:slug/wishes` | Public | List / add wish |
| POST | `/uploads/sign` | Creator | Cloudinary signed params |
| POST · GET | `/assets` · `/assets/:id` | Creator · Public | Fallback upload store (Range support) |
| GET | `/gifs?q=` | Creator | GIF search (needs `GIPHY_API_KEY`) |
| GET / PATCH | `/admin/stats`, `/admin/pages`, `/admin/pages/:id`, `/admin/users`, `/admin/users/:id`, `/admin/wishes`, `/admin/wishes/:id` | Admin | Moderation & stats |
| GET | `/api/og/:slug` | Public | 1200×630 OG image |

## Security

bcrypt password hashing · JWT in an httpOnly cookie · server-side role checks on every protected route · rate limits on auth, unlock, wishes, uploads and views · every user string sanitised on write and escaped on render (no `dangerouslySetInnerHTML`) · `passwordHash` and owner details are never returned by public APIs · security headers (nosniff, frame, referrer and permissions policy, HSTS) and API CORS in `next.config.ts` · Cloudinary secret stays on the server.

## Known limitations

- Rate limiting is in memory per server instance (use Upstash/Redis for multi-instance production).
- There is a 7-day access token only; no refresh token.
- Without Cloudinary keys, uploads are capped at 4 MB per file, so bigger videos need Cloudinary.
- GIF search needs a GIPHY key; pasting a GIF link always works.
- "Write it for me" uses curated suggestions, not an AI API. One-click Vercel/Netlify deploy (bonus) isn't built.
- Lighthouse scores haven't been measured yet.
