# Tribal Arts

A full-stack e-commerce platform for discovering and purchasing authentic tribal products and indigenous crafts. Built with Next.js (App Router), it pairs a customer-facing storefront with a complete admin back office, MongoDB persistence, JWT-based authentication, and Razorpay payments.

## Overview

Tribal Arts is a production-style online store for handmade tribal artwork — jewelry, pottery, textiles, masks, home decor, and accessories. Shoppers can browse a catalog, manage a cart and wishlist, check out through Razorpay, and track their orders. Administrators get a separate dashboard to manage products, orders, customers, and contact messages.

The application is a single Next.js codebase: pages, server-side API routes, authentication middleware, and database access all live together. The UI is built on React 19 with Tailwind CSS and an extensive set of accessible shadcn/ui (Radix UI) components.

## Features

### Storefront
- Product catalog with category browsing and individual product detail pages
- Shopping cart with persistence per user
- Wishlist management
- Checkout flow with shipping details and Razorpay payment integration
- Order history and account management
- Contact form and informational pages (About, FAQ, Shipping, Returns, Privacy)
- User sign-up / sign-in with hashed passwords

### Admin
- Separate admin dashboard with sales/overview data
- Product management (create, update, delete)
- Order management with per-order detail views
- Customer management
- Contact message inbox

### Platform
- JWT-based authentication with route protection via Next.js middleware
- Role separation between regular users and admins (cookie-gated `/admin` routes)
- React Context for global auth, cart, and wishlist state
- Accessible, responsive UI with light/dark theme support
- Toast notifications and form validation

## Tech Stack

