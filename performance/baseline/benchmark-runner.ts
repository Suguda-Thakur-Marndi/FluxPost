/**
 * Reproducible Baseline Benchmark Suite for Media Scheduler
 * 
 * Measures:
 * - p50, p90, p95, p99 latency
 * - Throughput (req/sec)
 * - Error rate (%)
 * - HTTP status distribution
 * 
 * Across both baseline routes (singular/unauthenticated) and requested endpoints.
 */

interface BenchmarkConfig {
  baseUrl: string;
  concurrency: number;
  totalRequestsPerEndpoint: number;
}

export interface RequestResult {
  endpoint: string;
  method: string;
  status: number;
  durationMs: number;
  ok: boolean;
  error?: string;
}

interface EndpointSummary {
  endpoint: string;
  method: string;
  totalRequests: number;
  successCount: number;
  errorCount: number;
  errorRatePercent: number;
  throughputRps: number;
  minMs: number;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  maxMs: number;
  avgMs: number;
  statusCodes: Record<number, number>;
  notes: string;
}

interface BenchmarkSuiteResult {
  timestamp: string;
  config: BenchmarkConfig;
  overallDurationMs: number;
  endpoints: EndpointSummary[];
}

const CONFIG: BenchmarkConfig = {
  baseUrl: process.env.BENCHMARK_BASE_URL || "http://localhost:3000",
  concurrency: 5,
  totalRequestsPerEndpoint: 30, // Representative sample per endpoint for baseline
};

const BENCHMARK_CASES = [
  // Health checks
  {
    name: "Health Endpoint",
    method: "GET",
    path: "/api/health",
    body: null,
    notes: "Lightweight uptime check; tests middleware protection",
  },
  // Posts endpoints (Plural vs Singular)
  {
    name: "GET /api/posts (Plural)",
    method: "GET",
    path: "/api/posts",
    body: null,
    notes: "Plural REST route check",
  },
  {
    name: "GET /api/post (Singular)",
    method: "GET",
    path: "/api/post",
    body: null,
    notes: "Existing post list route",
  },
  {
    name: "GET /api/post/totals",
    method: "GET",
    path: "/api/post/totals",
    body: null,
    notes: "Dashboard 4x count queries route",
  },
  {
    name: "POST /api/post (Create Post)",
    method: "POST",
    path: "/api/post",
    body: {
      posts: [
        {
          channelTypeId: "00000000-0000-0000-0000-000000000001",
          content: "🚀 Launching our automated social scheduler benchmark suite! Testing throughput and p95 latency.",
          images: []
        }
      ],
      scheduledAt: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
      status: "draft"
    },
    notes: "Post creation with realistic multi-channel draft payload",
  },
  {
    name: "GET /api/post/test-id-123",
    method: "GET",
    path: "/api/post/test-id-123",
    body: null,
    notes: "Single post retrieval",
  },
  {
    name: "PATCH /api/post/test-id-123",
    method: "PATCH",
    path: "/api/post/test-id-123",
    body: {
      content: "Updated draft content for scheduled delivery benchmark",
      status: "draft"
    },
    notes: "Single post update",
  },
  {
    name: "DELETE /api/post/test-id-123",
    method: "DELETE",
    path: "/api/post/test-id-123",
    body: null,
    notes: "Single post deletion",
  },
  // Ideas endpoints
  {
    name: "GET /api/ideas (Plural)",
    method: "GET",
    path: "/api/ideas",
    body: null,
    notes: "Plural ideas route check",
  },
  {
    name: "GET /api/idea (Singular)",
    method: "GET",
    path: "/api/idea",
    body: null,
    notes: "Existing idea list & groups route",
  },
  {
    name: "POST /api/idea (Create Idea)",
    method: "POST",
    path: "/api/idea",
    body: {
      title: "10 Proven Distributed Systems Architecture Patterns for SaaS",
      description: "Deep dive into idempotent consumers, outbox patterns, and read-side caching with Redis.",
      images: [],
      sortOrder: 1
    },
    notes: "Idea creation payload",
  },
  {
    name: "PATCH /api/idea/test-idea-123",
    method: "PATCH",
    path: "/api/idea/test-idea-123",
    body: {
      title: "Updated Idea Title"
    },
    notes: "Idea update route check",
  },
  // Channels & OAuth endpoints
  {
    name: "GET /api/channels (Plural)",
    method: "GET",
    path: "/api/channels",
    body: null,
    notes: "Plural channels route check",
  },
  {
    name: "GET /api/channel (Singular)",
    method: "GET",
    path: "/api/channel",
    body: null,
    notes: "Existing channel status list",
  },
  {
    name: "POST /api/channel/connect",
    method: "POST",
    path: "/api/channel/connect",
    body: {
      channelTypeId: "00000000-0000-0000-0000-000000000001"
    },
    notes: "OAuth URL initiation endpoint",
  },
  {
    name: "GET /api/channel/callback (Missing State)",
    method: "GET",
    path: "/api/channel/callback",
    body: null,
    notes: "OAuth callback verification & error redirection",
  },
  // AI Generation
  {
    name: "POST /api/generate-ideas (Root)",
    method: "POST",
    path: "/api/generate-ideas",
    body: {
      businessType: "Developer Tooling",
      targetAudience: "Software Engineers"
    },
    notes: "Top-level AI ideas route check",
  },
  {
    name: "POST /api/idea/generate-ideas",
    method: "POST",
    path: "/api/idea/generate-ideas",
    body: {
      businessType: "B2B SaaS Analytics",
      targetAudience: "Growth Marketers and Founders"
    },
    notes: "AI brainstorming generation route",
  },
  // Inngest Background Webhook
  {
    name: "POST /api/inngest",
    method: "POST",
    path: "/api/inngest",
    body: {
      event: "test/benchmark.ping"
    },
    notes: "Inngest job execution webhook endpoint",
  }
];

