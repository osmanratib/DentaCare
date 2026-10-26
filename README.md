# DentaCare — Luxury Dental Clinic Web Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_RLS-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?style=flat-square&logo=framer)](https://www.framer.com/motion/)

> **"Quiet Luxury Meets Clinical Calm"** — An award-winning dental clinic web platform crafted with architectural precision, fluid physics-based animations, and an enterprise-grade admin management suite.

---

## 💎 Design Philosophy & Color Palette

Designed around modern quiet luxury, editorial typography, tactile grain, and serene medical confidence.

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Ivory** | `#F7F5F0` | Warm primary background, clinical calm |
| **Deep Ink** | `#0E1A24` | Primary high-contrast editorial typography & dark sections |
| **Aqua Mist** | `#CFE8E4` | Soft accents, subtle badge backgrounds, and glow effects |
| **Electric Teal** | `#12B5A6` | Magnetic call-to-actions and interactive highlights |
| **Warm Sand** | `#E8DCC8` | Secondary surfaces, elevated card backgrounds |

---

## 🏛️ System Architecture

- **Public Marketing Zone (`/`, `/services`, `/smile-gallery`, `/team`, `/pricing`, `/blog`, `/contact`, `/book`)**:
  - Blazing-fast Next.js 15 App Router with Server Components (RSC) and ISR.
  - Smooth inertia scrolling via **Lenis**.
  - Interactive **Before / After smile transformation drag slider** with physical resistance.
  - SVG tooth path drawing preloader.
  - Multi-step appointment booking wizard with **Zod** schema validation.
  - LocalBusiness & Dentist JSON-LD structured data for local SEO dominance.

- **Admin Management Zone (`/admin/*`)**:
  - Restricted to clinic staff and owner (`osmanratib14@gmail.com`).
  - Protected by Next.js middleware with session verification and TOTP MFA (AAL2 enforcement).
  - Returns clean 404 rewrite for unauthenticated requests to prevent route probing.
  - Real-time appointment management, calendar views, patient directory, schedule availability rules, and immutable audit logs.
  - CSV export capability and instant status workflows (`pending`, `confirmed`, `completed`, `cancelled`, `no_show`).

- **Database & Security Layer (Supabase / PostgreSQL)**:
  - Strict Row Level Security (RLS) on all tables.
  - Public can only select published marketing content via anon key.
  - Patients and appointments have **no public read access**; mutations only execute through server actions.
  - `is_admin()` security-definer function validates authenticated staff.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (site)/                    # Public marketing site
│   │   ├── layout.tsx             # Lenis smooth scroll, header, footer
│   │   ├── page.tsx               # Cinematic homepage showpiece
│   │   ├── services/              # Services catalog & dynamic [slug]
│   │   ├── smile-gallery/         # Interactive before/after cases
│   │   ├── team/                  # Specialist directory & credentials
│   │   ├── pricing/               # Transparent treatment pricing
│   │   ├── blog/                  # Oral health editorial & dynamic [slug]
│   │   ├── contact/               # Location, hours, emergency contact
│   │   └── book/                  # Multi-step booking engine
│   ├── (admin)/admin/             # Locked-down clinic backoffice
│   │   ├── login/                 # Staff auth & TOTP MFA step
│   │   ├── layout.tsx             # Admin sidebar & header shell
│   │   ├── page.tsx               # KPI dashboard & booking charts
│   │   ├── appointments/          # Appointment status pipeline & CSV export
│   │   ├── patients/              # Searchable patient directory & notes
│   │   ├── availability/          # Clinic operating hours & blocked dates
│   │   ├── gallery/               # Transformation case manager
│   │   ├── reviews/               # Patient review moderation
│   │   └── settings/              # Staff management & audit trail
│   ├── robots.ts                  # SEO crawler rules (disallowing /admin)
│   └── sitemap.ts                 # Dynamic XML sitemap generator
├── components/
│   ├── motion/                    # Lenis provider, Reveal, Glow, Preloader
│   ├── site/                      # Header, Footer, Slider, Marquee, Cards
│   └── admin/                     # Metric cards, tables, modal editors
├── lib/
│   ├── supabase/                  # Server, client, and admin instances
│   ├── validators/                # Zod schemas for booking & admin
│   └── data/                      # Initial seed fixtures and defaults
├── actions/                       # Server actions (booking, status update)
└── middleware.ts                  # Route gatekeeper & MFA validation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 & 24)
- npm or pnpm

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_NOTIFY_EMAIL=osmanratib14@gmail.com
```

### 3. Installation & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the public showcase, or navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to explore the clinic backoffice.

---

## 🔒 Security Hardening

- **AAL2 MFA**: Supabase Authenticator assurance level 2 required for dashboard access.
- **Strict Headers**: Content Security Policy, HSTS (`max-age=63072000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
- **Honeypot & Rate-limiting ready**: Server action gates against automated bot form submission.
- **Service-role Isolation**: Sensitive database operations run server-side only.

---

© 2026 DentaCare Clinic. Architected by Osman Ratib. All rights reserved.
