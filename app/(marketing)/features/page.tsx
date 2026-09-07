"use client";

import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Zap,
  Globe2,
  Check,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    badge: "AI Powered",
    title: "Smart Content Generation",
    description:
      "Transform simple prompts or raw thoughts into platform-optimized drafts, hashtags, hooks, and variations with one click.",
    details: [
      "Platform-specific tone matching (Twitter vs LinkedIn vs Instagram)",
      "Automated viral hook generation and hashtag recommendations",
      "Character limit adherence and instant multi-variant creation",
    ],
  },
  {
    icon: Calendar,
    badge: "Scheduling",
    title: "Visual Calendar & List Orchestrator",
    description:
      "Plan weeks or months in advance with an intuitive drag-and-drop calendar view. Inspect and reschedule your entire publishing pipeline effortlessly.",
    details: [
      "Month, week, and compact list schedule views",
      "Instant queue vs scheduled time slots",
      "Timezone-aware automatic posting engine with Inngest",
    ],
  },
  {
    icon: Layers,
    badge: "Organization",
    title: "Ideation & Kanban Board",
    description:
      "Capture inspiration on the fly and nurture raw ideas from unassigned notes through To-Do, In-Progress, to Scheduled drafts.",
    details: [
      "Interactive drag-and-drop Kanban columns",
      "Quick idea drawer with multi-image attachment support",
      "One-click 'Turn to Scheduled Post' workflow",
    ],
  },
  {
    icon: Globe2,
    badge: "Multi-Platform",
    title: "Live Social Post Previews",
    description:
      "Preview exactly how your posts and image carousels will appear on X, LinkedIn, Instagram, Facebook, Threads, YouTube, Bluesky, and TikTok before publishing.",
    details: [
      "Pixel-perfect real-time mockups for 8 channels",
      "Multi-image carousel preview and aspect ratio testing",
      "Character count meter tailored to each social network",
    ],
  },
  {
    icon: Shield,
    badge: "Security",
    title: "Encrypted OAuth & Token Lifecycle",
    description:
      "Connect your social accounts securely with automated token refresh, AES-256 encryption, and PKCE-protected authentication flows.",
    details: [
      "AES-256 encrypted access & refresh token storage",
      "Automatic background token refresh prior to publishing",
      "Seamless OAuth 2.0 PKCE flow for X (Twitter) & LinkedIn",
    ],
  },
  {
    icon: Zap,
    badge: "Automation",
    title: "Reliable Background Publishing",
    description:
      "Powered by Inngest serverless cron triggers to guarantee your posts go live at the exact second you intended, even if you are offline.",
    details: [
      "Automatic retry with exponential backoff on API rate limits",
      "Detailed failure logging and status indicators",
      "Zero server maintenance required",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold rounded-full border-border bg-card">
          Platform Capabilities
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Engineered for serious social publishing.
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
          Explore the core feature set built into Media Scheduler to eliminate context switching and streamline multi-platform distribution.
        </p>
      </div>

      {/* ── Feature Cards Grid ────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="surface-card flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
          >
            <CardContent className="p-6 sm:p-7 space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold border-border">
                    {feature.badge}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Highlights:
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Bottom CTA ────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-card p-8 md:p-12 text-center space-y-5 shadow-2xs">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Ready to experience frictionless social management?
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Start scheduling to all 8 social networks with AI assistance today. Free forever tier available.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="default" className="h-10 px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-xs">
            <Link href="/sign-up">
              Get Started for Free
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="default" className="h-10 px-6 font-semibold border-border rounded-lg">
            <Link href="/pricing">View All Plans</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
