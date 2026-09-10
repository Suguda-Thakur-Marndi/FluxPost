# Media Scheduler — Comprehensive Architecture & Engineering Audit

**Document Version:** 2.0.0  
**Audit Scope:** Full repository (Frontend, Backend, Database, Background Jobs, Security, CI/CD, DevOps)  
**Classification:** Engineering Audit & SaaS Production Roadmap  
**Date:** September 2026  

---

## 1. Executive Summary & Existing Architecture

**Media Scheduler** is a multi-channel social media automation platform designed for content planning, AI-assisted drafting, feed simulation, and background publishing. The existing system operates on a modern JavaScript/TypeScript stack:

* **Frontend:** Next.js 16.2.9 (App Router), React 19.2.4, Tailwind CSS v4, shadcn/ui, Radix UI, TanStack Query v5, `react-big-calendar`, `@hello-pangea/dnd`
* **Authentication:** Clerk Auth (`@clerk/nextjs` 7.5.3)
* **Backend BaaS:** InsForge (`@insforge/sdk` 1.4.2) backed by PostgreSQL with Row Level Security (RLS)
* **Asynchronous Jobs & Workflow:** Inngest (`inngest` 4.6.0)
* **Cryptography:** Node.js native `crypto` (AES-256-GCM ciphering, HMAC-SHA256 state signing)
* **AI Engine:** Google Gemini (`gemini-2.5-flash` direct API + InsForge BaaS fallback)
* **Infrastructure:** Docker multi-stage containerization (`node:20-alpine`) with Docker Compose

### High-Level System Architecture Diagram

```
                             [ Web Browser / Client ]
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             │                                                     │
             ▼                                                     ▼
     [ Next.js 16 App ]                                   [ Clerk Identity ]
     - proxy.ts (Auth filter)                              - Session JWT
     - React 19 Client/Server Components                   - User Metadata
     - App Router (/dashboard, /schedule, etc.)            - PricingTable UI
             │
             ├─────────────────────────────────────────────┐
             ▼                                             ▼
    [ API Route Handlers ]                        [ External Social APIs ]
    - /api/post (CRUD, totals)                     - Twitter / X (v2 API)
    - /api/channel (OAuth, status)                 - LinkedIn (v2 / UGC API)
    - /api/idea (AI generation, Kanban)            - Meta Graph API (Mock/Ready)
    - /api/health (Uptime check)                   - TikTok, Bluesky, YouTube
    - /api/inngest (Job Webhook)
             │
             ├──────────────────────┬──────────────────────┐
             ▼                      ▼                      ▼
    [ InsForge Postgres ]   [ Inngest Engine ]      [ Google Gemini AI ]
    - scheduled_posts       - Cron (*/10 min)       - Ideas generation
    - user_channels         - Event Dispatcher      - Post rephrasing
    - channel_types         - Scheduled Publisher
    - ideas / idea_groups
```

---

## 2. Product & Social Channel Implementation Reality

The platform exposes UI selectors, color themes, and realistic feed preview components for **8 social networks**. However, a rigorous code-level audit demonstrates that their backend publishing and integration maturity varies significantly:

| Platform | Channel Key | Connection Mechanism | Feed Live Preview | Background Publishing Status | Implementation Category |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Twitter / X** | `TWITTER` | OAuth 2.0 with PKCE | High-fidelity | End-to-end active via Inngest worker (`api.x.com/2/tweets` + media upload) | **Fully Implemented** |
| **LinkedIn** | `LINKEDIN` | OAuth 2.0 (`w_member_social`) | High-fidelity | End-to-end active via Inngest worker (`api.linkedin.com/rest/posts` + image URN init) | **Fully Implemented** |
| **Instagram** | `INSTAGRAM` | Meta Graph OAuth config | High-fidelity | None (Throws `Unsupported provider type`) | **API-Ready (Needs Meta App Review)** |
| **Facebook** | `FACEBOOK` | Meta Graph OAuth config | High-fidelity | None (Throws `Unsupported provider type`) | **API-Ready (Needs Meta App Review)** |
| **Threads** | `THREADS` | Meta Threads OAuth config | High-fidelity | None (Throws `Unsupported provider type`) | **API-Ready (Needs Meta Approval)** |
| **Bluesky** | `BLUESKY` | AT Protocol OAuth config | High-fidelity | None (Throws `Unsupported provider type`) | **API-Ready (Needs AT Proto worker)** |
| **YouTube** | `YOUTUBE` | Google OAuth 2.0 config | High-fidelity | None (Throws `Unsupported provider type`) | **API-Ready (Needs Google Audit)** |
| **TikTok** | `TIKTOK` | TikTok Creator OAuth config | High-fidelity | None (Throws `Unsupported provider type`) | **API-Ready (Needs TikTok Partner App)** |

