# ✦ MailMind v3 — AI Email Assistant (Vercel + Google OAuth)

Full-stack SaaS email assistant deployed entirely on **Vercel** (frontend + serverless API functions). Supports **Google OAuth** and **email/password** auth, **free tier (Gemini AI)** and **premium tier (Claude AI)**, with **Stripe** for subscriptions.

---

## How You Get Paid

| Tier | AI | Requests | Price |
|---|---|---|---|
| **Free** | Gemini 1.5 Flash | 20 / day | $0 |
| **Premium** | Claude Sonnet | Unlimited | $7 / month |

Users sign up free via Google or email → get 20 AI requests/day → hit limit → see upgrade modal → pay $7/month via Stripe → switch to Claude. You collect the subscription revenue.

---

## Project Structure

```
mailmind-v4/
└── frontend/                        ← Single Vercel deployment
    ├── api/                         ← Vercel serverless functions
    │   ├── _lib/
    │   │   ├── aiService.ts         ← Gemini (free) + Claude (premium) router
    │   │   ├── cors.ts              ← CORS helper for all functions
    │   │   ├── jwt.ts               ← Sign / verify JWT tokens
    │   │   └── userStore.ts         ← In-memory store (swap for DB in prod)
    │   ├── auth/
    │   │   ├── register.ts          ← POST /api/auth/register
    │   │   ├── login.ts             ← POST /api/auth/login
    │   │   └── google.ts            ← GET/POST /api/auth/google (OAuth)
    │   ├── ai/
    │   │   ├── summarise.ts         ← POST /api/ai/summarise
    │   │   ├── score.ts             ← POST /api/ai/score
    │   │   ├── reply.ts             ← POST /api/ai/reply
    │   │   └── usage.ts             ← GET  /api/ai/usage
    │   └── stripe/
    │       ├── checkout.ts          ← POST /api/stripe/checkout
    │       ├── portal.ts            ← POST /api/stripe/portal
    │       └── webhook.ts           ← POST /api/stripe/webhook
    │
    └── src/                         ← Vite + React + TypeScript + Chakra UI
        ├── api/
        │   ├── client.ts            ← Typed HTTP client for all /api routes
        │   └── gmail.ts             ← Gmail inbox loader
        ├── components/
        │   ├── email/               ← EmailDetail · Header · Body · Summary · ListItem
        │   ├── layout/              ← Sidebar (with user menu) · StatsBar
        │   ├── reply/               ← ReplyComposer · ToneSelector
        │   └── shared/              ← Avatar · PriorityBar · UsageBanner · UpgradeModal · Toast
        ├── hooks/
        │   ├── useAuth.ts           ← JWT + Google OAuth state
        │   ├── useEmails.ts         ← Email list state, filtering, sorting
        │   ├── useReply.ts          ← Reply lifecycle (idle → loading → reviewing → sent)
        │   └── useUsage.ts          ← Daily usage tracking + limit detection
        ├── pages/
        │   └── AuthPage.tsx         ← Google button + email/password tabs
        ├── theme/index.ts
        ├── types/index.ts
        └── App.tsx                  ← Handles Google OAuth redirect callback
```

---

## Quick Start (Local)

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/mailmind.git
cd mailmind-v4/frontend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Fill in `.env` — see the **API Keys** section below.

### 3. Run locally with Vercel Dev (recommended)
```bash
npm install -g vercel
vercel dev
# → http://localhost:3000
# Both the React app AND the /api functions run together
```

Or Vite only (no API functions):
```bash
npm run dev   # → http://localhost:5173
```

---

## Deploy to Vercel

```bash
# One command from the frontend/ directory
vercel --prod
```

Then add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## API Keys You Need

| Key | Where | Cost |
|---|---|---|
| `GEMINI_API_KEY` | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | **Free** |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | Pay-per-use |
| `JWT_SECRET` | Generate: `openssl rand -base64 32` | Free |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com) | Free |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com) | Free to set up |

---

## Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → **APIs & Services → Credentials**
3. Create **OAuth 2.0 Client ID** (Web application)
4. Add Authorised redirect URI:
   - Local: `http://localhost:3000/api/auth/google`
   - Production: `https://your-app.vercel.app/api/auth/google`
5. Copy **Client ID** → `GOOGLE_CLIENT_ID` + `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
6. Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

---

## Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Create a **Product** → "MailMind Premium" → **$7/month recurring**
3. Copy **Price ID** → `STRIPE_PREMIUM_PRICE_ID`
4. Copy **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`
5. Copy **Secret key** → `STRIPE_SECRET_KEY`
6. **Webhook** (for subscription cancellation):
   - Local: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Production: Add webhook in Stripe dashboard pointing to `https://your-app.vercel.app/api/stripe/webhook`
   - Copy webhook secret → `STRIPE_WEBHOOK_SECRET`

---

## Production Database

The current `userStore.ts` is **in-memory** — data resets on cold starts. For production, replace it with one of:

| Option | Setup |
|---|---|
| **Vercel Postgres** | `npm i @vercel/postgres` — 1-click in Vercel dashboard |
| **PlanetScale** (MySQL) | Free tier, Prisma ORM |
| **Supabase** (Postgres) | Free tier, built-in auth |
| **MongoDB Atlas** | Free tier, Mongoose |

All require changing only `userStore.ts` — the rest of the codebase stays the same.

---

## Environment Variables Reference

```env
# AI (server-side — never exposed to browser)
GEMINI_API_KEY=
ANTHROPIC_API_KEY=

# Auth
JWT_SECRET=                         # openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=                   # xxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=       # same as GOOGLE_CLIENT_ID

# Stripe
STRIPE_SECRET_KEY=                  # sk_test_...
STRIPE_WEBHOOK_SECRET=              # whsec_...
STRIPE_PREMIUM_PRICE_ID=            # price_...
VITE_STRIPE_PUBLISHABLE_KEY=        # pk_test_...

# App
VITE_APP_URL=                       # http://localhost:3000 or https://your-app.vercel.app
```

---

## Roadmap

- [ ] Production database (Vercel Postgres)
- [ ] Send replies via Gmail API
- [ ] Annual pricing ($70/yr = 2 months free)
- [ ] Mobile responsive layout
- [ ] Keyboard shortcuts (j/k, r, e)

---

## License
MIT
