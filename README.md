# Custom Occasion Page Generator

A Next.js application where creators fill a 6-step wizard to generate beautiful, animated occasion pages (Birthday, Anniversary, etc.) that recipients open on mobile.

## 🚀 Live Demo
- **App**: _[add Vercel URL]_
- **Demo page**: _[add Vercel URL]_/w/demo

## 👥 Team
| Name | GitHub | Role |
|---|---|---|
| Keshav Mittal | @keshavmittal09 | Lead + Backend |
| _Teammate B_ | @_handle_ | Wizard |
| _Teammate C_ | @_handle_ | Motion 1 (Neon Night) |
| _Teammate D_ | @_handle_ | Motion 2 (Templates) |
| _Teammate E_ | @_handle_ | Media + Dashboard |

## 🧰 Tech Stack
- **Framework**: Next.js 16 App Router + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion + Lenis smooth scroll
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: bcryptjs + JWT (httpOnly cookie)
- **Storage**: Cloudinary (direct upload, signed)
- **Forms**: React Hook Form + Zod
- **Deploy**: Vercel

## ✨ Features
- 6-step wizard to create occasion pages
- 3 animated templates: Neon Night, Pastel Dream, Royal Gold
- RevealAt countdown lock + password protection
- Live phone-frame preview in wizard
- Cloudinary media upload (15 images, 2 videos)
- Wishes wall with rate limiting
- Creator dashboard + page insights
- Admin panel
- QR code + WhatsApp share
- OG image generation
- Multilingual: English, Hinglish, Hindi

## 🏃 Local Setup
\`\`\`bash
git clone https://github.com/keshavmittal09/Custom-Occasion-Page-Generator
cd Custom-Occasion-Page-Generator
npm install
cp .env.example .env.local
# fill in .env.local with your values
npm run dev
\`\`\`

## 🔑 Test Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | Admin@123 |
| User | user@demo.com | User@1234 |

(Run `npm run seed` to create these)

## 📋 Known Limitations
- Rate limiter is in-memory (resets on cold start)
- OG image generation requires Vercel deployment

## 📁 Folder Ownership
| Folder | Owner |
|---|---|
| `lib/`, `models/`, `app/api/v1/` | Lead (Keshav) |
| `components/wizard/`, `app/create/`, `app/(auth)/` | Teammate B |
| `templates/neon-night/`, `sections/Intro,Hero,Message,LockScreen` | Teammate C |
| `templates/pastel-dream/`, `templates/royal-gold/`, `sections/Gallery,Timeline,Finale` | Teammate D |
| `components/ui/`, `app/dashboard/`, `app/admin/`, `app/(marketing)/` | Teammate E |