| Layer            | Technology                                          |
| ---------------- | --------------------------------------------------- |
| Framework        | Next.js 16 (App Router)                             |
| UI Library       | React 19                                            |
| Language         | TypeScript 5                                        |
| Styling          | Tailwind CSS 4, `tailwindcss-animate`               |
| Components       | shadcn/ui built on Radix UI primitives, Lucide icons |
| Database         | MongoDB (official `mongodb` driver)                 |
| Authentication   | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`        |
| Payments         | Razorpay                                            |
| Forms/Validation | React Hook Form, Zod                                |
| Notifications    | Sonner                                              |
| Charts           | Recharts                                            |
| Analytics        | Vercel Analytics                                    |

## Architecture / How It Works

- **App Router (`app/`)** — Each route is a folder with a `page.tsx`. Server-side API endpoints live under `app/api/` as `route.ts` handlers.
- **Middleware (`middleware.ts`)** — Runs on every non-API, non-static request. It reads `admin_token` and `user` cookies, allows public routes (`/signin`, `/signup`), gates `/admin/*` behind an admin token, and redirects unauthenticated users to sign-in.
- **Database (`lib/mongodb.ts`)** — A cached `MongoClient` connects to the `tribal-arts` database. Typed collection getters expose `products`, `orders`, `users`, `carts`, `wishlists`, and `contacts`.
- **Data access (`lib/db-utils.ts`)** — Centralizes all CRUD logic. Notably, `getUserByEmail` strips the password field for client-facing reads, while `getUserForLogin` includes it for server-side credential comparison only.
- **Authentication** — Sign-in (`app/api/auth/signin/route.ts`) compares `bcrypt`-hashed passwords for regular users and issues a JWT for admins. JWTs are signed with `JWT_SECRET`.
- **Payments** — Checkout calls `POST /api/payment/create-order` to create a Razorpay order (server-side, using the secret key), opens the Razorpay checkout widget, then calls `POST /api/payment/verify` which validates the `HMAC SHA256` signature before the order is persisted. See [`PAYMENT_FLOW.md`](./PAYMENT_FLOW.md) for the full sequence.
- **State** — `components/providers.tsx` wraps the app in `AuthProvider`, `CartProvider`, and `WishlistProvider`, scoping the cart and wishlist to the signed-in user.

### Key API Routes

| Route                                | Purpose                                        |
| ------------------------------------ | ---------------------------------------------- |
| `POST /api/auth/signin`              | Authenticate user or admin                     |
| `GET/POST /api/products`             | List / create products                         |
| `GET/PUT/DELETE /api/products/[id]`  | Single product operations                      |
| `GET/POST /api/cart`                 | Read / update user cart                        |
| `GET/POST /api/wishlist`             | Read / update wishlist                         |
| `GET/POST /api/orders`               | Read / create orders                           |
| `POST /api/payment/create-order`     | Create a Razorpay order                        |
| `POST /api/payment/verify`           | Verify Razorpay payment signature              |
| `POST /api/contact`                  | Submit a contact message                       |
| `GET/POST/PUT/DELETE /api/admin/*`   | Admin product/order/customer/message endpoints |
| `POST /api/seed`                     | Seed the database with sample products         |

## Project Structure

```text
Tribal-Arts/
├── app/                      # Next.js App Router
│   ├── api/                  # Server-side API route handlers
│   │   ├── admin/            # Admin: customers, dashboard, messages, orders, products
│   │   ├── auth/signin/      # Authentication
│   │   ├── cart/             # Cart persistence
│   │   ├── contact/          # Contact form
│   │   ├── orders/           # Orders
│   │   ├── payment/          # Razorpay create-order & verify
│   │   ├── products/         # Product CRUD
│   │   ├── seed/             # Sample product seeding
│   │   ├── users/            # User records
│   │   └── wishlist/         # Wishlist persistence
│   ├── admin/                # Admin dashboard pages
│   ├── products/             # Catalog + product detail pages
│   ├── cart, checkout, ...   # Storefront & account pages
│   ├── layout.tsx            # Root layout + providers
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn/ui component library
│   ├── header.tsx, footer.tsx, hero.tsx, featured-products.tsx
│   ├── admin-layout.tsx
│   ├── providers.tsx         # Auth/Cart/Wishlist context providers
│   └── route-protection.tsx
├── lib/
│   ├── mongodb.ts            # DB connection + collection getters
│   ├── db-utils.ts           # CRUD helpers
│   ├── razorpay-utils.ts     # Razorpay client helpers
│   ├── auth-context.tsx, cart-context.tsx, wishlist-context.tsx
│   └── utils.ts
├── hooks/                    # use-mobile, use-toast
├── types/                    # bcryptjs & razorpay type declarations
├── public/                   # Product images and logos
├── middleware.ts             # Auth / route protection
├── next.config.mjs
├── tsconfig.json
├── PAYMENT_FLOW.md           # Razorpay payment flow diagram
└── TECH_STACK.md             # Plain-language tech overview
```

## Prerequisites

- Node.js 18 or later
- A package manager (the repo includes a `pnpm-lock.yaml`; npm or yarn also work)
- A MongoDB instance (local or MongoDB Atlas)
- A Razorpay account with API keys (for payments)

## Installation

```bash
git clone https://github.com/KarthikRommula/Tribal-Arts.git
cd Tribal-Arts
pnpm install   # or: npm install
```

## Configuration

Create a `.env.local` file in the project root with the following variables (all referenced in the source):

```bash
# MongoDB connection string (database name "tribal-arts" is used automatically)
MONGODB_URI=mongodb://localhost:27017

# Secret used to sign admin JWTs
JWT_SECRET=your-secret-key

# Razorpay credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx   # public key, sent to the browser
RAZORPAY_KEY_SECRET=your-razorpay-secret         # server-side only

# Admin login credentials (required — sign-in fails closed if these are not set)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
```

> Note: Admin credentials are read from the `ADMIN_EMAIL` and `ADMIN_PASSWORD`
> environment variables. If either is missing, admin sign-in is rejected with a
> server configuration error. Set your own values in `.env.local` (see
> `.env.example` for the full list of required variables).

## Usage

Start the development server:

```bash
pnpm dev   # or: npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

To populate the catalog with sample products, send a POST request to the seed endpoint once the server is running and `MONGODB_URI` is configured:

```bash
curl -X POST http://localhost:3000/api/seed
```

## Available Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `pnpm dev`      | Start the development server         |
| `pnpm build`    | Create a production build            |
| `pnpm start`    | Run the production server            |
| `pnpm lint`     | Run ESLint                           |

## Build & Deployment

```bash
pnpm build
pnpm start
```

The project is configured for deployment on Vercel. Note that `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and uses unoptimized images — adjust these for stricter production builds.

## Author

**Karthik Rommula** — [github.com/KarthikRommula](https://github.com/KarthikRommula)
