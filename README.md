# GolfElite

GolfElite is a premium, subscription-based golf performance and charity fundraising platform. The platform allows users to track their golf scores, participate in monthly prize draws, manage charity donations, and offers an administrative dashboard for user and platform management.

## 🚀 Features

- **Authentication:** Secure user login and registration powered by Clerk.
- **Performance Tracking:** Comprehensive dashboard for tracking golf scores and performance metrics.
- **Charity Fundraising:** Integrated system for managing charity campaigns and donations.
- **Subscriptions:** Stripe-powered billing for monthly subscription plans and payment processing.
- **Admin Dashboard:** Powerful tools for user management (ban/unban/delete) and platform configurations.
- **Modern UI:** Emotion-driven design powered by Shadcn, Base UI, Radix UI, Framer Motion, and Tailwind CSS v4.
- **Theming:** Full support for seamless Dark/Light mode transitions.

## 👥 User Roles & Permissions

### ⛳ Users
- Subscribe to the platform (monthly or yearly)
- Enter their latest golf scores in Stableford format
- Participate in monthly draw-based prize pools
- Support a charity of their choice with a portion of their subscription

### 🛡️ Administrators

**Access & Security**
- Secure access to the dashboard is protected by an **Admin Token** (`JWT_TOKEN` environment variable).

**JWT_TOKEN=12345**

**User Management**
- View and edit user profiles
- Edit golf scores
- Manage subscriptions

**Draw Management**
- Configure draw logic (random vs. algorithm)
- Run simulations
- Publish results

**Charity Management**
- Add, edit, delete charities
- Manage content and media

**Winners Management**
- View full winners list
- Verify submissions
- Mark payouts as completed

**Reports & Analytics**
- Total users
- Total prize pool
- Charity contribution totals
- Draw statistics

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, v16.2.1)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React](https://react.dev/) (v19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Components:** [Shadcn UI](https://ui.shadcn.com/) / Base UI / Radix UI
- **Database:** [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Authentication:** [Clerk](https://clerk.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Animations:** Framer Motion

## 📂 Project Structure

```
golfelite/
├── .env                 # Environment variables configuration
├── .gitignore           # Git ignore file
├── app/                 # Next.js App Router (Pages & Routing)
│   ├── (auth)/          # Clerk authentication routes (login, sign-up)
│   ├── admin/           # Admin Dashboard for managing platform & users
│   ├── api/             # API routes (webhooks, database syncing, Stripe checkout)
│   ├── charities/       # Charity management and browsing pages
│   ├── dashboard/       # Main user dashboard (score tracking, monthly draws)
│   ├── onboarding/      # Initial user setup and configuration flow
│   ├── pricing/         # Stripe subscription plans and checkout components
│   ├── globals.css      # Global Styles encompassing Tailwind CSS tokens
│   ├── layout.tsx       # Root application layout
│   └── page.tsx         # Main Landing Page
├── components/          # Reusable React components and UI elements
│   ├── layout/          # Structural components (Navbars, Sidebars, Footers)
│   ├── providers/       # Context & State Providers (Theme, Clerk, etc.)
│   ├── ui/              # Shadcn UI primitive components (Buttons, Inputs, Cards)
│   └── theme-toggle.tsx # Dark/Light mode toggle component
├── hooks/               # Custom React logic hooks
├── lib/                 # Shared utilities and Database configuration
│   ├── models/          # Mongoose database schemas (e.g., User, Charity)
│   ├── db.ts            # MongoDB connection utility
│   └── utils.ts         # Formatting and utility functions (e.g., simple tailwind class merge)
├── public/              # Static assets (images, icons, fonts)
├── eslint.config.mjs    # ESLint configuration
├── middleware.ts        # Next.js middleware (primarily Clerk route protection)
├── next.config.ts       # Next.js build and runtime configuration
├── package.json         # Project dependencies, metadata, and scripts
├── postcss.config.mjs   # PostCSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 💻 Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB connection URI
- Clerk API Keys
- Stripe API Keys

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd golfelite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Ensure your `.env` file at the root correctly configures parameters for Clerk, Stripe, and your MongoDB connection.
   ```bash
   # Add valid values for:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   MONGODB_URI=...
   JWT_TOKEN=your_secure_admin_token # Token required for admin access
   STRIPE_SECRET_KEY=...
   # etc...
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing
Contributions are welcome. Please open an issue first to discuss what you would like to change.
