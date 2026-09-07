"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  Check,
  Sparkles,
  Calendar,
  Globe2,
  Layers,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChannelTypeEnum, getChannelIcon } from "@/constants/channels";

/* ─── Data ─────────────────────────────────────────────────────────── */

const platformList = [
  { type: ChannelTypeEnum.TWITTER,   name: "Twitter / X",  color: "#000000" },
  { type: ChannelTypeEnum.LINKEDIN,  name: "LinkedIn",     color: "#0A66C2" },
  { type: ChannelTypeEnum.INSTAGRAM, name: "Instagram",    color: "#E4405F" },
  { type: ChannelTypeEnum.TIKTOK,    name: "TikTok",       color: "#000000" },
  { type: ChannelTypeEnum.FACEBOOK,  name: "Facebook",     color: "#1877F2" },
  { type: ChannelTypeEnum.THREADS,   name: "Threads",      color: "#000000" },
  { type: ChannelTypeEnum.BLUESKY,   name: "Bluesky",      color: "#1285FE" },
  { type: ChannelTypeEnum.YOUTUBE,   name: "YouTube",      color: "#FF0000" },
];

const stats = [
  { value: "8", label: "Connected Networks", subtext: "X, LinkedIn, TikTok, IG & more" },
  { value: "100%", label: "Automated Publishing", subtext: "Precision Inngest background engine" },
  { value: "3x", label: "Faster Content Velocity", subtext: "AI drafting & multi-channel sync" },
  { value: "0", label: "Spreadsheets Required", subtext: "Integrated idea Kanban board" },
];

const features = [
  {
    icon: Sparkles,
    badge: "AI Content Studio",
    title: "Draft smarter with contextual AI",
    description:
      "Generate compelling copy, hooks, and hashtags adapted specifically for each platform's character limits and community tone.",
  },
  {
    icon: Calendar,
    badge: "Calendar Orchestrator",
    title: "Plan weeks at a glance",
    description:
      "Interactive month, week, and list views let you visualize your entire publishing queue with drag-and-drop ease.",
  },
  {
    icon: Globe2,
    badge: "Live Feed Previews",
    title: "Pixel-perfect mockups before publishing",
    description:
      "Inspect realistic live previews across Twitter/X, LinkedIn, Instagram, TikTok, and more to catch formatting flaws before they go live.",
  },
  {
    icon: Layers,
    badge: "Kanban Ideation Board",
    title: "Turn sparks into scheduled posts",
    description:
      "Organize creative notes, media attachments, and spontaneous brainstorms into structured columns with one-click conversion to posts.",
  },
];

const steps = [
  {
    step: "01",
    title: "Capture & Ideate",
    description: "Write raw thoughts or use AI prompts to generate high-performing post variations and hooks.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Tailor & Preview",
    description: "Customize copy per channel, inspect realistic previews, and select media attachments.",
    icon: LayoutGrid,
  },
  {
    step: "03",
    title: "Schedule & Publish",
    description: "Choose your optimal publishing slot and let our background engine deploy automatically.",
    icon: Clock,
  },
];

const testimonials = [
  {
    quote:
      "Media Scheduler replaced three separate tools for our agency. The realistic preview engine alone prevents dozens of formatting mistakes every month.",
    author: "Elena Rostova",
    role: "Head of Growth",
    company: "Vanguard Media",
  },
  {
    quote:
      "Being able to draft once and tailor copy for Twitter's brevity versus LinkedIn's narrative style in one dialog saves our content team over 10 hours each week.",
    author: "Marcus Chen",
    role: "Content Director",
    company: "ScaleLoop",
  },
  {
    quote:
      "Reliable background publishing with zero token dropouts. Our scheduled posts deploy precisely when our international audience is most active.",
    author: "Sarah Lindqvist",
    role: "Social Lead",
    company: "Nordic Tech Ventures",
  },
];

