# PROMPTS.md — key prompts, in order

The most important prompts our team used, with a one-line note on what each produced.

| # | Area | Prompt (summarised) | What it produced |
|---|------|---------------------|------------------|
| 1 | Scaffold | "Set up a Next.js App Router project with TypeScript, Tailwind v4, Mongoose, zod, bcrypt, JWT, Cloudinary and Framer Motion; read the PS PDF and plan the data model." | Project skeleton, `lib/schema.ts` zod schemas, Mongoose models (User, Page, Wish, Template). |
| 2 | Auth | "Add signup/login/logout/me route handlers with bcrypt, JWT in an httpOnly cookie, rate limiting and a consistent `{ success, data / error }` shape." | `app/api/v1/auth/*`, `lib/auth.ts`, `lib/api.ts` (central error handler). |
| 3 | Template system | "Create a template registry: each template is a React component that receives `page` data and composes shared animated sections (Hero, Message, Gallery, Timeline, Finale) with its own theme tokens; code-split every template." | `templates/registry.ts`, `templates/Shell.tsx`, `sections/*`. |
| 4 | Hero | "Full-screen parallax hero: background at 0.2x, occasion icons at 0.5x, the name letter-by-letter at 1x, mouse/gyro tilt, transform/opacity only, respect reduced motion." | `sections/Hero.tsx`. |
| 5 | Wizard | "Build a 6-step wizard (Occasion → Recipient → Words & Language → Media → Style → Review) with per-step validation, a progress bar and autosave to localStorage + the server." | `components/wizard/*`, `useWizardDraft`. |
| 6 | Live preview | "Render the real template inside a phone frame that updates as I type, using an iframe so mobile breakpoints behave correctly." | `components/wizard/PhonePreview.tsx`, `app/preview/page.tsx`. |
| 7 | Uploads | "Signed direct uploads to Cloudinary with client-side compression, per-file progress bars, drag-to-reorder (dnd-kit), captions, max 15 photos + 2 videos ≤ 60 s." | `lib/upload.ts`, `components/wizard/StepMedia.tsx`, `/api/v1/uploads/sign`. |
| 8 | Publish | "Publish endpoint: validate the full payload with zod, slugify(name-occasion)+4 random chars with retry on collision, status PUBLISHED/SCHEDULED, return url + QR data URL + OG image URL." | `/api/v1/pages/:id/publish`, `lib/pages.ts`. |
| 9 | Public page | "Public page API must never leak content before revealAt; password pages return content only after an unlock token; count views once per visitor per 30 min, never the owner." | `/api/v1/public/pages/:slug`, `/unlock`, `/view`, `PageView` model. |
| 10 | Lock screens | "Countdown lock with flip digits, elegant password gate, friendly disabled screen and a beautiful 404 with a CTA." | `components/viewer/Viewer.tsx`. |
| 11 | i18n | "All template copy (headings, buttons, captions) must switch between English, Hinglish and Hindi; load a Devanagari font." | `locales/*.json`, `t()` + Mukta fallback in every font stack. |
| 12 | Finale | "Interactive finale: tap the candle flames or blow into the mic to put them out, then fire occasion-shaped confetti and fireworks; gift-box open for other occasions." | `sections/Finale.tsx`. |
| 13 | Gen Z templates | "Research Gen Z / aesthetic web trends and design 8 more templates (Y2K Chrome, brat, Scrapbook, Film Reel, Pixel Quest, Group Chat, Retro Desktop, Coquette), each with its own intro, cards, frames and decor." | `sections/variants.ts`, `templates/*`, `sections/Intro.tsx` intro variants. |
| 14 | Music | "Music library: royalty-free tracks plus synthesised birthday tunes (Web Audio), preview in the wizard, or upload your own song." | `lib/music.ts`, `lib/synth.ts`, `lib/player.ts`, `MusicPicker`. |
| 15 | GIFs & memes | "Let creators add GIFs (search or paste a link) and turn any photo into a meme with top/bottom captions." | `GifPicker`, meme overlay in `Gallery`, `/api/v1/gifs`. |
| 16 | Dashboard & insights | "Creator dashboard with thumbnails, status chips, views, open/edit/duplicate/share/unpublish/delete; insights page with views-per-day chart and wish moderation." | `components/dashboard/*`, `/pages/mine`, `/insights`, `/duplicate`, `/unpublish`. |
| 17 | Admin | "Admin area: platform stats, disable/enable pages, activate/deactivate users, hide/delete abusive wishes — enforced server-side." | `components/admin/Admin.tsx`, `/api/v1/admin/*`. |
| 18 | OG preview | "Dynamic 1200×630 OG image with the recipient's name and first photo so WhatsApp shows a rich card; hide the photo for locked pages." | `app/api/og/[slug]/route.tsx`, `generateMetadata` on `/w/[slug]`. |
| 19 | Seed & setup | "Seed script with an admin and a creator account plus sample pages (birthday + anniversary, 3 languages, one scheduled, one password-protected); local MongoDB fallback so it runs on a fresh machine." | `lib/seed.ts`, `scripts/seed.ts`, `lib/db.ts`. |
| 20 | UI/UX | "Restyle the app in the Wishly design (cream canvas, Fraunces serif, glass cards, lilac/blush/peach) — make it feel hand-made, not AI-generic." | Landing, templates gallery, wizard, dashboard and auth pages. |
