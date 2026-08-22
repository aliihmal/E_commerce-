# Kurotsuki — Pure Front End (No Backend)

This is a fully standalone front end. There is no API, no server, no authentication, and no database —
everything runs in the browser using static dummy data.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

`npm run build` produces static files in `dist/` you can host anywhere (Netlify, Vercel, S3, GitHub
Pages, a plain nginx box, etc.) — there's nothing to deploy on the server side.

## What's in it

- **Home** — hero with animated moon climber, marquee, featured drops, lore section
- **Products** (`/products`) — full catalog with client-side collection filtering
- **Product detail** (`/products/:id`) — size picker, add to cart
- **Collections** (`/collections`, `/collections/:slug`)
- **Sales** (`/sales`) — discounted items with quick add-to-cart
- **About** (`/about`)
- **Cart** — a slide-in drawer, backed by React state and persisted to `localStorage` so it survives a
  page refresh
- **Checkout** (`/checkout`) — collects name/email/phone/location and shows an order confirmation with a
  random order number. Nothing is actually sent anywhere; it's a UI simulation only.

## Data

All products, collections, and sale prices live in `src/data/dummyData.ts`. Edit that file to change
what's on the site — there's no database to seed or migrate.

## What's intentionally NOT here

- No login/register, no user accounts, no roles
- No API calls of any kind (no axios, no fetch to any server)
- No owner dashboard (that requires real auth + a backend to be meaningful)
- No real order storage — checkout is a front-end-only simulation

If you want the full system back (Node/Express/TypeScript/SQLite backend with JWT auth, RBAC, real cart
and order persistence, and an owner dashboard), that's the other project we built — just ask and I can
give you that version again.