> [!IMPORTANT]
> **Engineering Honesty Guideline:** Production documentation and external descriptions must explicitly state that **Twitter/X and LinkedIn** possess full automated execution pipelines, while Instagram, Facebook, Threads, Bluesky, YouTube, and TikTok are **API-Ready & Preview-Engineered**, with Mock OAuth fallback when client secrets are unconfigured.

---

## 3. Architecture Strengths

1. **Robust Token Cryptography:**
   * Uses AES-256-GCM via Node.js native `crypto` with per-encryption random 12-byte initialization vectors (`iv`), authentication tags (`tag`), and SHA-256 key hashing (`lib/encryption.ts`). Encrypted payloads are formatted as `iv.tag.ciphertext` using base64url encoding.
2. **Stateless Signed OAuth State:**
   * OAuth connection state uses HMAC-SHA256 signed payloads containing `userId`, `channelTypeId`, and `exp` expiry timestamps (`lib/social-oauth/state.ts`), mitigating CSRF and connection hijacking.
3. **Decoupled Asynchronous Execution:**
   * Long-running publishing tasks are delegated to Inngest background workers rather than synchronously blocking HTTP request threads.
4. **Modern UI System:**
   * Clean, responsive design built with Tailwind CSS v4 and shadcn/ui, featuring dark mode support without hydration flash, realistic feed simulators, and drag-and-drop Kanban organization.
5. **Next.js 16 Alignment:**
   * Uses the updated `proxy.ts` convention for edge request filtering and Clerk auth protection, correctly following Next.js 16 breaking changes.

---

## 4. Critical Security Risks & Vulnerabilities

