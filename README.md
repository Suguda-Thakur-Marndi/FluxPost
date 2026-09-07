# Media Scheduler

An enterprise-grade social media management and content scheduling platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, **Clerk Authentication**, and **InsForge PostgreSQL BaaS**.

Media Scheduler empowers creators, social media managers, and marketing teams to brainstorm AI-driven ideas, draft and format posts, preview realistic cross-platform feeds across **8 social networks**, schedule automated background publishing via **Inngest**, and track publishing velocity from a unified command center.

---

## Table of Contents

- [Key Features](#key-features)
- [Supported Social Channels](#supported-social-channels)
- [Design System & UI/UX](#design-system--uiux)
- [Tech Stack](#tech-stack)
- [Application Architecture & Routes](#application-architecture--routes)
- [API Endpoints Reference](#api-endpoints-reference)
- [Database Schema (InsForge PostgreSQL)](#database-schema-insforge-postgresql)
- [Background Publishing Workflow (Inngest)](#background-publishing-workflow-inngest)
- [Getting Started & Local Setup](#getting-started--local-setup)
- [Environment Variables](#environment-variables)
- [Docker & Container Deployment](#docker--container-deployment)
- [Security & Encryption](#security--encryption)
- [Available Scripts](#available-scripts)

---

## Key Features

### 1. Dashboard Command Center
- **KPI Metrics:** Track total posts, scheduled content queue, published history, and draft reserves in real-time.
- **Personalized Header:** Time-of-day greeting, attention banner for pending drafts, and quick-action triggers for creating posts and generating ideas.
- **AI Content Studio Ribbon:** Instant AI generation prompt bar embedded directly in the dashboard overview.
- **Recent Activity Feed:** Live status chips (`Draft`, `Scheduled`, `Published`, `Failed`), scheduled dates, and channel icons.
- **Connected Channels Quick-Status:** Real-time visibility into active OAuth tokens across all 8 networks.

### 2. Post Composer & Multi-Channel Feed Previews
- **Multi-Channel Selection:** Select one or multiple target platforms with interactive toggle pills.
- **Dynamic Character & Media Counters:** Real-time character counts customized to platform constraints (e.g., 280 for Twitter/X, 3,000 for LinkedIn, 2,200 for Instagram).
- **Scheduled Time Picker:** Native date and time scheduling with timezone preservation.
- **Tri-Action Publishing Toolbar:** One-click shortcuts for **Save Draft**, **Publish Now**, and **Schedule Post**.
- **Pixel-Accurate Live Previews:** Tabbed realistic live previews rendering accurate typography, verified badges, action icons, avatars, and aspect ratios for:
  - **Twitter / X:** Compact tweet view with reply/repost/like counters and timestamp.
  - **LinkedIn:** Professional post card with company/author headline, connection degree, and engagement bar.
  - **Instagram:** Square feed card with header avatar, photo carousel placeholder, like/comment/share icons, and caption preview.
  - **TikTok:** Realistic 9:16 vertical smartphone viewport with creator handle, music sound ticker, right-side engagement rail (like, comment, bookmark, share), and bottom navigation overlay.
  - **Facebook:** Classic News Feed card with privacy badge (Public), timestamp, like/react buttons, and comment box.
  - **Threads:** Clean Meta Threads layout with avatar thread line, reply icons, and conversation simulation.
  - **Bluesky:** Decentralized AT Protocol layout with handle, domain handle, repost, and favorite actions.
  - **YouTube:** YouTube Community / Shorts caption preview with channel branding and subscriber badge.

### 3. Ideas Kanban Studio
- **AI Brainstorming Engine:** Generate fresh post topics and captions categorized by industry, tone, and audience.
- **Drag-and-Drop Workflow:** Move cards seamlessly across Kanban columns:
  - `Brainstorm` &rarr; `Drafting` &rarr; `Ready`
- **Instant Search & Filter:** Search ideas by topic keyword, category tag, or target channel.
- **Direct Conversion:** Single-click "Turn to Post" button instantly clones idea content into the Post Composer.

### 4. Interactive Publishing Calendar & List Views
- **Monthly, Weekly, & Day Calendar:** Full visual calendar powered by `react-big-calendar` with color-coded channel pills and status markers.
- **Custom Calendar Toolbar:** Segmented view switchers, quick navigation (Today, Prev, Next), and active date badges.
- **Date-Grouped List View:** Chronological post list with status filter pills (`All`, `Drafts`, `Scheduled`, `Published`, `Failed`), inline edit actions, and quick rescheduling.

### 5. Channel Connections & OAuth Center
- **Connect & Disconnect:** Authenticate social accounts via official OAuth 2.0 with PKCE and state protection.
- **Status Indicators:** Instant badge display of token expiration, connected profile handle, and permission scopes.
- **Credential Encryption:** All access and refresh tokens are encrypted at rest using AES-256-GCM before saving to the database.

### 6. Settings, Account, & Theme Engine
- **Dark Mode / Light Mode / System Theme:** Instant theme switching using `next-themes` with zero layout shift or flash.
- **Workspace Settings:** Profile customization, timezone selection, and notification preference controls.
- **Connected Accounts Management:** Overview of all linked platform integrations with re-authentication triggers.

### 7. Usage Quotas & Billing
- **Real-Time Usage Metering:** Visual progress meters tracking monthly post volume against plan limits.
- **Clerk Pricing Table Wrapper:** Native embedding of Clerk's `<PricingTable />` for billing management and upgrade flows.
- **Plan Comparison Matrix:** Transparent breakdown of Free, Creator, and Pro plan limits.

### 8. Full Marketing & Public Pages Suite
- **Modern Landing Page:** Hero section with animated badges, interactive feature showcases, channel pill carousel, and customer testimonials.
- **Dedicated Feature Walkthrough:** Deep-dive into AI generation, multi-channel scheduling, and analytics.
- **Dynamic Pricing Page:** Monthly vs. annual billing toggle with an interactive FAQ accordion.
- **Channels Directory:** Dedicated page explaining connection capabilities for each supported social network.
- **Workflow & Contact Pages:** Visual diagrams explaining end-to-end publishing, plus a contact inquiry form.
- **Legal Compliance:** Comprehensive Privacy Policy and Terms of Service documents.

---

## Supported Social Channels

| Platform | Channel Key | Connection Type | Live Preview | Scheduled Publishing |
| :--- | :--- | :--- | :---: | :---: |
| **Twitter / X** | `twitter` | OAuth 2.0 (PKCE) | Yes | **Active (API v2)** |
| **LinkedIn** | `linkedin` | OAuth 2.0 (`w_member_social`) | Yes | **Active (UGC Post API)** |
| **Instagram** | `instagram` | Meta Graph API | Yes | Graph API Ready |
| **Facebook** | `facebook` | Meta Graph API | Yes | Graph API Ready |
| **Threads** | `threads` | Meta Threads API | Yes | Graph API Ready |
| **Bluesky** | `bluesky` | AT Protocol OAuth | Yes | AT Protocol Ready |
| **YouTube** | `youtube` | Google OAuth 2.0 | Yes | Data API v3 Ready |
| **TikTok** | `tiktok` | TikTok Creator API | Yes | Content Posting API Ready |

> **Publishing Status Note:** Twitter/X and LinkedIn have end-to-end background publishing execution via Inngest workers. All 8 platforms support live feed simulation, OAuth connection flows, token storage, and database association.

---

## Design System & UI/UX

Media Scheduler includes a persisted Master Design System located in [`design-system/media-scheduler/`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/design-system/media-scheduler/MASTER.md).

### Design Tokens & Philosophy
- **Aesthetic:** Editorial, modern SaaS interface built with high-density layouts, subtle micro-borders, and refined typography.
- **Color Palette:**
  - **Neutral Base:** Slate & Zinc (`hsl(222, 47%, 11%)` dark base; clean neutral light base)
  - **Brand Accent:** Indigo & Violet (`hsl(238, 84%, 60%)` / `hsl(262, 83%, 58%)`)
  - **Semantic States:** Emerald (`Published`), Amber (`Scheduled`), Slate (`Draft`), Rose (`Failed`)
  - **Platform Brand Accents:** Twitter (#1DA1F2), LinkedIn (#0A66C2), Instagram (#E4405F), TikTok (#000000 / #00F2FE), Facebook (#1877F2), Threads (#101010), Bluesky (#0285FF), YouTube (#FF0000)
- **Typography:** Inter / system UI font stack with high-legibility tabular figures for counters and timestamps.
- **Elevation:** Layered translucent card surfaces with subtle borders (`border-border/50` or `border-border/70`) and delicate drop shadows.
- **Zero Layout Shift:** Responsive layouts tested on mobile (375px), tablet (768px), desktop (1280px), and ultrawide monitors.

---

## Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack bundler
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Theme Support:** [next-themes](https://github.com/pacocoursey/next-themes) (Light / Dark / System)
- **Authentication:** [Clerk Auth](https://clerk.com/)
- **Database & BaaS:** [InsForge](https://insforge.dev) (PostgreSQL BaaS with `@insforge/sdk`)
- **Background Jobs:** [Inngest](https://www.inngest.com/) (Serverless cron & scheduled publishing execution)
- **State & Data Fetching:** [TanStack Query v5](https://tanstack.com/query)
- **Calendar Engine:** [react-big-calendar](https://github.com/jquense/react-big-calendar) with `date-fns`
- **Drag & Drop:** [dnd-kit](https://dndkit.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Cryptography:** Node.js native `crypto` (AES-256-GCM ciphering)

---

## Application Architecture & Routes

```
media-scheduler/
├── app/
│   ├── (auth)/                       # Clerk authentication wrappers
│   │   ├── sign-in/[[...sign-in]]/   # Sign in page
│   │   └── sign-up/[[...sign-up]]/   # Sign up page
│   ├── (dashboard)/                  # Authenticated application shell
│   │   ├── dashboard/                # Main dashboard command center
│   │   ├── ideas/                    # Idea studio Kanban & AI generator
│   │   ├── posts/                    # Post composer & feed preview
│   │   ├── calendar/                 # Monthly, weekly, day calendar view
│   │   ├── list/                     # Chronological list view & filters
│   │   ├── channels/                 # Social accounts & OAuth connection center
│   │   ├── settings/                 # Profile, theme, & workspace preferences
│   │   └── billing/                  # Quotas, plan limits & Clerk pricing
│   ├── api/                          # Next.js route handlers
│   │   ├── posts/                    # CRUD for posts
│   │   ├── ideas/                    # CRUD & conversion for ideas
│   │   ├── channels/                 # Social channel management & OAuth
│   │   ├── inngest/                  # Inngest background event receiver
│   │   └── generate-ideas/           # AI idea generator
│   ├── features/                     # Public marketing feature details
│   ├── pricing/                      # Public pricing & comparison page
│   ├── workflow/                     # Public scheduling workflow guide
│   ├── contact/                      # Contact inquiry form
│   ├── privacy/                      # Privacy policy
│   ├── terms/                        # Terms of service
│   ├── layout.tsx                    # Root application layout (Clerk + ThemeProvider)
│   └── page.tsx                      # Public landing page
├── components/
│   ├── app-header.tsx                # Dashboard sticky top bar
│   ├── app-sidebar.tsx               # Collapsible dashboard navigation
│   ├── dark-mode-toggle.tsx          # Light/Dark/System theme switcher
│   ├── ui/                           # shadcn/ui primitives (dialog, button, etc.)
│   └── post/                         # Post composer & channel preview components
│       ├── post-form.tsx             # Post draft/schedule composer
│       ├── channel-selector.tsx      # Social platform selection pills
│       └── previews/                 # 8 Realistic feed previews
├── lib/
│   ├── insforge.ts                   # InsForge PostgreSQL BaaS client
│   ├── inngest/                      # Inngest client and functions
│   ├── crypto.ts                     # AES-256-GCM token encryption
│   └── social/                       # Social API publishers (Twitter, LinkedIn)
└── design-system/                    # Persisted design system specifications
```

### Full Route Map

| Route Path | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Public landing page with features, social proof, and CTA |
| `/features` | Public | Comprehensive product features and capabilities |
| `/pricing` | Public | Plans, annual/monthly toggle, features table, FAQs |
| `/workflow` | Public | Visual explanation of the multi-channel workflow |
| `/channels` | Public | Information on all 8 supported social channels |
| `/contact` | Public | User support & inquiry contact form |
| `/privacy` | Public | Privacy policy and data handling documentation |
| `/terms` | Public | Terms of service and acceptable use agreement |
| `/sign-in` | Public | Clerk authentication login portal |
| `/sign-up` | Public | Clerk authentication registration portal |
| `/dashboard` | Protected | Dashboard overview, metrics, attention banner, recent posts |
| `/ideas` | Protected | Drag-and-drop idea board with AI brainstorm ribbon |
| `/posts` | Protected | Unified post composer with 8-channel feed previews |
| `/calendar` | Protected | Full visual calendar with schedule markers |
| `/list` | Protected | Filterable list view of drafts, scheduled, and published posts |
| `/channels` | Protected | Social channel connection manager |
| `/settings` | Protected | Appearance, theme, timezone, and workspace preferences |
| `/billing` | Protected | Usage counters, plan tiers, and Clerk `<PricingTable />` |

---

## API Endpoints Reference

### Posts (`/api/posts`)
- `GET /api/posts` &mdash; Fetch user posts (supports status filtering: `draft`, `scheduled`, `published`, `failed`).
- `POST /api/posts` &mdash; Create a post (Draft, Immediate Publish, or Scheduled). Dispatches Inngest event if scheduled.
- `GET /api/posts/[id]` &mdash; Retrieve details of a specific post.
- `PATCH /api/posts/[id]` &mdash; Update post content, target channels, or scheduled time.
- `DELETE /api/posts/[id]` &mdash; Remove a post and cancel scheduled publishing jobs.

### Ideas (`/api/ideas`)
- `GET /api/ideas` &mdash; Fetch all ideas for the authenticated user.
- `POST /api/ideas` &mdash; Create a new brainstorming idea card.
- `PATCH /api/ideas/[id]` &mdash; Update idea stage (`brainstorm`, `drafting`, `ready`) or notes.
- `DELETE /api/ideas/[id]` &mdash; Delete an idea card.
- `POST /api/ideas/[id]/convert` &mdash; Convert idea into a drafted post.

### Social Channels & OAuth (`/api/channels`)
- `GET /api/channels` &mdash; List all connected social channels for the user.
- `GET /api/channels/[platform]/auth` &mdash; Generate OAuth authorization URL with encrypted state and PKCE challenge.
- `GET /api/channels/[platform]/callback` &mdash; Exchange authorization code for tokens and store encrypted credentials.
- `DELETE /api/channels/[id]` &mdash; Revoke token and remove connected social channel.

### Background Tasks & Webhooks
- `POST /api/inngest` &mdash; Inngest background event intake endpoint.
- `POST /api/generate-ideas` &mdash; AI content brainstorm endpoint.

---

## Database Schema (InsForge PostgreSQL)

Media Scheduler uses [InsForge](https://insforge.dev) as its backend database. All tables enforce user-level isolation via Clerk user IDs.

### 1. `posts` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | Unique post identifier |
| `user_id` | `VARCHAR(255)` | Not Null, Indexed | Clerk User ID |
| `content` | `TEXT` | Not Null | Post caption or body text |
| `media_urls` | `TEXT[]` | Default `'{}'` | Array of attached image/video URLs |
| `channels` | `VARCHAR(50)[]` | Not Null | Array of target channels (e.g. `['twitter', 'linkedin']`) |
| `status` | `VARCHAR(50)` | Not Null | `draft`, `scheduled`, `publishing`, `published`, `failed` |
| `scheduled_at` | `TIMESTAMPTZ` | Nullable | Intended publishing timestamp |
| `published_at` | `TIMESTAMPTZ` | Nullable | Actual timestamp when published |
| `error_message` | `TEXT` | Nullable | Failure reason if publishing failed |
| `created_at` | `TIMESTAMPTZ` | Default `NOW()` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | Default `NOW()` | Last modification timestamp |

### 2. `ideas` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | Unique idea identifier |
| `user_id` | `VARCHAR(255)` | Not Null, Indexed | Clerk User ID |
| `title` | `VARCHAR(255)` | Not Null | Idea title or headline |
| `description` | `TEXT` | Nullable | Detailed draft notes or caption |
| `stage` | `VARCHAR(50)` | Default `'brainstorm'` | `brainstorm`, `drafting`, `ready` |
| `category` | `VARCHAR(100)` | Nullable | Topic tag or content pillar |
| `target_channel`| `VARCHAR(50)` | Nullable | Optional target platform |
| `created_at` | `TIMESTAMPTZ` | Default `NOW()` | Creation timestamp |

### 3. `channels` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | Unique channel record ID |
| `user_id` | `VARCHAR(255)` | Not Null, Indexed | Clerk User ID |
| `platform` | `VARCHAR(50)` | Not Null | `twitter`, `linkedin`, `instagram`, `facebook`, etc. |
| `account_id` | `VARCHAR(255)` | Not Null | Platform-specific user/account ID |
| `account_name` | `VARCHAR(255)` | Not Null | Platform username or display name |
| `access_token` | `TEXT` | Not Null | AES-256-GCM encrypted access token |
| `refresh_token`| `TEXT` | Nullable | AES-256-GCM encrypted refresh token |
| `expires_at` | `TIMESTAMPTZ` | Nullable | Token expiration timestamp |
| `scopes` | `TEXT[]` | Default `'{}'` | Granted OAuth permission scopes |
| `created_at` | `TIMESTAMPTZ` | Default `NOW()` | Connection timestamp |

---

## Background Publishing Workflow (Inngest)

Media Scheduler delegates scheduled execution to [Inngest](https://www.inngest.com/), guaranteeing reliable execution without long-running server instances.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as Next.js App Router
    participant DB as InsForge PostgreSQL
    participant Inngest as Inngest Engine
    participant Social as Social Platform API

    User->>App: Schedule Post (Date & Time)
    App->>DB: Save post with status = 'scheduled'
    App->>Inngest: Send event "post/scheduled" (postId, scheduledAt)
    Inngest-->>App: Acknowledge event queued

    Note over Inngest: Inngest pauses until scheduledAt timestamp

    Inngest->>App: Trigger scheduled execution handler
    App->>DB: Fetch post & decrypt channel tokens
    App->>DB: Update status to 'publishing'
    App->>Social: Dispatch post to Twitter / LinkedIn APIs
    alt Successful Publish
        Social-->>App: Return published Post ID / URL
        App->>DB: Update status = 'published', set published_at
    else API Failure
        Social-->>App: Error (Rate limit, expired token, etc.)
        App->>DB: Update status = 'failed', store error_message
    end
```

### Inngest Functions
- **`publishScheduledPost`**: Sleeps until `post.scheduled_at`, queries the database for active OAuth tokens, decrypts credentials, dispatches network requests via social publisher modules, and records output.
- **`cleanupOldDrafts`** *(Optional cron)*: Scheduled routine to prune abandoned temporary assets.

---

## Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.18+ or v20+ recommended
- **Package Manager**: `npm` (or `pnpm` / `yarn`)
- **Accounts Needed**:
  - [Clerk](https://clerk.com/) (for authentication)
  - [InsForge](https://insforge.dev) (for database)
  - [Inngest Dev Server](https://www.inngest.com/docs/local-development) (for background scheduling)
  - Developer accounts for Twitter/X, LinkedIn, Meta (optional for local OAuth testing)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/media-scheduler.git
   cd media-scheduler
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment template to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Clerk, InsForge, Inngest, and OAuth credentials (see [Environment Variables](#environment-variables)).

4. **Initialize Database Tables:**
   Execute the migration SQL file in your InsForge database console:
   ```bash
   # Run the SQL script located at:
   # lib/db/schema.sql (or run via InsForge CLI)
   ```

5. **Start the Next.js Development Server:**
   ```bash
   npm run dev
   ```
   The application will be running at [http://localhost:3000](http://localhost:3000).

6. **Start Inngest Dev Server (in a separate terminal):**
   ```bash
   npx inngest-cli@latest dev
   ```
   The Inngest dashboard will be available at [http://localhost:8288](http://localhost:8288) to monitor events and scheduled jobs.

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Next.js App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# InsForge BaaS (PostgreSQL)
INSFORGE_API_KEY="ik_..."
INSFORGE_PROJECT_URL="https://your-project.us-east.insforge.app"
DATABASE_URL="postgresql://postgres:...@your-project.us-east.insforge.app:5432/postgres"

# Inngest Background Jobs
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# Token Security (Must be a 32-byte hex string)
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# Social Channel OAuth Credentials (Optional for local mocking)
# Twitter / X
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""

# LinkedIn
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""

# Meta (Facebook / Instagram / Threads)
META_APP_ID=""
META_APP_SECRET=""

# TikTok
TIKTOK_CLIENT_KEY=""
TIKTOK_CLIENT_SECRET=""

# Google / YouTube
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Bluesky
BLUESKY_IDENTIFIER=""
BLUESKY_APP_PASSWORD=""
```

---

## Docker & Container Deployment

Media Scheduler includes a production-optimized `Dockerfile` and `compose.yaml` using multi-stage builds.

### Run with Docker Compose

```bash
# Build and run containers in detached mode
docker compose up -d --build

# View container logs
docker compose logs -f

# Stop containers
docker compose down
```

### Build Docker Image Manually

```bash
docker build -t media-scheduler:latest .
docker run -p 3000:3000 --env-file .env.local media-scheduler:latest
```

---

## Security & Encryption

- **Credential Ciphering:** Social media OAuth tokens are never stored as plaintext. They are encrypted using `AES-256-GCM` with a unique Initialization Vector (IV) and authentication tag per record.
- **Authentication & RLS:** All API route handlers and server actions verify user identity via Clerk session tokens (`auth()`). Database queries strictly constrain rows to `user_id = userId`.
- **OAuth CSRF Mitigation:** OAuth flows implement random cryptographic `state` parameters stored in secure, `HttpOnly`, `SameSite=Lax` cookies with PKCE verification where supported (Twitter/X, Bluesky).
- **Environment Isolation:** Sensitive keys (`CLERK_SECRET_KEY`, `ENCRYPTION_KEY`, `INSFORGE_API_KEY`) are kept server-side and never exposed to the client bundle.

---

## Available Scripts

In the project root, you can run:

```bash
# Start Next.js development server
npm run dev

# Run ESLint to verify code quality
npm run lint

# Build production bundle with Next.js Turbopack
npm run build

# Start production server
npm run start
```

---

## License

This project is licensed under the [MIT License](LICENSE).

```text
MIT License

Copyright (c) 2026 Suguda Thakur Marndi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