function calculatePercentile(sortedValues: number[], percentile: number): number {
  if (sortedValues.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
  return Number(sortedValues[Math.max(0, Math.min(index, sortedValues.length - 1))].toFixed(2));
}

async function runWorker(
  items: typeof BENCHMARK_CASES[number][],
  baseUrl: string,
  totalRequests: number,
  concurrency: number
): Promise<EndpointSummary[]> {
  const summaries: EndpointSummary[] = [];

  for (const testCase of items) {
    const url = `${baseUrl}${testCase.path}`;
    const durations: number[] = [];
    const statusCodes: Record<number, number> = {};
    let errorCount = 0;
    let successCount = 0;

    const startTime = performance.now();

    // Run pool of requests with controlled concurrency
    const executeRequest = async () => {
      const t0 = performance.now();
      try {
        const res = await fetch(url, {
          method: testCase.method,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "MediaScheduler-BaselineBenchmark/1.0",
          },
          body: testCase.body ? JSON.stringify(testCase.body) : undefined,
        });
        const duration = performance.now() - t0;
        durations.push(duration);
        statusCodes[res.status] = (statusCodes[res.status] || 0) + 1;
        if (res.status >= 200 && res.status < 400) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch {
        const duration = performance.now() - t0;
        durations.push(duration);
        statusCodes[0] = (statusCodes[0] || 0) + 1;
        errorCount++;
      }
    };

    // Run requests in batches up to totalRequests
    for (let i = 0; i < totalRequests; i += concurrency) {
      const batchSize = Math.min(concurrency, totalRequests - i);
      const promises = Array.from({ length: batchSize }, () => executeRequest());
      await Promise.all(promises);
    }

    const totalDurationMs = performance.now() - startTime;
    durations.sort((a, b) => a - b);

    const sum = durations.reduce((acc, val) => acc + val, 0);
    const avg = durations.length ? sum / durations.length : 0;
    const throughput = totalDurationMs > 0 ? (totalRequests / (totalDurationMs / 1000)) : 0;

    summaries.push({
      endpoint: testCase.path,
      method: testCase.method,
      totalRequests,
      successCount,
      errorCount,
      errorRatePercent: Number(((errorCount / totalRequests) * 100).toFixed(1)),
      throughputRps: Number(throughput.toFixed(1)),
      minMs: Number((durations[0] || 0).toFixed(2)),
      p50Ms: calculatePercentile(durations, 50),
      p90Ms: calculatePercentile(durations, 90),
      p95Ms: calculatePercentile(durations, 95),
      p99Ms: calculatePercentile(durations, 99),
      maxMs: Number((durations[durations.length - 1] || 0).toFixed(2)),
      avgMs: Number(avg.toFixed(2)),
      statusCodes,
      notes: testCase.notes,
    });
  }

  return summaries;
}

async function main() {
  console.log("=================================================================");
  console.log("   MEDIA SCHEDULER 2.0 — BASELINE PERFORMANCE BENCHMARK RUNNER   ");
  console.log("=================================================================");
  console.log(`Target URL:    ${CONFIG.baseUrl}`);
  console.log(`Concurrency:   ${CONFIG.concurrency} concurrent workers`);
  console.log(`Per-Endpoint:  ${CONFIG.totalRequestsPerEndpoint} requests`);
  console.log(`Endpoints:     ${BENCHMARK_CASES.length} test configurations`);
  console.log("=================================================================\n");

  const overallStart = performance.now();
  const summaries = await runWorker(
    BENCHMARK_CASES,
    CONFIG.baseUrl,
    CONFIG.totalRequestsPerEndpoint,
    CONFIG.concurrency
  );
  const overallDurationMs = performance.now() - overallStart;

  const result: BenchmarkSuiteResult = {
    timestamp: new Date().toISOString(),
    config: CONFIG,
    overallDurationMs: Number(overallDurationMs.toFixed(2)),
    endpoints: summaries,
  };

  // Output as JSON for automated persistence
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
