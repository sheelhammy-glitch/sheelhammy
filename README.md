# شيل همي - Service Marketplace Platform

A scalable, production-ready Next.js 15 application with TypeScript, TailwindCSS, shadcn/ui, and Prisma.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: MySQL (via Prisma)
- **Authentication**: NextAuth v5
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **State Management**: TanStack Query + Zustand
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── admin/          # Admin area
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── orders/
│   │   │   ├── services/
│   │   │   ├── categories/
│   │   │   ├── providers/
│   │   │   ├── payments/
│   │   │   └── settings/
│   │   └── dashboard/      # Client/Provider dashboard
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── orders/
│   │       ├── jobs/
│   │       └── profile/
│   ├── (main)/             # Public pages
│   ├── (home)/             # Landing page
│   ├── auth/               # Auth pages
│   └── api/                # API routes
├── components/
│   ├── common/             # Shared components
│   │   ├── data-table/
│   │   ├── PageHeader.tsx
│   │   ├── StatCard.tsx
│   │   ├── EmptyState.tsx
│   │   └── ...
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── auth/               # Auth configuration
│   ├── db/                 # Prisma client
│   ├── rbac/               # Role-based access control
│   └── utils/              # Utilities
└── server/
    ├── actions/            # Server actions
    ├── repositories/       # Data access layer
    └── services/           # Business logic
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sheelhammy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in the required variables:
```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/dbname"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: File Storage (for future S3/Supabase integration)
# STORAGE_PROVIDER="local" | "s3" | "supabase"
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""
# AWS_BUCKET_NAME=""
```

## Database Schema

The application uses Prisma with MySQL. Key models include:

- **User**: Users with roles (ADMIN, CLIENT, PROVIDER)
- **Order**: Service requests from clients
- **Job**: Assigned work to providers
- **Payment**: Payment records with multiple methods
- **Service**: Available services
- **Category**: Service categories
- **Offer**: Admin offers for orders
- **Negotiation**: Negotiation threads
- **Review**: Client reviews

See `prisma/schema.prisma` for the complete schema.

## Authentication & Authorization

- **NextAuth v5** handles authentication
- **RBAC** (Role-Based Access Control) via middleware
- Roles:
  - `ADMIN`: Full access to `/admin`
  - `CLIENT`: Access to `/dashboard` (orders, payments)
  - `PROVIDER`: Access to `/dashboard` (jobs, earnings)

## Features

### Admin Area (`/admin`)
- Dashboard with statistics
- Order management (view, assign, negotiate)
- Service & Category CRUD
- Provider management
- Payment verification
- Platform settings

### Client Dashboard (`/dashboard`)
- Order creation and tracking
- Payment history
- Profile management

### Provider Dashboard (`/dashboard`)
- Job management
- Deliverable uploads
- Earnings tracking
- Profile management

## Development

### Running Migrations
```bash
npx prisma migrate dev
```

### Seeding Database
```bash
npx prisma db seed
```

### Type Generation
```bash
npx prisma generate
```

## Architecture Notes

- **Server Actions**: Preferred for mutations (create/update/delete)
- **Route Handlers**: Used for list endpoints with pagination/filtering
- **TanStack Query**: Client-side data fetching and caching
- **Zustand**: UI state only (sidebar, theme, etc.)
- **Component Structure**: Pages split into `page.tsx` + `_components/`
- **Type Safety**: Full TypeScript with Prisma types

## License

Private - All rights reserved
