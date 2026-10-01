# Wishly · Custom Occasion Page Generator

Turn photos, messages and memories into an animated page for a birthday, anniversary, farewell or any moment, and share it with a single link.

## Live

- **App:** _add Vercel URL_
- **Demos:** `/w/demo` (Neon Night) · `/w/demo-pastel` (Pastel Dream) · `/w/demo-royal` (Royal Gold)

## Team

| Name | GitHub | Area |
|---|---|---|
| Keshav Mittal | @keshavmittal09 | Lead, backend, page store, API |
| Kratika Rathi | @kratikarathi123 | Creation wizard |
| Khushi Saraswat | @Khushi-saraswat-007 | Wishly design, intro/hero/message sections, Neon Night, viewer |
| Khush Agnihotri | @Khushagnihotri | Gallery, timeline, finale, Pastel Dream, Royal Gold, templates gallery |
| Krishna Bansal | @Krishnabansal144 | Wishes wall, share kit, dashboard, landing |

## Features

- **5-step wizard:** occasion → recipient → messages and memories → photos → style, with autosave, live preview and a publish checklist
- **3 animated templates:** Neon Night, Pastel Dream, Royal Gold
- **Tap-to-open intro** with confetti and optional background music
- **Photo gallery** with lightbox (keyboard controls) and a memory-lane timeline
- **Surprise locks:** timed reveal with a live countdown, or password protection
- **Wishes wall:** visitors leave their own notes
- **Sharing:** copy link, WhatsApp, native share and a downloadable QR code
- **Dashboard:** pages published from this device, with live view and wish counts
- **Languages:** English, Hinglish and हिंदी
- **No sign-up:** publishing is anonymous

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4, Framer Motion, lucide-react
- MongoDB via Mongoose, with a local JSON-file fallback when `MONGO_URI` is not set
- Zod validation, bcrypt for page passwords, in-memory rate limiting
- Browser-side image compression (no upload service needed)

## Run locally

```bash
git clone https://github.com/keshavmittal09/Custom-Occasion-Page-Generator
cd Custom-Occasion-Page-Generator
npm install
npm run dev
```

Open http://localhost:3000. Pages are saved to a local file, so no database is needed for local runs.

## Deploy (Vercel)

1. Import the repo in Vercel. `.npmrc` already sets `legacy-peer-deps` for React 19.
2. Add the environment variable `MONGO_URI` (a free MongoDB Atlas cluster works). Without it, published pages don't survive between serverless instances. The demo pages still work.
3. Deploy.

## API

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/v1/publish` | Publish a page from the wizard, returns `{ slug, url }` |
| GET | `/api/v1/public/pages/:slug` | Fetch a page (handles reveal lock and `x-page-password`) |
| GET/POST | `/api/v1/public/pages/:slug/wishes` | List or add wishes (rate limited) |

## Project structure

```
app/            routes: landing, /create, /templates, /dashboard, /w/[slug], API
components/     wizard steps, navbar, share kit, toasts
sections/       page sections shared by all templates (intro, hero, gallery…)
templates/      neon-night, pastel-dream, royal-gold + registry
lib/            schema, page store, fixtures, helpers
```