/* ─── Component ──────────────────────────────────────────────────────── */

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="bg-background text-foreground">
      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-20 md:pt-28 md:pb-28 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            <Badge 
              variant="outline" 
              className="px-3.5 py-1 text-xs font-semibold rounded-full border-border bg-card shadow-2xs gap-1.5"
            >
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              Unified Social Media Management Platform
            </Badge>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Plan, create and publish your social content from{" "}
              <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
                one workspace.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Streamline your publishing pipeline with AI-assisted drafting, interactive multi-network previews, and reliable background scheduling across 8 major social networks.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {!isSignedIn ? (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="h-11 px-6 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-2"
                  >
                    <Link href="/sign-up">
                      Start Creating Free
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-11 px-6 text-sm font-semibold rounded-lg border-border hover:bg-muted/60"
                  >
                    <Link href="#workflow">See How It Works</Link>
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-6 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-2"
                >
                  <Link href="/dashboard">
                    Open Workspace Dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-6 pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-emerald-500" /> Free forever tier
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-emerald-500" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-emerald-500" /> 8 connected channels
              </span>
            </div>
          </div>

          {/* ── Product Showcase Mockup ───────────────────────── */}
          <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border/80 bg-card/80 p-2 sm:p-3 shadow-xl shadow-primary/5">
              <div className="rounded-xl border border-border/60 bg-background overflow-hidden">
                {/* Browser top window frame */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-destructive/60" />
                    <span className="size-2.5 rounded-full bg-amber-500/60" />
                    <span className="size-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="px-4 py-1 rounded-md bg-muted/60 text-[11px] font-mono text-muted-foreground">
                    app.mediascheduler.com/schedule
                  </div>
                  <div className="size-4" />
                </div>

                {/* Dashboard preview grid */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left Column: Calendar Overview */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border/50">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Content Schedule</h3>
                        <p className="text-xs text-muted-foreground">April 2026 · 14 posts scheduled</p>
                      </div>
                      <Badge variant="outline" className="text-xs border-border bg-card">Month View</Badge>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="text-center text-[11px] font-semibold text-muted-foreground py-1">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-16 rounded-lg border p-1.5 flex flex-col justify-between text-xs transition-all ${
                            i === 3
                              ? "border-primary bg-primary/5 shadow-2xs"
                              : "border-border/60 bg-card/50"
                          }`}
                        >
                          <span className="text-[10px] font-semibold text-muted-foreground">{i + 1}</span>
                          {i === 3 && (
                            <div className="p-1 rounded bg-[#0A66C2] text-white text-[9px] font-medium truncate">
                              LinkedIn Launch
                            </div>
                          )}
                          {i === 6 && (
                            <div className="p-1 rounded bg-black text-white text-[9px] font-medium truncate">
                              Twitter Thread
                            </div>
                          )}
                          {i === 10 && (
                            <div className="p-1 rounded bg-[#E4405F] text-white text-[9px] font-medium truncate">
                              IG Carousel
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Mini Live Preview Card */}
                  <div className="md:col-span-4 rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-border/50">
                        <span className="text-xs font-semibold text-foreground">Live Channel Preview</span>
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">LinkedIn</Badge>
                      </div>

                      <div className="mt-3 rounded-lg border border-border bg-card p-3 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xs font-bold">in</div>
                          <div>
                            <p className="text-xs font-semibold text-foreground leading-none">Media Scheduler</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Scheduled for 10:00 AM</p>
                          </div>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed line-clamp-3">
                          Planning your multi-platform content shouldn&apos;t require ten different apps. Here is how we automated our distribution...
                        </p>
                        <div className="h-16 rounded-md bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                          Attached Media (16:9)
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button size="sm" className="w-full text-xs font-semibold h-8 bg-primary">
                        Schedule Post Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Statistics Strip ───────────────────────────────── */}
      <section className="border-b border-border/60 bg-card/40 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{s.value}</p>
                <p className="text-xs sm:text-sm font-semibold text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Highlights ─────────────────────────────── */}
      <section id="features" className="py-20 md:py-28 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs font-semibold border-border">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Everything required to scale multi-channel content.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Engineered for social media managers, marketing agencies, creators, and growth teams who require precision and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="surface-card hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <f.icon className="size-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-semibold">{f.badge}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-Step Workflow ────────────────────────────────── */}
      <section id="workflow" className="py-20 md:py-28 bg-muted/20 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs font-semibold border-border">Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              From raw thought to published in three steps.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No context switching. No tedious manual reformatting across disparate tabs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 relative shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {s.step}
                  </div>
                  <s.icon className="size-5 text-muted-foreground/60" />
                </div>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Supported Channels Strip ───────────────────────── */}
      <section id="channels" className="py-20 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs font-semibold border-border">Integrations</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Publish across 8 connected networks
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Official OAuth 2.0 PKCE connections with automatic background token management.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {platformList.map((p) => {
              const icon = getChannelIcon(p.type);
              return (
                <div
                  key={p.name}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/80 bg-card shadow-2xs hover:border-primary/40 transition-all select-none"
                >
                  <div 
                    className="size-6 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: p.color }}
                  >
                    {icon && <HugeiconsIcon icon={icon} color="currentColor" className="size-3.5" />}
                  </div>
                  <span className="text-xs font-semibold text-foreground">{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing Summary ────────────────────────────────── */}
      <section id="pricing" className="py-20 md:py-28 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs font-semibold border-border">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Transparent plans for creators and teams.
            </h2>
            <p className="text-sm text-muted-foreground">
              Start with our free forever tier. Upgrade whenever your publication volume expands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Free */}
            <Card className="surface-card flex flex-col justify-between p-6 sm:p-8">
              <div className="space-y-4">
                <Badge variant="outline" className="text-xs font-semibold border-border">Starter</Badge>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$0</span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <p className="text-xs text-muted-foreground">Perfect for testing workflows and scheduling single campaigns.</p>
                <ul className="space-y-2.5 text-xs text-foreground/90 pt-4 border-t border-border/60">
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> 4 scheduled posts limit</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> 2 connected channels</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> AI content generation</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> Interactive Kanban board</li>
                </ul>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-8 w-full font-semibold">
                <Link href="/sign-up">Start Free</Link>
              </Button>
            </Card>

            {/* Pro */}
            <Card className="surface-card border-primary/50 ring-2 ring-primary/20 shadow-md flex flex-col justify-between p-6 sm:p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </Badge>
              </div>
              <div className="space-y-4">
                <Badge variant="outline" className="text-xs font-semibold border-border">Professional</Badge>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$12</span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <p className="text-xs text-muted-foreground">For active creators, marketers, and founders publishing across multiple channels.</p>
                <ul className="space-y-2.5 text-xs text-foreground/90 pt-4 border-t border-border/60">
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> Unlimited scheduled posts</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> All 8 connected channels</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> Unlimited AI copywriting</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> Live feed previews for all platforms</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> Priority background publishing</li>
                </ul>
              </div>
              <Button asChild size="sm" className="mt-8 w-full font-semibold bg-primary text-primary-foreground">
                <Link href="/sign-up">Start 14-Day Trial</Link>
              </Button>
            </Card>

            {/* Team */}
            <Card className="surface-card flex flex-col justify-between p-6 sm:p-8">
              <div className="space-y-4">
                <Badge variant="outline" className="text-xs font-semibold border-border">Agency & Team</Badge>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$39</span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <p className="text-xs text-muted-foreground">For agencies and marketing squads managing multiple client accounts.</p>
                <ul className="space-y-2.5 text-xs text-foreground/90 pt-4 border-t border-border/60">
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> Up to 5 team collaborators</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> Multi-brand channel routing</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-500" /> Priority SLA & support</li>
                </ul>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-8 w-full font-semibold">
                <Link href="/sign-up">Contact Sales</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-muted/15 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs font-semibold border-border">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Trusted by creators and modern teams.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="surface-card p-6 sm:p-8 space-y-4">
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-border/60">
                  <p className="text-xs font-bold text-foreground">{t.author}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role} · {t.company}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ───────────────────────────── */}
      <section className="py-20 md:py-28 bg-card">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Ready to elevate your social media publishing?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join thousands of creators and marketers executing flawless multi-channel content schedules from one clean command center.
          </p>
          <div className="pt-2">
            <Button
              asChild
              size="lg"
              className="h-11 px-8 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-2"
            >
              <Link href="/sign-up">
                Start Creating Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
