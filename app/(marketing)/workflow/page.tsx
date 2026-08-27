"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Pencil,
  Sparkles,
  Zap,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const workflowSteps = [
  {
    step: "01",
    icon: Pencil,
    title: "Capture & Ideate with AI",
    subtitle: "Turn sudden sparks into structured content ideas.",
    description:
      "Jot down raw thoughts on your Idea Kanban board or use our AI Generator to spark dozens of creative post concepts, hooks, and topic angles instantly.",
    color: "from-purple-500/20 to-indigo-500/10",
    borderColor: "border-purple-500/30",
    badge: "Step 1: Ideation",
    tips: [
      "Categorize ideas across Unassigned, To Do, and In Progress columns",
      "Attach reference images and links to your idea cards",
      "One-click convert any idea into a scheduled post draft",
    ],
  },
  {
    step: "02",
    icon: Zap,
    title: "Draft & Adapt for Each Channel",
    subtitle: "One central message tailored to 7+ networks.",
    description:
      "Lemon.ai lets you write once and customize variations for Twitter's brevity, LinkedIn's professional storytelling, Instagram's hashtags, or Threads discussions.",
    color: "from-sky-500/20 to-cyan-500/10",
    borderColor: "border-sky-500/30",
    badge: "Step 2: Customization",
    tips: [
      "Real-time live mockup previews for every platform",
      "Platform-specific character limit counter & validation",
      "Drag-and-drop image carousel upload & ordering",
    ],
  },
  {
    step: "03",
    icon: Calendar,
    title: "Schedule on Visual Calendar",
    subtitle: "Drag, drop, and organize your publishing pipeline.",
    description:
      "Place your drafts onto your interactive calendar. Visually plan your entire publishing calendar for days, weeks, or months ahead with zero guesswork.",
    color: "from-emerald-500/20 to-teal-500/10",
    borderColor: "border-emerald-500/30",
    badge: "Step 3: Planning",
    tips: [
      "Toggle seamlessly between Calendar and List schedule views",
      "Drag & drop posts across dates and time slots",
      "Visual channel badges to balance your multi-platform mix",
    ],
  },
  {
    step: "04",
    icon: Send,
    title: "Automated & Reliable Publishing",
    subtitle: "Sit back and watch your content publish automatically.",
    description:
      "Our backend powered by Inngest executes precision background publishing. Your access tokens are refreshed automatically, and posts are sent out directly via official APIs.",
    color: "from-amber-500/20 to-orange-500/10",
    borderColor: "border-amber-500/30",
    badge: "Step 4: Execution",
    tips: [
      "Zero server downtime or manual intervention needed",
      "Live status badges: Draft, In Queue, Published, Failed",
      "Direct link back to your live published post for easy tracking",
    ],
  },
];

export default function WorkflowPage() {
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
          <span className="text-foreground/80">Streamlined Creator Workflow</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
        >
          From spark to published in <span className="text-gradient">4 simple steps</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-muted-foreground font-medium leading-relaxed"
        >
          See how Lemon.ai eliminates social media overwhelm and gives you a seamless, automated publishing pipeline.
        </motion.p>
      </div>

      {/* ── Timeline Steps ────────────────────────────────── */}
      <div className="space-y-12">
        {workflowSteps.map((step, idx) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
            className={`flex flex-col lg:flex-row items-center gap-8 rounded-[2.5rem] border ${step.borderColor} bg-gradient-to-br ${step.color} p-8 sm:p-12 glass-card shadow-2xl backdrop-blur-2xl`}
          >
            {/* Left Column: Number & Icon */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">
              <div className="size-20 rounded-[1.75rem] bg-background/90 border border-white/20 flex items-center justify-center shadow-xl mb-4 relative">
                <step.icon className="size-10 text-primary" />
                <span className="absolute -top-3 -right-3 size-8 rounded-full bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-lg">
                  {step.step}
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {step.badge}
              </span>
            </div>

            {/* Middle Column: Details */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm font-semibold text-primary/90 mb-4">{step.subtitle}</p>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-6">
                {step.description}
              </p>

              <div className="grid sm:grid-cols-3 gap-3">
                {step.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 bg-background/50 rounded-xl p-3 border border-white/10 text-xs text-muted-foreground font-medium">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Bottom CTA ────────────────────────────────────── */}
      <div className="mt-20 text-center">
        <Button asChild size="lg" className="rounded-full px-10 h-14 font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40">
          <Link href="/sign-up">
            Try the Workflow for Free
            <ArrowRight className="ml-2 size-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
