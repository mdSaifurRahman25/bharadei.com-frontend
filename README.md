# BharaDei.com — Equipment Rental Platform (Frontend)

**BharaDei.com** (*Everything You Need, Ready to Rent.*) is Bangladesh's smart equipment rental marketplace connecting verified equipment owners with customers across cameras, power tools, construction machinery, vehicles, agriculture equipment, electronics, and event gear.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **BetterAuth**, **Framer Motion**, and **Recharts**.

---

## Live URLs

- **Live Website (Frontend):** [https://bharadei-com-frontend.vercel.app](https://bharadei-com-frontend.vercel.app)
- **Live API Server (Backend):** [https://bhara-dei-com-backend.vercel.app](https://bhara-dei-com-backend.vercel.app)

---

## Purpose

BharaDei.com eliminates the heavy upfront cost of buying expensive specialized tools and machinery by providing a transparent, role-governed marketplace where:
- **Customers (Renters)** can search, filter, favorite, book, and pay securely via **Stripe Checkout**.
- **Equipment Owners** can list equipment with **imgbb** image uploads, manage stock & incoming bookings, and track monthly earnings through interactive **Recharts** analytics.
- **Admins** can moderate listings (`Approve` / `Reject` / `Update` / `Delete`), manage user roles (`Customer` / `Owner` / `Admin`), monitor all platform rentals, and review platform-wide analytics.

---

## Key Features

- **Authentication & Role-Based Access Control (RBAC):**
  - Email/password registration & login with validation (6+ chars, uppercase & lowercase), **BetterAuth + MongoDB Adapter**, **Google Social Login** (`Customer` default role), and reload-safe private route guards (`ProtectedRoute`).
  - Quick Demo Admin access panel on `/login`.
- **Dynamic Home Page with Framer Motion:**
  - Hero Banner with inline search, Featured Equipment (6 approved listings via MongoDB `.limit(6)`), 6 Popular Categories, Why Choose Us, Customer Reviews, How It Works, Popular/Recently Added Spotlight, and Closing CTA.
- **All Equipment Catalog (`/equipment`):**
  - 3-column uniform card grid powered by server-side search, Category/Rental Type/Price Range/Availability filters, sorting (`Recent`, `Price Low–High`, `Price High–Low`), and pagination.
- **Equipment Details, Favorites & Booking Modal (`/equipment/[id]`):**
  - Protected detail view with owner details, rental terms, Favorites toggle, and interactive Booking Modal with live duration/quantity pricing calculation.
- **Stripe Checkout & Confirmation Flow:**
  - Seamless Stripe Checkout redirect with verified `/payment/success` receipt and `/payment/cancel` handling.
- **Role Dashboards (`/dashboard/customer`, `/dashboard/owner`, `/dashboard/admin`):**
  - Responsive full-width dashboard shell, Recharts analytics charts, tables with pagination, imgbb image upload, and shared Profile management.
- **UX, Theme & Resilience:**
  - Light/Dark mode toggle persisted in `localStorage`, Sonner toast & SweetAlert2 alerts, plus App Router `loading.tsx`, `error.tsx`, and `not-found.tsx` boundaries.

---

## NPM Packages Used

### Dependencies
| Package | Version | Purpose |
| --- | --- | --- |
| `next` | `16.4.6` | Next.js App Router framework |
| `react` / `react-dom` | `19.3.0` | UI library |
| `better-auth` | `^1.7.26` | Authentication & Google OAuth integration |
| `mongodb` | `^7.9.0` | MongoDB adapter connection for BetterAuth |
| `framer-motion` | `^14.14.0` | Smooth UI & section animations |
| `recharts` | `^3.11.0` | Owner & Admin dashboard analytics charts |
| `lucide-react` | `^1.75.0` | Modern icon library (including X brand icon) |
| `sonner` | `^2.0.8` | Toast notifications |
| `sweetalert2` | `^11.26.25` | Confirmation & success alert modals |
| `date-fns` | `^4.4.0` | Date utilities |
| `clsx` | `^2.1.1` | Conditional className helper |
| `tailwind-merge` | `^3.7.0` | Tailwind CSS class merging |
| `class-variance-authority` | `^0.7.1` | Component variant styling utilities |

### Dev Dependencies
- `tailwindcss` (`4.3.3`), `@tailwindcss/turbopack` (`4.3.3`), `typescript` (`^5`), `eslint` (`^9`), `eslint-config-next` (`16.4.6`), `@types/node`, `@types/react`, `@types/react-dom`.

---

## Environment Variables

Create a `frontend/.env.local` file based on `.env.example` (never commit secrets):

```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=bharadei
BETTER_AUTH_SECRET=your_random_32_plus_char_secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## Getting Started Locally

```bash
npm install
npm run dev
```

Build & lint verification:

```bash
npm run lint
npm run build
```
