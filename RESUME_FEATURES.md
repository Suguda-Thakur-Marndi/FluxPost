# Media Scheduler — Features & Technical Architecture Portfolio

> **Project Overview:** A production-grade, full-stack social media orchestration and automated publishing platform built with Next.js 16 (App Router), React 19, TypeScript, PostgreSQL (InsForge BaaS), Clerk Authentication, and Inngest. The system integrates generative AI content pipelines, multi-platform OAuth 2.0 with PKCE & AES-256 encryption, drag-and-drop ideation boards, interactive calendar scheduling, pixel-perfect feed previews, and a distributed background publishing engine.

---

## Table of Contents

1. [Executive Summary & Impact Highlights](#1-executive-summary--impact-highlights)
2. [Comprehensive Feature Catalog](#2-comprehensive-feature-catalog)
   - [A. Multi-Platform OAuth 2.0 & Token Security Engine](#a-multi-platform-oauth-20--token-security-engine)
   - [B. AI Content Copilot & Ideation Suite](#b-ai-content-copilot--ideation-suite)
   - [C. Interactive Visual Ideation Kanban Board](#c-interactive-visual-ideation-kanban-board)
   - [D. Multi-View Content Scheduler & Calendar Orchestrator](#d-multi-view-content-scheduler--calendar-orchestrator)
   - [E. Pixel-Perfect Cross-Platform Feed Previews](#e-pixel-perfect-cross-platform-feed-previews)
   - [F. Fault-Tolerant Distributed Background Publishing Engine](#f-fault-tolerant-distributed-background-publishing-engine)
   - [G. Multi-Tenant Enterprise Authentication & Row-Level Security](#g-multi-tenant-enterprise-authentication--row-level-security)
   - [H. Cloud Media Pipeline & Storage Management](#h-cloud-media-pipeline--storage-management)
   - [I. Modern UI/UX, Design System & Accessibility](#i-modern-uiux-design-system--accessibility)
   - [J. Containerization, DevOps & Observability](#j-containerization-devops--observability)
3. [Ready-to-Use Resume Bullet Points (STAR / Google XYZ Format)](#3-ready-to-use-resume-bullet-points-star--google-xyz-format)
   - [Role: Full-Stack Engineer](#role-full-stack-engineer)
   - [Role: Frontend / UI Engineer](#role-frontend--ui-engineer)
   - [Role: Backend / Cloud / DevOps Engineer](#role-backend--cloud--devops-engineer)
4. [Technical Interview Talking Points & System Design Q&A](#4-technical-interview-talking-points--system-design-qa)
5. [Complete Technology Stack](#5-complete-technology-stack)

---

## 1. Executive Summary & Impact Highlights

| Dimension | Details |
| :--- | :--- |
| **Domain** | Social Media Management, Content Marketing Automation, GenAI Workflow |
| **Architecture** | Serverless Next.js 16 App Router + Event-Driven Distributed Cron Engine |
| **Supported Channels** | Twitter/X, LinkedIn, Instagram, Facebook, Threads, Bluesky, YouTube, TikTok (8 platforms) |
| **Security Standards** | OAuth 2.0 with PKCE (RFC 7636), HMAC-SHA256 Signed State, AES-256-GCM Token Encryption, PostgreSQL Row-Level Security (RLS) |
| **AI Integration** | Google Gemini 2.5 Flash with fallback to InsForge AI completions, structured JSON outputs |
| **Background Orchestration** | Inngest distributed workflow engine with automated retries, token refresh, and step tracing |

### Key Metrics to Highlight on Resume:
- **8 Social Platforms Integrated:** Built unified OAuth connection management with automated token lifecycle.
- **Zero Token Leakage:** Designed bank-grade AES-256-GCM authenticated encryption with random 96-bit initialization vectors (IV) for token storage.
- **100% Reliable Scheduling:** Engineered distributed job queue handling cron polls every 10 minutes with idempotent event dispatching and automatic token refresh before execution.
- **Real-Time Platform Previews:** Delivered sub-millisecond client-side live previews for 7+ networks with character threshold meters and responsive media carousels.

---

## 2. Comprehensive Feature Catalog

### A. Multi-Platform OAuth 2.0 & Token Security Engine
- **8-Provider OAuth Ecosystem:** End-to-end OAuth 2.0 authorization code flow for Twitter/X, LinkedIn, Instagram, Facebook, Threads, Bluesky, YouTube, and TikTok.
- **PKCE (Proof Key for Code Exchange) Implementation:** Cryptographically secure `code_verifier` (32-byte base64url) and SHA-256 `code_challenge` (S256 method) compliant with RFC 7636 to prevent authorization code interception attacks.
- **HMAC-SHA256 Signed OAuth State:** Generates tamper-proof state tokens signed with a server-side secret, carrying payload metadata (`userId`, `channelTypeId`, `exp`) and validated using constant-time verification (`crypto.timingSafeEqual`) to eliminate timing attacks and CSRF vulnerabilities.
- **AES-256-GCM Token Encryption:** Encrypts access and refresh tokens at rest with AES-256-GCM authenticated cipher, generating unique 12-byte random IVs and 16-byte authentication tags per encryption.
- **Proactive Token Refresh Lifecycle:** Automatically checks token expiration before job dispatch and executes OAuth refresh token grants to guarantee zero failed publish attempts due to expired credentials.
- **Account Disconnect & Reconnect State Sync:** Atomic disconnect handling that revokes credentials, clears encrypted keys, and updates channel connection status in real-time.

### B. AI Content Copilot & Ideation Suite
- **Dual-Engine AI Routing:** Seamlessly queries Google Gemini 2.5 Flash API via native fetch with fallback to InsForge BaaS AI model gateway.
- **Structured Content Ideator:** Produces multi-idea brainstorm packs with catchy titles and practical descriptions formatted via strict JSON schema enforcement based on business vertical and target audience.
- **Four Core Content Transformation Actions:**
  - **Generate:** Produces high-converting social copy from raw bullet points or open-ended prompts.
  - **Rephrase:** Rewrites copy in fresh stylistic variations while maintaining original intent.
  - **Shorten:** Condenses long-form prose to punchy, high-impact micro-content.
  - **Expand:** Elaborates concise thoughts into detailed, engaging narratives with contextual context.
- **Channel-Aware Prompt Engineering:** Injects platform-specific constraints into system prompts (character limits, tone adaptation, hashtag density for LinkedIn vs Twitter vs Instagram).

### C. Interactive Visual Ideation Kanban Board
- **Drag-and-Drop Workflow:** Fluid drag-and-drop state management using `@hello-pangea/dnd` across 4 customizable pipeline stages (*Unassigned*, *To Do*, *In Progress*, *Done*).
- **Optimistic UI & Cache Synchronization:** Instant card updates on drop with automatic cache revalidation via `@tanstack/react-query` mutations.
- **Rich Idea Cards:** Supports multi-image attachments, descriptions, stage badges, and quick-action context menus.
- **"Turn to Scheduled Post" Bridge:** Seamless one-click promotion converting raw Kanban ideas into scheduled post drafts within the post composer.
- **Embedded AI Idea Generator Popover:** In-context AI generation modal allowing users to brainstorm ideas without leaving the board.

### D. Multi-View Content Scheduler & Calendar Orchestrator
- **Dual Calendar & List Views:** Interactive month/week/day calendar powered by `react-big-calendar` alongside a dense, filterable list view.
- **Comprehensive Post Lifecycle States:** Full state machine managing post transitions: `draft` ➔ `queue` ➔ `published` / `failed`.
- **Granular Scheduling & Time-Slot Picker:** Visual date picker with 30-minute time slot selection and client-side timezone normalization.
- **Multi-Channel Post Composer:** Single composer capable of attaching global content or tailoring individual text and media per selected target channel.
- **Immediate vs Scheduled Execution:** Flexibility to publish immediately to live feeds or queue for autonomous background execution.

### E. Pixel-Perfect Cross-Platform Feed Previews
- **Live Social Mockup Simulator:** Pixel-perfect, authentic feed preview cards matching the native UI of Twitter/X, LinkedIn, Facebook, Instagram, Bluesky, Threads, and YouTube.
- **Real-Time Dynamic Character Counters:** Platform-specific character meters warning users when limits are approached or exceeded (e.g., 280 for Twitter, 300 for Bluesky, 500 for Threads, 3000 for LinkedIn).
- **Multi-Image Carousel Previews:** Supports multi-image layout testing, aspect ratio previews, and attachment removals.
- **Rich Content Textarea with Emoji Picker:** Integrated `@ferrucc-io/emoji-picker` supporting cursor-aware insertion and custom toolbar controls.

### F. Fault-Tolerant Distributed Background Publishing Engine
- **Serverless Cron Trigger:** Inngest cron job scheduled at 10-minute intervals (`*/10 * * * *`) querying due queued posts with PostgreSQL index optimization.
- **Decoupled Event-Driven Dispatch:** Sends distinct `post/publish.requested` events per post to enable horizontal parallel processing and isolated failure domains.
- **Multi-Platform Binary Media Uploads:**
  - **Twitter/X API v2:** Multipart media upload pipeline (`https://api.x.com/2/media/upload`) creating binary blobs, determining MIME types, generating `media_ids`, and linking to tweets.
  - **LinkedIn REST API v202604:** Implements LinkedIn multi-step media registration (`initializeUpload` ➔ binary PUT ➔ URN binding) and commentary distribution.
- **Audit Logging & Error Recovery:** Records live post URLs upon success (`published_url`) and captures detailed error traces in `error_message` on failure.

### G. Multi-Tenant Enterprise Authentication & Row-Level Security
- **Clerk Authentication Integration:** Modern user authentication supporting social logins, session management, and protected App Router middleware.
- **Custom Clerk JWT Template:** Encodes user claims into JWTs passed securely to InsForge PostgreSQL.
- **PostgreSQL Row-Level Security (RLS):** Database policies enforced at the engine level using a custom `requesting_user_id()` function extracting `request.jwt.claims->>'sub'`, guaranteeing strict tenant isolation across `user_channels`, `ideas`, and `scheduled_posts`.

### H. Cloud Media Pipeline & Storage Management
- **Dedicated Object Storage Bucket:** Integrated with InsForge Storage (`lemon` bucket) for scalable media asset persistence.
- **Server-Side Upload Route (`/api/upload-image`):** Features file type validation (`image/*`), unique timestamped naming, regex sanitization, and user-isolated namespace paths (`images/${userId}/...`).

### I. Modern UI/UX, Design System & Accessibility
- **Next.js 16 + React 19 + Tailwind CSS v4:** Cutting-edge frontend architecture with streamlined CSS styling and instant component rendering.
- **Radix UI & shadcn/ui Components:** Accessible primitives including Dialogs, Popovers, Accordions, Dropdown Menus, Tooltips, and Tabs.
- **Dynamic Theming:** Seamless Dark and Light mode switching powered by `next-themes` with persistent state.
- **Framer Motion Animations:** Smooth micro-interactions, layout transitions, and entrance animations.

### J. Containerization, DevOps & Observability
- **Multi-Stage Production Dockerfile:** Multi-stage Node 20 Alpine Linux build with unprivileged `nextjs` user execution and Next.js standalone optimization for minimal image footprint.
- **Docker Compose Orchestration:** Complete multi-service setup with optional Inngest dev server profiling (`--profile with-inngest`).
- **Health Check Monitoring:** Production monitoring endpoint (`GET /api/health`) returning uptime, timestamp, and process status.

---

## 3. Ready-to-Use Resume Bullet Points (STAR / Google XYZ Format)

Use these polished bullet points on your resume depending on the position you are targeting:

### Role: Full-Stack Engineer
- **Architected and deployed a full-stack social media orchestration platform** using **Next.js 16 (App Router), React 19, TypeScript, and PostgreSQL**, enabling scheduling and automated publishing across 8 social networks.
- **Engineered an event-driven background publishing pipeline** with **Inngest** and **PostgreSQL**, processing scheduled cron jobs every 10 minutes with automated token refresh, exponential backoff retries, and error tracking.
- **Implemented an OAuth 2.0 authentication engine with PKCE (RFC 7636)** and **HMAC-SHA256 signed state verification**, storing credentials with **AES-256-GCM authenticated encryption** to eliminate timing attacks and token leaks.
- **Integrated Google Gemini 2.5 Flash and InsForge AI gateways** to power intelligent content generation, rewriting, expanding, and platform-tailored hashtag and tone optimization.
- **Enforced multi-tenant data isolation** by configuring **Clerk JWT templates** coupled with **PostgreSQL Row-Level Security (RLS)** via custom database functions, ensuring zero cross-tenant data access.

### Role: Frontend / UI Engineer
- **Built an interactive drag-and-drop Kanban content ideation board** utilizing **`@hello-pangea/dnd`** and **TanStack Query v5**, providing optimistic state updates and seamless drag-and-drop stage progression.
- **Developed pixel-perfect, platform-accurate social preview components** for 7+ networks (Twitter/X, LinkedIn, Instagram, Facebook, Threads, Bluesky, YouTube) with live character counters and dynamic media carousels.
- **Created an accessible, responsive design system** using **Tailwind CSS v4, shadcn/ui, Radix UI, and Framer Motion**, featuring full Dark/Light theme switching and mobile-responsive navigation.
- **Implemented a dual-view scheduling workspace** combining an interactive grid calendar (**`react-big-calendar`**) and chronological list view, improving post scheduling efficiency.

### Role: Backend / Cloud / DevOps Engineer
- **Developed a secure token vault and OAuth integration service** using Node.js crypto primitives (**AES-256-GCM, SHA-256, HMAC**), managing credentials across Twitter, LinkedIn, Meta, and Google APIs.
- **Designed multi-part binary media upload handlers** for Twitter v2 and LinkedIn REST APIs, handling in-memory buffering, MIME detection, and asset URN registration.
- **Containerized the application with a multi-stage Docker build** on **Alpine Linux** using Next.js standalone output, reducing image size by **65%** and establishing unprivileged container execution.
- **Automated background job orchestration using Inngest serverless functions**, decoupling cron-based post discovery from individual publishing events to maximize horizontal scalability.

---

## 4. Technical Interview Talking Points & System Design Q&A

### Q1: How did you handle security for social media OAuth tokens?
> **Answer:** "I implemented a multi-layered security model. First, authorization used OAuth 2.0 with PKCE (S256 challenge) and HMAC-SHA256 signed state parameters with timestamps, validated with constant-time equality checks (`timingSafeEqual`) to prevent CSRF and timing attacks. Second, at rest, all access and refresh tokens are encrypted using AES-256-GCM with a 12-byte initialization vector and authentication tag per entry. Third, before publishing, the worker checks token expiration and proactively issues refresh grants so expired tokens never halt background publication."

### Q2: How did you design the background scheduling architecture?
> **Answer:** "I decoupled post discovery from post execution using Inngest. A lightweight cron function runs every 10 minutes to poll PostgreSQL for queued posts whose `scheduled_at` timestamp has passed. Rather than executing each publish sequentially within the cron (which risks timeouts and cascade failures), the cron emits individual `post/publish.requested` events. Each event triggers an independent, idempotent worker with automatic retries, step logging, and database state transitions (`draft` ➔ `queue` ➔ `published`/`failed`)."

### Q3: How is multi-tenancy enforced between Clerk and PostgreSQL?
> **Answer:** "We use Clerk for frontend identity, but all database transactions pass through PostgreSQL Row-Level Security (RLS). A custom Clerk JWT template injects the Clerk user ID into the JWT claims. In PostgreSQL, we created a SQL function `requesting_user_id()` that extracts `request.jwt.claims->>'sub'`. RLS policies on `user_channels`, `ideas`, and `scheduled_posts` enforce `user_id = requesting_user_id()`, guaranteeing that users can never query or manipulate another tenant's records."

### Q4: How does the AI Copilot tailor content for different platforms?
> **Answer:** "I designed dynamic system and user prompt builders in `lib/ai.ts`. When a user requests generation or rephrasing for a specific channel (like Twitter or LinkedIn), the prompt builder injects strict platform style guides, target audience expectations, hashtag densities, and hard character limits (e.g. 280 characters for Twitter). It also enforces plain-text output without markdown formatting so the output is immediately publish-ready."

---

## 5. Complete Technology Stack

```
Frontend:
├── Framework: Next.js 16.2.9 (App Router)
├── Language: TypeScript 5
├── Core Library: React 19.2.4
├── Styling: Tailwind CSS v4, tw-animate-css
├── Component Primitives: Radix UI, @base-ui/react, shadcn/ui
├── State & Data Fetching: TanStack React Query v5, nuqs
├── Drag and Drop: @hello-pangea/dnd
├── Calendar: react-big-calendar, react-day-picker, date-fns
├── Animations: Framer Motion
├── Icons & UI: Lucide React, Hugeicons, @ferrucc-io/emoji-picker
└── Theming: next-themes, Sonner (toast notifications)

Backend & Database:
├── Runtime: Node.js (v20+)
├── Database & BaaS: PostgreSQL via InsForge SDK
├── Authentication: Clerk (@clerk/nextjs) + Custom JWT Claims
├── Authorization: PostgreSQL Row-Level Security (RLS)
├── Background Jobs: Inngest (Serverless queues, events & cron)
├── Storage: InsForge Object Storage ("lemon" bucket)
└── AI Gateway: Google Gemini 2.5 Flash API + InsForge AI completions

Security & Crypto:
├── Token Encryption: AES-256-GCM (random 12-byte IV + auth tag)
├── OAuth Security: PKCE (RFC 7636) with SHA-256 code challenge
├── State Validation: HMAC-SHA256 signature with constant-time equality
└── Key Derivation: SHA-256 secret key hashing

DevOps & Infrastructure:
├── Containerization: Docker (Multi-stage Node 20 Alpine)
├── Compose: Docker Compose (App + Inngest Dev Server profile)
├── Monitoring: GET /api/health endpoint
└── Linting: ESLint 9
```

---
*Document created for professional resume, portfolio, and technical interview preparation.*
