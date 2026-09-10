# Media Scheduler — Baseline Performance Benchmark (Phase 1)

**Execution Timestamp:** 2026-09-09T20:01:53.647Z  
**Target Environment:** Local Node.js / Next.js 16.2.9 (App Router), React 19.2.4  
**Benchmark Harness:** `performance/baseline/benchmark-runner.ts` (Native `fetch`, high-resolution `performance.now()`)  
**Concurrency Level:** 5 concurrent client workers  
**Sample Size:** 30 requests per endpoint (570 total benchmark requests across 19 endpoints)  
**Total Benchmark Duration:** 117.66 seconds  

---

## 1. Executive Summary

This document establishes the **unoptimized baseline performance measurements** of Media Scheduler prior to any indexing, state machine refactoring, caching, or rate-limiting enhancements.

### Defensible Engineering Rules Applied:
* **ZERO INVENTED NUMBERS:** Every millisecond, RPS, and error percentage in this report was recorded directly by `performance/baseline/benchmark-runner.ts` against the live running server.
* **Unmeasured Metrics:** Any metric not directly measured in this baseline phase is explicitly marked `TBD — requires benchmark`.

---

## 2. Baseline API Benchmark Matrix

| Endpoint | Method | Status Codes | Req Count | Error Rate | Throughput (RPS) | p50 Latency (ms) | p95 Latency (ms) | p99 Latency (ms) | Avg Latency (ms) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `/api/health` | GET | 200 (30) | 30 | 0.0% | 3.5 | 1,302.05 | 2,477.16 | 2,496.94 | 1,351.93 |
| `/api/posts` (Plural) | GET | 200 (30) | 30 | 0.0% | 10.5 | 411.89 | 605.36 | 607.12 | 444.70 |
| `/api/post` (Singular) | GET | 200 (30) | 30 | 0.0% | 12.3 | 355.92 | 545.68 | 549.02 | 394.01 |
| `/api/post/totals` | GET | 200 (30) | 30 | 0.0% | 10.5 | 400.00 | 753.40 | 764.87 | 458.61 |
| `/api/post` (Create) | POST | 200 (30) | 30 | 0.0% | 13.1 | 351.12 | 453.12 | 457.76 | 349.97 |
| `/api/post/:id` | GET | 200 (30) | 30 | 0.0% | 5.9 | 460.08 | 1,511.33 | 1,515.86 | 777.84 |
| `/api/post/:id` | PATCH | 200 (30) | 30 | 0.0% | 8.8 | 418.76 | 1,161.78 | 1,182.83 | 534.36 |
| `/api/post/:id` | DELETE | 200 (30) | 30 | 0.0% | 3.7 | 1,324.64 | 1,384.92 | 1,399.42 | 1,280.95 |
| `/api/ideas` (Plural) | GET | 200 (30) | 30 | 0.0% | 3.7 | 1,335.48 | 1,490.76 | 1,492.62 | 1,297.72 |
| `/api/idea` (Singular) | GET | 200 (30) | 30 | 0.0% | 3.7 | 1,273.41 | 1,445.66 | 1,447.72 | 1,261.15 |
| `/api/idea` (Create) | POST | 200 (30) | 30 | 0.0% | 3.7 | 1,290.42 | 1,559.47 | 1,576.01 | 1,316.20 |
| `/api/idea/:id` | PATCH | 200 (30) | 30 | 0.0% | 3.9 | 1,231.84 | 1,300.08 | 1,301.32 | 1,216.92 |
| `/api/channels` (Plural) | GET | 200 (30) | 30 | 0.0% | 3.8 | 1,337.13 | 1,368.40 | 1,371.23 | 1,303.90 |
| `/api/channel` (Singular) | GET | 200 (30) | 30 | 0.0% | 3.8 | 1,211.26 | 1,377.63 | 1,381.30 | 1,230.91 |
| `/api/channel/connect` | POST | 200 (30) | 30 | 0.0% | 4.0 | 1,201.19 | 1,349.67 | 1,368.88 | 1,193.06 |
| `/api/channel/callback` | GET | 200 (30) | 30 | 0.0% | 3.6 | 1,316.18 | 1,587.70 | 1,601.86 | 1,303.18 |
| `/api/generate-ideas` | POST | 200 (30) | 30 | 0.0% | 2.8 | 1,284.64 | 3,832.16 | 3,847.04 | 1,736.62 |
| `/api/idea/generate-ideas` | POST | 200 (30) | 30 | 0.0% | 4.2 | 1,189.73 | 1,385.66 | 1,387.63 | 1,145.54 |
| `/api/inngest` | POST | 500 (30) | 30 | **100.0%** | 47.3 | 78.86 | 127.31 | 141.50 | 82.07 |

---

## 3. Key Baseline Insights & Bottlenecks

### 3.1 Unprotected Edge Latency and Clerk Middleware Interception
* Endpoints routed through the App Router edge middleware (`proxy.ts`) incur substantial latency overhead (p95 ranging from 1,200 ms to 2,477 ms).
* `/api/health` was intercepted by `proxy.ts` because it was omitted from the `isPublicRoute` matcher array, incurring a 2,477.16 ms p95 delay instead of sub-10ms raw health responses.
* **Target Optimization for Phase 20:** Exempt lightweight health checks from session parsing in `proxy.ts` to reduce healthcheck p95 from ~2,400 ms to < 15 ms.

### 3.2 Inngest Webhook Baseline Status
* `POST /api/inngest` baseline yielded a **100% error rate (HTTP 500 `internal_server_error`)** when receiving raw HTTP requests without Inngest dev server / cloud signing signatures.
* Execution throughput was 47.3 RPS with p95 latency of 127.31 ms for rejection.

### 3.3 Heavy AI Ideas Route Variance
* `/api/generate-ideas` demonstrated high latency variance: min of 963.47 ms up to a maximum of 3,847.04 ms (p95 of 3,832.16 ms) with throughput throttled to 2.8 RPS.
* Under concurrency of 5 workers, the unbuffered direct API calls generate significant queue delay.

### 3.4 Database Query Baseline
* `/api/post/totals` currently records an average latency of 458.61 ms and p95 of 753.40 ms under 5 concurrent users due to the 4x unindexed count queries.
* **Benchmark Target for Phase 2 & 6:** Replace 4x count queries with single-query aggregation and Redis cache-aside to drop p95 below 50 ms.

---

## 4. Unmeasured Metrics Tracking

Per strict engineering standards, the following metrics require subsequent phase test harnesses:

* **PostgreSQL Query EXPLAIN ANALYZE Latency:** `TBD — requires benchmark` (Phase 2)
* **Redis Cache Hit Rate:** `TBD — requires benchmark` (Phase 6)
* **Scheduling Delay (Actual vs. Scheduled ms):** `TBD — requires benchmark` (Phase 5)
* **High Concurrency Load Resilience (50 - 500 users):** `TBD — requires benchmark` (Phase 14)
* **E2E Automated Test Pass Rate:** `TBD — requires benchmark` (Phase 13)

---

## 5. Next Steps

With Phase 1 complete and the baseline metrics committed:
Proceed to **Phase 2 — Database Performance & Query Optimization**:
1. Execute `EXPLAIN ANALYZE` on posts, ideas, and channels query patterns.
2. Formulate and apply targeted PostgreSQL indexes.
3. Fix the array-in-array insert bug in `/api/post`.
4. Combine the 4x count queries in `/api/post/totals` into a single SQL aggregation.
5. Re-run benchmarks and measure query latency reduction.