### 4.1 Plaintext Token Logging in Standard Output
* **File:** [`lib/social-oauth/index.ts:213`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/lib/social-oauth/index.ts#L213)
* **Vulnerability:** `console.log("refreshing token", type, refreshToken, redirectUri)` logs decrypted OAuth refresh tokens directly to stdout/application logs.
* **Risk Severity:** **CRITICAL**. Any log aggregation tool, hosting platform (Vercel, AWS CloudWatch, Datadog), or compromised server log exposes permanent refresh tokens to unauthorized parties.
* **Remediation:** Remove cleartext credential logging immediately. Replace with structured redacted logs: `logger.info("Refreshing token", { provider: type, hasRefreshToken: Boolean(refreshToken) })`.

### 4.2 Module-Scoped Singleton State Causing Cross-User Token Leaks
* **File:** [`lib/insforge-server.ts:13-15`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/lib/insforge-server.ts#L13-L15)
* **Code:**
  ```typescript
  let cachedClient: InsForgeClient | null = null;
  let cachedUserId: string | null = null;
  let refreshInterval: NodeJS.Timeout | null = null;
  ```
* **Vulnerability:** Node.js modules are cached across requests. In a multi-tenant environment, `cachedClient` and `cachedUserId` are shared across all concurrent requests in the server runtime.
* **Risk Severity:** **CRITICAL**. If User A triggers a request and User B immediately makes a request while `refreshAuthToken` is in flight, User B can execute database queries with User A's token or trigger race conditions where User A's permissions bleed into User B's context. Furthermore, `setInterval` on line 72 creates an uncollected background timer leak in serverless/Node environments.
* **Remediation:** Instantiate scoped clients per request or use `React.cache()` / AsyncLocalStorage. Discard module-level mutable singletons. Remove long-running `setInterval` timers from request execution paths.

### 4.3 Master Key Fallback and RLS Bypass Risk
* **File:** [`lib/insforge-server.ts:38-42`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/lib/insforge-server.ts#L38-L42)
* **Vulnerability:** If the Clerk JWT template `insforge` fails or returns `resource_not_found`, the code falls back to `PROJECT_API_KEY`.
* **Risk Severity:** **HIGH**. In InsForge/PostgreSQL, RLS policies rely on `current_setting('request.jwt.claims', true)::json->>'sub'` via `requesting_user_id()`. When using `PROJECT_API_KEY`, the sub claim is null, which causes RLS policies to either deny legitimate queries or bypass row filters depending on policy definitions.
* **Remediation:** Strictly reject unauthenticated requests when user context is required instead of silently switching to admin privileges.

### 4.4 Unhandled RangeError in OAuth State Signature Verification
* **File:** [`lib/social-oauth/state.ts:37`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/lib/social-oauth/state.ts#L37)
* **Code:**
  ```typescript
  const isValid = timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  ```
* **Vulnerability:** In Node.js `crypto.timingSafeEqual`, if the two buffer arguments have different lengths, the runtime throws `RangeError: The argument 'a' and 'b' must have the same byte length`.
* **Risk Severity:** **MEDIUM**. An attacker passing an arbitrarily truncated or extended state signature causes an unhandled 500 error rather than a clean 400 rejection.
* **Remediation:** Verify that `Buffer.byteLength(signature) === Buffer.byteLength(expectedSignature)` before invoking `timingSafeEqual`.

### 4.5 Build-Time Fatal Exceptions on Unset Secrets
* **Files:** [`lib/encryption.ts:4-6`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/lib/encryption.ts#L4-L6), [`lib/social-oauth/state.ts:5-7`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/lib/social-oauth/state.ts#L5-L7)
* **Vulnerability:** Unconditionally throwing errors at module top-level if `CHANNEL_TOKEN_ENCRYPTION_KEY` or `CHANNEL_OAUTH_STATE_SECRET` are not set causes Next.js production builds (`npm run build`) to crash during static page data collection if environment variables are not injected into the build container.
* **Remediation:** Validate keys lazily upon function invocation or verify via a centralized environment validation schema (e.g. Zod).

---

## 5. Scheduled Publishing & Reliability Risks

### 5.1 10-Minute Polling Inaccuracy
* **File:** [`inngest/functions/publish-scheduled-posts.ts:20`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/inngest/functions/publish-scheduled-posts.ts#L20)
* **Problem:** The cron trigger is configured to `*/10 * * * *` (every 10 minutes).
* **Impact:** Posts scheduled for 10:01 AM may not execute until 10:10 AM, generating an automatic, unmeasured scheduling delay of up to 599 seconds (~10 minutes).
* **Solution:** Upgrade to a 1-minute cron (`* * * * *`) or adopt event-based delayed scheduling (`inngest.send({ name: 'post/publish.requested', data: { postId }, ts: post.scheduled_at })`).

### 5.2 Non-Atomic Fetch & Double-Publishing Race Condition
* **File:** [`inngest/functions/publish-scheduled-posts.ts:26-58`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/inngest/functions/publish-scheduled-posts.ts#L26-L58)
* **Problem:** The cron function performs a non-locking `SELECT` of all posts where `status = 'queue' AND scheduled_at <= now()`. It then emits `post/publish.requested` events without modifying the status of the posts in PostgreSQL.
* **Impact:** If the first cron execution takes longer than expected or if a retry occurs, subsequent cron runs select the exact same posts and emit duplicate `post/publish.requested` events.
* **Solution:** Use PostgreSQL row locking (`SELECT ... FOR UPDATE SKIP LOCKED`) or immediately transition candidate rows from `SCHEDULED` &rarr; `QUEUED` / `PUBLISHING` within an atomic transaction.

### 5.3 Step Retries Cause Duplicate Social Posts (Missing Idempotency Key)
* **File:** [`inngest/functions/publish-scheduled-posts.ts:139-160`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/inngest/functions/publish-scheduled-posts.ts#L139-L160)
* **Problem:** Step `publish-to-ptrovider` performs external HTTP calls to Twitter (`POST https://api.x.com/2/tweets`) and LinkedIn (`POST https://api.linkedin.com/rest/posts`).
  If the network connection times out *after* Twitter has created the tweet but *before* Inngest receives the HTTP 201 response, Inngest's automatic retry policy will re-execute the step and create a duplicate tweet on the user's profile.
* **Impact:** High brand risk for users who find duplicated duplicate tweets or articles on their channels.
* **Solution:**
  1. Record an idempotency key (`post_id + channel + attempt_number`).
  2. For platforms supporting idempotency, pass client request tokens.
  3. Pre-create a publication attempt record in `post_publications` with status `PUBLISHING` and an attempt lock.

### 5.4 Monolithic Post Execution vs. Multi-Channel Orchestration
* **File:** [`lib/db/create-social-scheduling-tables.sql:99`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/lib/db/create-social-scheduling-tables.sql#L99)
* **Problem:** In `scheduled_posts`, each post has a single `user_channel_id uuid references user_channels(id)`. When a user composes a single post for Twitter, LinkedIn, and Instagram simultaneously, the API creates multiple separate rows in `scheduled_posts` or fails to isolate per-channel publishing states.
* **Impact:** If one channel fails (e.g. rate limit on Twitter), there is no centralized parent state tracking which platforms succeeded and which failed.
* **Solution:** Introduce Phase 8 multi-channel orchestration schema with `post_publications` table:
  ```sql
  create table post_publications (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references scheduled_posts(id) on delete cascade,
    user_channel_id uuid not null references user_channels(id),
    channel text not null,
    status text not null default 'QUEUED', -- QUEUED, PUBLISHING, PUBLISHED, FAILED, RETRYING
    external_post_id text,
    published_url text,
    attempt_count integer default 0,
    started_at timestamptz,
    published_at timestamptz,
    error_code text,
    error_message text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );
  ```

### 5.5 Binary Failure Without Error Classification
* **File:** [`inngest/functions/publish-scheduled-posts.ts:168-172`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/inngest/functions/publish-scheduled-posts.ts#L168-L172)
* **Problem:** Any catch block instantly sets `status = 'failed'` and records `error_message`.
* **Impact:** Transient errors (HTTP 429 rate limits, HTTP 503 service unavailable, socket hang-ups) are permanently marked as failed instead of undergoing exponential backoff retries. Conversely, permanent errors (HTTP 401 revoked token, HTTP 400 text character overflow) trigger useless retries.
* **Solution:** Implement an error classifier distinguishing transient vs. permanent failures.

---

## 6. Database Performance & Schema Bottlenecks

### 6.1 Complete Absence of Composite Indexes
The PostgreSQL schema in `lib/db/create-social-scheduling-tables.sql` only defines primary keys and foreign key constraints. No composite or performance indexes exist.

#### Critical Query Patterns Currently Doing Sequential Table Scans:
1. **Dashboard KPI Counts:**
   ```sql
   SELECT count(id) FROM scheduled_posts WHERE user_id = $1 AND status = 'queue';
   ```
   *Current Cost:* Sequential scan over all posts.  
   *Required Index:* `CREATE INDEX idx_scheduled_posts_user_status ON scheduled_posts(user_id, status);`
2. **Inngest Cron Due Posts Fetch:**
   ```sql
   SELECT id, status, scheduled_at FROM scheduled_posts WHERE status = 'queue' AND scheduled_at <= $1 ORDER BY scheduled_at ASC;
   ```
   *Current Cost:* Sequential scan filtering on unindexed status and timestamp.  
   *Required Index:* `CREATE INDEX idx_scheduled_posts_status_scheduled ON scheduled_posts(status, scheduled_at ASC);`
3. **Calendar Date Filtering:**
   ```sql
   SELECT * FROM scheduled_posts WHERE user_id = $1 ORDER BY scheduled_at DESC;
   ```
   *Required Index:* `CREATE INDEX idx_scheduled_posts_user_scheduled ON scheduled_posts(user_id, scheduled_at DESC);`
4. **Kanban Idea Ordering:**
   ```sql
   SELECT * FROM ideas WHERE user_id = $1 ORDER BY sort_order ASC, created_at DESC;
   ```
   *Required Index:* `CREATE INDEX idx_ideas_user_sort ON ideas(user_id, group_id, sort_order ASC);`

### 6.2 4x Redundant Count Roundtrips on Dashboard Polling
* **File:** [`app/api/post/totals/route.ts:25-30`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/app/api/post/totals/route.ts#L25-L30)
* **Problem:** The endpoint fires 4 parallel queries to InsForge PostgreSQL:
  ```typescript
  const [draft, queue, published, failed] = await Promise.all([
    countQuery("draft"),
    countQuery("queue"),
    countQuery("published"),
    countQuery("failed"),
  ]);
  ```
* **Impact:** Triples database connection utilization and latency. With 100 active browser tabs polling every 30 seconds, this generates 800 queries/minute for totals alone.
* **Solution:** Single aggregation query:
  ```sql
  SELECT status, count(*) as count 
  FROM scheduled_posts 
  WHERE user_id = $1 
  GROUP BY status;
  ```

### 6.3 Array-Wrapping Insert Syntax Bug
* **File:** [`app/api/post/route.ts:171`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/app/api/post/route.ts#L171)
* **Code:**
  ```typescript
  const payload = normalizedPosts.map((post) => ({ ... }));
  const { data, error } = await insforge.database
    .from("scheduled_posts")
    .insert([payload]) // BUG: payload is already an array, passing [[...]]
    .select();
  ```
* **Impact:** Passes a 2-dimensional array to the InsForge database driver, which risks silent schema validation failures or unexpected array coercion depending on SDK version.
* **Solution:** Change `.insert([payload])` to `.insert(payload)`.

### 6.4 Schema Discrepancy in `idea_groups`
* **Files:** [`lib/db/create-social-scheduling-tables.sql:62-73`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/lib/db/create-social-scheduling-tables.sql#L62-L73) vs [`app/api/idea/route.ts:34`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/app/api/idea/route.ts#L34)
* **Problem:** In SQL, `idea_groups` is defined with columns `(id, name, created_at)` and a global `UNIQUE (name)`. However, `app/api/idea/route.ts` attempts to query `.eq("user_id", userId)` and insert `{ user_id: userId, name: "Ideas" }`.
* **Impact:** Fails if `user_id` column does not exist or triggers a uniqueness collision if multiple users create a group with the same name.
* **Solution:** Create explicit migration adding `user_id text` to `idea_groups` and adjust unique constraint to `UNIQUE (user_id, name)`.

---

## 7. Frontend & Caching Deficits

### 7.1 Duplicate Route Hierarchy
* **Locations:** `app/routes/` and `app/(dashboard)/`
* **Problem:** The codebase contains duplicate route structures:
  * `app/routes/dashboard/schedule/page.tsx`
  * `app/(dashboard)/schedule/page.tsx` (containing `export { default } from "@/app/routes/dashboard/schedule/page";`)
* **Impact:** Confuses build tooling, causes redundant code paths, and complicates routing maintenance.

### 7.2 Aggressive Client Polling Without Server Caching
* **File:** [`app/(dashboard)/dashboard/page.tsx:53,64`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/app/%28dashboard%29/dashboard/page.tsx#L53)
* **Problem:** TanStack Query triggers auto-refetching every 30,000ms (`refetchInterval: 30000`) for both `/api/post/totals` and `/api/post?status=queue`.
* **Impact:** Continuous backend load even if the user is idle or in background tabs, with 0% cache hits because no Redis or edge cache headers exist.
* **Solution:** Implement Redis cache-aside for user KPI totals with instant invalidation on post create/update/delete.

### 7.3 Synthetic Metrics on Analytics Page
* **File:** [`app/(dashboard)/analytics/page.tsx:48-50`](file:///c:/Users/sugud/OneDrive/Documents/media-scheduler/app/%28dashboard%29/analytics/page.tsx#L48-L50)
* **Problem:** Hardcoded multipliers simulate user reach and engagement:
  ```typescript
  const estimatedReach = publishedCount * 1420;
  const estimatedEngagements = Math.round(estimatedReach * 0.048);
  ```
* **Solution:** Clearly display these numbers under a banner marked **"Estimated Modeling"** rather than claiming real API metric ingestion.

---

## 8. Testing & Observability Deficits

1. **Zero Automated Tests:**
   * Unit tests: 0
   * Integration tests: 0
   * End-to-end (E2E) tests: 0
   * Load test scripts: 0
2. **Minimal Health Check:**
   * `/api/health` returns `{ status: "ok", uptime }` statically without testing database connectivity or background worker health. No `/api/health/ready` endpoint exists.
3. **No Request Tracing:**
   * No correlation ID (`x-request-id`) across client requests, API routes, database queries, and Inngest events.

---

## 9. Recommended Architecture Roadmap & Priority Ranking

We rank improvements by technical necessity, prioritizing **publishing reliability, security, and measurable performance**:

| Priority | Phase | Work Area | Target Deliverable | Expected Impact |
| :---: | :---: | :--- | :--- | :--- |
| **P0** | **Phase 0** | **Architecture Audit** | `docs/ARCHITECTURE_AUDIT.md` | Establish baseline ground truth & plan |
| **P0** | **Phase 1** | **Baseline Benchmarking** | `performance/BASELINE.md` | Accurate p50/p95/RPS numbers before code changes |
| **P0** | **Phase 2** | **Database Indexes & Optimization** | Migration SQL + `EXPLAIN ANALYZE` benchmarks | Eliminate sequential scans; drop query latency |
| **P0** | **Phase 3** | **Publishing State Machine** | 8-state model (`DRAFT` &rarr; `SCHEDULED` &rarr; `QUEUED` &rarr; `PUBLISHING` &rarr; `PUBLISHED`) | Prevent invalid transitions & orphaned jobs |
| **P0** | **Phase 4** | **Idempotent Publishing** | Distributed execution locks & deduplication keys | Guarantee zero duplicate social posts |
| **P1** | **Phase 5** | **Scheduling Accuracy Tracking** | Precision telemetry (`delay = actual - scheduled`) | Measure real p95/p99 execution delay in ms |
| **P1** | **Phase 6** | **Redis Caching** | Cache-aside for dashboard totals, channels, posts | 80%+ cache hit rate; drop p95 API latency |
| **P1** | **Phase 7** | **Rate Limiting & API Resilience** | Platform client abstraction with exponential backoff & 429 support | Prevent social API bans; gracefully handle outages |
| **P1** | **Phase 8** | **Multi-Channel Orchestration** | `post_publications` schema & per-channel tracking | One post targets multiple platforms with isolated states |
| **P1** | **Phase 9** | **Background Job Observability** | Structured logging, latency metrics, `docs/BACKGROUND_JOBS.md` | Real execution telemetry for background workers |
| **P2** | **Phase 11-12** | **Security Hardening & User Isolation** | Token redaction, scoped clients, IDOR security tests | Complete tenant isolation & OWASP hardening |
| **P2** | **Phase 13-14** | **Automated Testing & Load Testing** | Vitest suite, Playwright E2E, k6 load test scenarios | Verified test coverage & concurrency proof |
| **P2** | **Phase 19-20** | **Observability & Health Checks** | Deep `/api/health` + `/api/health/ready` | Production readiness monitoring |
| **P3** | **Phase 24-26** | **Performance Report & Resume Metrics** | `PERFORMANCE_REPORT.md`, `RESUME_METRICS.md`, accurate README | 100% verified, defensible resume bullets |

---

## 10. Immediate Next Step

With **Phase 0** completed, the system is ready for **Phase 1: Baseline Benchmark Suite**.  
We will establish a reproducible benchmark script under `performance/baseline/`, measure the existing unoptimized system under realistic payloads, and record honest baseline metrics in `performance/BASELINE.md`.
