"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Perfect for getting started and exploring the platform.",
    badge: null,
    highlighted: false,
    cta: "Start Free",
    href: "/sign-up",
    features: [
      "4 scheduled posts limit",
      "2 connected social channels",
      "AI drafting (10 uses/month)",
      "Idea Kanban workspace",
      "Live platform previews",
      "Community support",
    ],
  },
  {
    name: "Professional",
    priceMonthly: 12,
    priceYearly: 10,
    description: "For active creators & solo operators publishing consistently.",
    badge: "Most Popular",
    highlighted: true,
    cta: "Start 14-Day Free Trial",
    href: "/sign-up",
    features: [
      "Unlimited scheduled posts",
      "All 8 connected channels",
      "Unlimited AI content generation",
      "Per-channel tone & hook adaptation",
      "Calendar & list views",
      "Multi-image carousel scheduling",
      "Priority background queue with Inngest",
      "Priority email support",
    ],
  },
  {
    name: "Team & Agency",
    priceMonthly: 39,
    priceYearly: 32,
    description: "For agencies and teams managing multiple brands & client accounts.",
    badge: "Best for Teams",
    highlighted: false,
    cta: "Start Team Trial",
    href: "/sign-up",
    features: [
      "Everything in Professional",
      "Up to 5 team collaborators",
      "Multi-brand workspace routing",
      "Cross-channel publishing analytics",
      "Custom scheduled publishing slots",
      "Dedicated priority support",
    ],
  },
];

const faqs = [
  {
    question: "Can I try Media Scheduler before purchasing a subscription?",
    answer:
      "Yes! You can start with our Free forever tier with zero commitment and no credit card required, or activate a 14-day free trial on the Professional tier.",
  },
  {
    question: "Which social networks are currently supported?",
    answer:
      "We support publishing and scheduling across Twitter / X, LinkedIn, Instagram, TikTok, Facebook, Threads, YouTube Shorts, and Bluesky.",
  },
  {
    question: "How does the AI content assistant work?",
    answer:
      "Our AI assistant analyzes your topic prompt and generates engaging copy, suggested hashtags, viral hooks, and variations formatted to match the exact tone and character limits of each platform.",
  },
  {
    question: "Can I cancel or change my plan anytime?",
    answer:
      "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your Billing settings with a single click.",
  },
  {
    question: "Are my social media account credentials secure?",
    answer:
      "Yes. We use industry-standard OAuth 2.0 with PKCE and AES-256 encryption. We never store or have access to your personal passwords.",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold rounded-full border-border bg-card">
          Simple, Transparent Pricing
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Predictable plans for every publishing scale.
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
          Choose the right plan to level up your social media presence. Free forever tier available.
        </p>

        {/* ── Billing Frequency Toggle ─────────────────────── */}
        <div className="pt-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
                !isYearly
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
                isYearly
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Annual Billing</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>
      </div>

      {/* ── Plan Cards ────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {plans.map((plan) => {
          const price = isYearly ? plan.priceYearly : plan.priceMonthly;
          return (
            <Card
              key={plan.name}
              className={cn(
                "surface-card flex flex-col justify-between p-6 sm:p-8 transition-all relative shadow-2xs",
                plan.highlighted && "border-primary/60 ring-2 ring-primary/20 shadow-md"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <Badge variant="outline" className="text-xs font-semibold border-border">
                    {plan.name}
                  </Badge>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                      ${price}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">/month</span>
                  </div>
                  {isYearly && plan.priceMonthly > 0 && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      Billed annually (${price * 12}/year)
                    </p>
                  )}
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-border/60">
                  <ul className="space-y-2.5">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-foreground/90">
                        <Check className="size-3.5 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  asChild
                  size="default"
                  variant={plan.highlighted ? "default" : "outline"}
                  className={cn(
                    "w-full h-10 text-xs font-semibold rounded-lg shadow-xs",
                    plan.highlighted && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── FAQs Accordion ────────────────────────────────── */}
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Everything you need to know about plans and billing.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="surface-card rounded-xl border border-border/80 px-5 shadow-2xs overflow-hidden"
            >
              <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline py-4 text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-xs">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
