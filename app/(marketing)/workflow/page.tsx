"use client";

import Link from "next/link";
import {
  Pencil,
  Zap,
  Send,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const workflowSteps = [
  {
    step: "01",
    icon: Pencil,
    title: "Capture & Ideate with AI",
    subtitle: "Turn sudden sparks into structured content drafts.",
    description:
      "Jot down raw thoughts on your Kanban board or use our contextual AI generator to craft creative post hooks, angles, and full captions instantly.",
    badge: "Step 1: Ideation",
    tips: [
      "Categorize ideas across custom status columns",
      "Attach media references and links to idea cards",
      "One-click convert any idea into a scheduled post",
    ],
  },
  {
    step: "02",
    icon: Zap,
    title: "Draft & Adapt for Each Channel",
    subtitle: "One central message tailored to 8 networks.",
    description:
      "Write once and customize variations for Twitter's brevity, LinkedIn's professional narrative, Instagram's carousel style, or TikTok's punchy format.",
    badge: "Step 2: Customization",
    tips: [
      "Realistic live mockup previews for every platform",
      "Per-platform character limit validation",
      "Image carousel upload and ordering",
    ],
  },
  {
    step: "03",
    icon: Calendar,
    title: "Schedule on Visual Calendar",
    subtitle: "Drag, drop, and organize your publishing pipeline.",
    description:
      "Place your drafts onto your interactive calendar. Visually plan your entire publishing schedule for days, weeks, or months ahead with zero guesswork.",
    badge: "Step 3: Planning",
    tips: [
      "Toggle seamlessly between Month, Week, and List views",
      "Drag & drop posts across dates and time slots",
      "Visual channel indicators to balance your content mix",
    ],
  },
  {
    step: "04",
    icon: Send,
    title: "Automated & Reliable Publishing",
    subtitle: "Sit back and watch your content publish automatically.",
    description:
      "Our background publishing engine powered by Inngest executes precision delivery. Tokens are refreshed automatically, and posts deploy via official APIs.",
    badge: "Step 4: Execution",
    tips: [
      "Zero server downtime or manual intervention required",
      "Live status updates: Draft, In Queue, Published, Failed",
      "Direct link back to your live published post",
    ],
  },
];

export default function WorkflowPage() {
  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold rounded-full border-border bg-card">
          Streamlined Creator Workflow
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
          From initial spark to published in 4 steps.
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
          See how Media Scheduler eliminates social media fatigue and delivers a reliable, automated publishing pipeline.
        </p>
      </div>

      {/* ── Timeline Steps ────────────────────────────────── */}
      <div className="space-y-6">
        {workflowSteps.map((step) => (
          <Card
            key={step.step}
            className="surface-card p-6 sm:p-8 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
          >
            <CardContent className="p-0 flex flex-col md:flex-row items-start gap-6">
              {/* Step indicator */}
              <div className="flex md:flex-col items-center gap-3 shrink-0">
                <div className="size-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative shadow-xs">
                  <step.icon className="size-7" />
                  <span className="absolute -top-2 -right-2 size-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-xs">
                    {step.step}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] font-semibold border-border">
                  {step.badge}
                </Badge>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-xs font-semibold text-primary mt-0.5">{step.subtitle}</p>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                <div className="grid sm:grid-cols-3 gap-2.5 pt-3 border-t border-border/60">
                  {step.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg bg-muted/40 p-2.5 border border-border/60 text-xs text-foreground/90">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Bottom CTA ────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-card p-8 md:p-12 text-center space-y-4 shadow-2xs">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Ready to experience the workflow?
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Start publishing with zero configuration. Create your first post in under two minutes.
        </p>
        <div className="pt-2">
          <Button asChild size="default" className="h-10 px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-xs">
            <Link href="/sign-up">
              Try the Workflow for Free
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
