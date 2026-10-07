# 📚 BookWise — University Library Management System

A production-grade, full-stack **University Library Management System** with a public student portal and an administrative dashboard. Built with modern web development best practices, featuring serverless PostgreSQL, real-time role-based access control, rate limiting, media upload handling, and automated background workflows.

---

## 🚀 Overview

BookWise streamlines university library operations for both students and university administrators:

- **Students / Users**: Browse cataloged books with interactive 3D covers and video trailers, borrow available books with receipt generation and due date tracking, manage their profile, and sign up with student ID verification.
- **Administrators**: Access a dedicated Admin Dashboard to monitor library metrics, manage book inventory (CRUD with color pickers and media uploads), review book borrow requests, oversee registered students, and approve or reject student ID verification requests.

---

## 🛠️ Tech Stack & Libraries

### Core Framework & Language
| Technology | Purpose |
|------------|---------|
| **[Next.js 15 (App Router)](https://nextjs.org/)** | Full-stack React framework with Server Components (RSC), Server Actions, Turbopack, and edge-ready API routes. |
| **[React 19](https://react.dev/)** | Frontend user interface library with latest hooks and actions support. |
| **[TypeScript](https://www.typescriptlang.org/)** | Type safety across database schemas, server actions, APIs, and client components. |

### Database & ORM
| Technology | Purpose |
|------------|---------|
| **[Neon Database](https://neon.tech/)** | Serverless PostgreSQL database with automated branching and connection pooling. |
| **[Drizzle ORM](https://orm.drizzle.team/)** | TypeScript-first ORM with type-safe schema definitions, relationships, and queries. |
| **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** | CLI migration tool and Drizzle Studio database viewer. |

### Authentication & Security
| Technology | Purpose |
|------------|---------|
| **[NextAuth.js v5 (Auth.js)](https://authjs.dev/)** | JWT-based session authentication with Credentials provider and custom callbacks for role-based authorization. |
| **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** | Password hashing with salt rounds for secure credential storage. |
| **[Upstash Ratelimit](https://upstash.com/)** | Sliding window rate limiting protecting authentication routes from DDoS and brute-force attacks. |

### Storage, Media & Automated Workflows
| Technology | Purpose |
|------------|---------|
| **[ImageKit.io](https://imagekit.io/)** | Real-time image & video CDN, optimization, LQIP (Low Quality Image Placeholders), and authenticated file uploads. |
| **[Upstash Redis](https://upstash.com/redis)** | Serverless in-memory data store for rate limiting and session caching. |
| **[Upstash QStash & Workflow](https://upstash.com/qstash)** | Background jobs and automated notification workflows (e.g., student onboarding and due-date reminders). |
| **[Resend](https://resend.com/)** | Transactional email delivery service for notifications. |

### UI & Styling
| Technology | Purpose |
|------------|---------|
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first CSS framework with custom theme configuration. |
| **[Radix UI](https://www.radix-ui.com/)** | Accessible, unstyled UI primitives (Avatar, Dialog, Toast, Label, Slot). |
| **[Lucide React](https://lucide.dev/)** | Clean, modern iconography across student and admin portals. |
| **[React Hook Form](https://react-hook-form.com/)** | Performant, flexible client-side form management with minimal re-renders. |
| **[Zod](https://zod.dev/)** | TypeScript-first schema validation for forms, credentials, and API inputs. |
| **[React Colorful](https://github.com/omgovich/react-colorful)** | Lightweight color picker for customizing book 3D cover palettes. |
| **[Day.js](https://day.js.org/)** | Lightweight date parsing and manipulation for borrow due-dates and timestamps. |

---

## 🌟 Key Features

### 🎓 Public Student Portal
- **Interactive Book Showcase**: Dynamic book list with 3D book covers, color-matched spine bindings, author info, ratings, and synopsis.
- **Video Trailers**: Embedded ImageKit video trailers for featured books.
- **Book Borrowing System**: Single-click book borrowing with automated stock deduction, eligibility verification (approved account status check), and loan receipt creation.
- **Student Profile**: Overview of currently borrowed books, remaining loan periods, and borrowing history.
- **Header Navigation with Admin Badge**: Dynamic header featuring student avatar initials, one-click logout, and an **Admin Portal** button when signed in as an administrator.

### 🛡️ Administrative Portal (`/admin`)
- **Real-Time Analytics Dashboard**: Live metrics tracking Total Books, Registered Users, Active Book Loans, and Pending Account Approvals.
- **Book Inventory Management (`/admin/books`)**: Full catalog table with covers, stock levels, genres, and ratings.
- **Add New Book (`/admin/books/new`)**: Rich form with cover image upload, video trailer upload, color picker, genre classification, and stock quantity.
- **User Management (`/admin/users`)**: Searchable list of students with University IDs, status badges, and one-click role switching (`USER` / `ADMIN`).
- **Borrow Requests & Tracking (`/admin/book-requests`)**: Active loan monitoring with due dates and a **Mark Returned** button that automatically increments stock back into the catalog.
- **Student Verification Center (`/admin/account-requests`)**: Verification portal to inspect uploaded student ID cards and **Approve** or **Reject** pending accounts.

---

## 📁 Project Architecture

```
library/
├── app/
│   ├── (auth)/                  # Authentication route group
│   │   ├── sign-in/             # Login page
│   │   └── sign-up/             # Registration page with ID card upload
│   ├── (root)/                  # Public student portal route group
│   │   ├── layout.tsx           # Student layout with Header & activity tracker
│   │   ├── page.tsx             # Home catalog with featured book overview
│   │   ├── books/[id]/          # Detailed book page with loan CTA
│   │   └── my-profile/          # Student loan status & profile
│   ├── admin/                   # Administrative dashboard route group
│   │   ├── layout.tsx           # Admin layout with role-verification & Sidebar
│   │   ├── page.tsx             # Metrics dashboard & recent activity
│   │   ├── books/               # All books table & inventory list
│   │   │   └── new/             # Add new book form
│   │   ├── users/               # Student roster & role management
│   │   ├── book-requests/       # Borrow tracking & book return action
│   │   └── account-requests/    # Student ID approval center
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth endpoint handler
│       ├── imagekit/            # ImageKit auth parameter generator
│       └── workflows/           # QStash background automation hooks
├── components/
│   ├── admin/                   # Admin UI components (Sidebar, Header, Forms)
│   ├── ui/                      # Radix UI primitives (Button, Input, Avatar, Toast)
│   ├── BookCard.tsx             # Catalog book card component
│   ├── BookCover.tsx            # Adaptive 3D book cover (ImageKit + fallback)
│   ├── BookOverview.tsx         # Hero section for featured book
│   ├── FileUpload.tsx           # ImageKit client-side uploader
│   └── Header.tsx               # Responsive navbar with Admin Portal entry
├── database/
│   ├── schema.ts                # Drizzle schema (users, books, borrow_records)
│   ├── drizzle.ts               # Neon HTTP client & Drizzle db instance
│   ├── seed.ts                  # Database seeding script for catalog books
│   └── create-admin.ts          # Master admin account generator script
├── lib/
│   ├── actions/                 # Student Server Actions (auth, borrowBook)
│   ├── admin/actions/           # Admin Server Actions (createBook, user roles, returns)
│   ├── config.ts                # Centralized environment variable manager
│   ├── ratelimit.ts             # Upstash Redis rate limiter with dev fallback
│   └── workflow.ts              # Upstash QStash & email workflow client
└── public/icons/                # SVG icons for student and admin interfaces
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** (v18.17 or later, v20+ recommended)
- **pnpm** or **npm**
- A **[Neon PostgreSQL](https://neon.tech/)** database URL

### 2. Clone and Install Dependencies

```bash
git clone https://github.com/adrianhajdin/university-library-jsm.git library
cd library

# Install dependencies
npm.cmd install
# Or with pnpm:
# npx.cmd pnpm install
```

### 3. Environment Variables Configuration

Create a `.env.local` file in the project root:

```env
# NextAuth Authentication
AUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# App Endpoints
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000/api
NEXT_PUBLIC_PROD_API_ENDPOINT=http://localhost:3000/api

# Neon Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require

# ImageKit Credentials (CDN & Media Storage)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_pwd17k26p
IMAGEKIT_PRIVATE_KEY=private_pwd17k26p
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/pwd17k26p

# Upstash Redis (Optional for dev — Rate Limiting)
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Upstash QStash & Resend (Optional for dev — Background Emails)
QSTASH_URL=https://qstash.upstash.io/v2/publish
QSTASH_TOKEN=
RESEND_TOKEN=
```

> **Tip**: Generate a secure `AUTH_SECRET` using `openssl rand -base64 32` or `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`.

### 4. Push Database Schema & Seed Catalog

```bash
# Push schema tables (users, books, borrow_records) to Neon PostgreSQL
npm.cmd run db:migrate

# Seed catalog with 17 sample books and covers
npm.cmd run seed

# Create or reset Master Admin credentials
npx.cmd tsx database/create-admin.ts
```

### 5. Run Development Server

```bash
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Master Admin Account

| Credential | Value |
|------------|-------|
| **Email** | `admin@library.com` |
| **Password** | `Admin123!` |
| **Role** | `ADMIN` |
| **Status** | `APPROVED` |
| **University ID** | `1001` |

Once signed in, click the **Admin Portal** button in the top navbar or navigate directly to `/admin`.

---

## 🗄️ Database Schema Summary

The database uses PostgreSQL via Neon with Drizzle ORM:

```mermaid
erDiagram
    USERS ||--o{ BORROW_RECORDS : "borrows"
    BOOKS ||--o{ BORROW_RECORDS : "loaned in"

    USERS {
        uuid id PK
        varchar full_name
        text email UK
        int university_id UK
        text password
        text university_card
        enum status "PENDING | APPROVED | REJECTED"
        enum role "USER | ADMIN"
        date last_activity_date
        timestamp created_at
    }

    BOOKS {
        uuid id PK
        varchar title
        varchar author
        text genre
        int rating
        text cover_url
        varchar cover_color
        text description
        int total_copies
        int available_copies
        text video_url
        varchar summary
        timestamp created_at
    }

    BORROW_RECORDS {
        uuid id PK
        uuid user_id FK
        uuid book_id FK
        timestamp borrow_date
        date due_date
        date return_date
        enum status "BORROWED | RETURNED"
        timestamp created_at
    }
```

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `next dev --turbopack` | Starts local Next.js dev server with Turbopack |
| `npm run build` | `next build` | Compiles production build |
| `npm run start` | `next start` | Runs the compiled production server |
| `npm run lint` | `next lint` | Runs ESLint check across all files |
| `npm run seed` | `npx tsx database/seed.ts` | Populates database with sample books |
| `npm run db:generate` | `nrizzle-kit generate` | Generates Drizzle migration files |
| `npm run db:migrate` | `drizzle-kit migrate` | Applies pending migrations to PostgreSQL |
| `npm run db:studio` | `drizzle-kit studio` | Launches visual database UI in browser |

---

## 📄 License

This project is licensed under the MIT License.
