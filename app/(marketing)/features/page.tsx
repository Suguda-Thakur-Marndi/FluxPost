"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Zap,
  BarChart3,
  Globe2,
  Pencil,
  Check,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    accent: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/30",
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
    accent: "from-sky-500/20 to-cyan-500/10",
    border: "border-sky-500/30",
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
    accent: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
  },
  {
    icon: Globe2,
    badge: "Multi-Platform",
    title: "Live Social Post Previews",
    description:
      "Preview exactly how your posts and image carousels will appear on X, LinkedIn, Instagram, Facebook, Threads, YouTube, and Bluesky before publishing.",
    details: [
      "Pixel-perfect real-time mockups for 7+ channels",
      "Multi-image carousel preview and aspect ratio testing",
      "Character count meter tailored to each social network",
    ],
    accent: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
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
    accent: "from-rose-500/20 to-red-500/10",
    border: "border-rose-500/30",
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
    accent: "from-blue-500/20 to-violet-500/10",
    border: "border-blue-500/30",
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full glass-card px-5 py-2 text-sm font-medium border border-border/60 mb-6"
        >
          <Sparkles className="size-4 text-primary animate-pulse" />
          <span className="text-foreground/80">Everything you need to grow your audience</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
        >
          Supercharged features for <span className="text-gradient">modern creators</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-muted-foreground font-medium leading-relaxed"
        >
          Discover all the tools built into Lemon.ai to streamline your content creation, cross-platform scheduling, and social media presence.
        </motion.p>
      </div>

      {/* ── Feature Cards Grid ────────────────────────────── */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
            className={`flex flex-col justify-between rounded-[2rem] border ${feature.border} bg-gradient-to-br ${feature.accent} p-8 glass-card shadow-xl backdrop-blur-xl transition-all`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="size-14 rounded-2xl bg-background/80 border border-white/20 flex items-center justify-center shadow-md">
                  <feature.icon className="size-7 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {feature.badge}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
                {feature.description}
              </p>
            </div>

            <div className="pt-6 border-t border-border/30">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/80 mb-3">Highlights:</p>
              <ul className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground font-medium">
                    <Check className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-24 rounded-[2.5rem] glass-card p-12 text-center border-primary/30 relative overflow-hidden bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 shadow-2xl"
      >
        <h2 className="text-3xl sm:text-5xl font-black text-foreground mb-4">
          Ready to supercharge your social workflow?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-base font-medium">
          Start scheduling to all 7+ social platforms with AI assistance today. No credit card required.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full px-8 h-14 font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40">
            <Link href="/sign-up">
              Get Started for Free
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 font-semibold border-border/60">
            <Link href="/pricing">View Pricing Plans</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
