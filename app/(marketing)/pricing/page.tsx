"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Perfect for getting started and exploring the platform.",
    badge: null,
    highlighted: false,
    cta: "Get Started Free",
    href: "/sign-up",
    features: [
      "3 scheduled posts per month",
      "2 connected social channels",
      "AI drafting (10 uses/month)",
      "Idea & Kanban board",
      "Basic preview mode",
      "Community support",
    ],
  },
  {
    name: "Pro",
    priceMonthly: 12,
    priceYearly: 10,
    description: "For creators & solo entrepreneurs publishing consistently.",
    badge: "Most Popular",
    highlighted: true,
    cta: "Start 14-Day Free Trial",
    href: "/sign-up",
    features: [
      "Unlimited scheduled posts",
      "All 7+ connected channels",
      "Unlimited AI content generation",
      "Per-channel tone & hook adaptation",
      "Calendar & list views",
      "Multi-image carousel scheduling",
      "Priority background queue",
      "Email support",
    ],
  },
  {
    name: "Team",
    priceMonthly: 39,
    priceYearly: 32,
    description: "For agencies and teams managing multiple brands & accounts.",
    badge: "Best for Teams",
    highlighted: false,
    cta: "Start Team Trial",
    href: "/sign-up",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Multiple workspaces & brands",
      "Advanced content approval workflows",
      "Cross-channel publishing analytics",
      "Custom scheduled publishing slots",
      "Dedicated 24/7 priority support",
    ],
  },
];

const faqs = [
  {
    question: "Can I try Lemon.ai before purchasing a subscription?",
    answer:
      "Yes! You can start with our Free forever tier with zero commitment and no credit card required, or take advantage of the 14-day free trial on the Pro tier.",
  },
  {
    question: "Which social networks are currently supported?",
    answer:
      "We support publishing and scheduling across Twitter / X, LinkedIn, Instagram, Facebook, Threads, YouTube Shorts, and Bluesky. More platforms are added regularly.",
  },
  {
    question: "How does AI content generation work?",
    answer:
      "Our AI assistant analyzes your topic prompt and generates engaging copy, suggested hashtags, viral hooks, and variations formatted to match the exact tone and character limits of each platform.",
  },
  {
    question: "Can I cancel or change my plan anytime?",
    answer:
      "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your Billing Settings with a single click.",
  },
  {
    question: "Are my social media account credentials secure?",
    answer:
      "Yes. We use industry-standard OAuth 2.0 with PKCE and AES-256 encryption to store tokens securely. We never store or have access to your passwords.",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full glass-card px-5 py-2 text-sm font-medium border border-border/60 mb-6"
        >
          <Sparkles className="size-4 text-primary animate-pulse" />
          <span className="text-foreground/80">Simple, Transparent Pricing</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
        >
          Predictable plans for <span className="text-gradient">every stage</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-muted-foreground font-medium leading-relaxed"
        >
          Choose the right plan to level up your social media presence. Upgrade or cancel anytime.
        </motion.p>

        {/* ── Billing Frequency Toggle ─────────────────────── */}
        <div className="mt-10 inline-flex items-center gap-3 bg-muted/40 p-1.5 rounded-full border border-border/40 backdrop-blur-md">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              !isYearly ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              isYearly ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Yearly</span>
            <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* ── Plan Cards ────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-3 items-stretch mb-24">
        {plans.map((plan, i) => {
          const price = isYearly ? plan.priceYearly : plan.priceMonthly;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className={`relative flex flex-col justify-between rounded-[2.5rem] p-10 transition-all duration-300 ${
                plan.highlighted
                  ? "border-2 border-primary bg-gradient-to-b from-primary/10 via-background to-transparent shadow-2xl shadow-primary/20 backdrop-blur-2xl z-10"
                  : "glass-card border border-white/10 shadow-xl"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-1.5 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30">
                  {plan.badge}
                </span>
              )}

              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-6xl font-black tracking-tight text-foreground">${price}</span>
                  <span className="text-muted-foreground font-semibold">/month</span>
                </div>
                {isYearly && plan.priceMonthly > 0 && (
                  <p className="text-xs text-emerald-500 font-bold mt-1">Billed annually (${price * 12}/yr)</p>
                )}
                <p className="mt-4 text-sm text-muted-foreground font-medium">{plan.description}</p>

                <div className="my-8 h-px bg-border/40" />

                <ul className="space-y-3.5">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                      <Check className="size-5 text-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                size="lg"
                variant={plan.highlighted ? "default" : "outline"}
                className={`mt-10 w-full rounded-full h-14 text-base font-bold shadow-lg ${
                  plan.highlighted ? "shadow-primary/30 hover:shadow-primary/50" : "bg-transparent hover:bg-muted/40"
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* ── FAQs Accordion ────────────────────────────────── */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-foreground mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground font-medium">Have questions? We are here to help.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="glass-card rounded-2xl border border-white/10 px-6 shadow-sm overflow-hidden"
            >
              <AccordionTrigger className="text-left font-bold text-base hover:no-underline py-5 text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium leading-relaxed pb-5 text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
