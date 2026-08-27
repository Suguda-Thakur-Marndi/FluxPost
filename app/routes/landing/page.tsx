"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  Check,
  Sparkles,
  Calendar,
  Zap,
  BarChart3,
  Globe2,
  Pencil,
  Send,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ChannelTypeEnum, getChannelIcon } from "@/constants/channels";
import { motion, useScroll, useTransform } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useRef } from "react";

/* ─── Data ─────────────────────────────────────────────────────────── */

const navItems = [
  { label: "Features", href: "/features" },
  { label: "Workflow", href: "/workflow" },
  { label: "Channels", href: "/channels" },
  { label: "Pricing",  href: "/pricing"  },
];

const platformBadges = [
  { type: ChannelTypeEnum.TWITTER,   color: "#000000", bg: "#e5e7eb", className: "left-[2%] top-[10%]", delay: 0 },
  { type: ChannelTypeEnum.LINKEDIN,  color: "#2867b2", bg: "#dbeafe", className: "left-[8%] top-[35%]", delay: 0.4 },
  { type: ChannelTypeEnum.YOUTUBE,   color: "#FF0000", bg: "#fee2e2", className: "left-[3%] top-[65%]", delay: 0.8 },
  { type: ChannelTypeEnum.FACEBOOK,  color: "#1877F2", bg: "#dbeafe", className: "left-[12%] top-[85%]", delay: 1.2 },
  { type: ChannelTypeEnum.BLUESKY,   color: "#1285fe", bg: "#dbeafe", className: "right-[2%] top-[10%]", delay: 0.2 },
  { type: ChannelTypeEnum.INSTAGRAM, color: "#E4405F", bg: "#fce7f3", className: "right-[8%] top-[35%]", delay: 0.6 },
  { type: ChannelTypeEnum.THREADS,   color: "#000000", bg: "#e5e7eb", className: "right-[3%] top-[65%]", delay: 1.0 },
  { type: ChannelTypeEnum.TWITTER,   color: "#000000", bg: "#e5e7eb", className: "right-[12%] top-[85%]", delay: 1.4 }, // Fallback for 8th
];

const stats = [
  { value: "7+",   label: "Social Platforms",         icon: Globe2 },
  { value: "AI",   label: "Smart Content Drafting",   icon: Sparkles },
  { value: "1",    label: "Unified Workspace",         icon: Calendar },
];

const features = [
  {
    icon: Pencil,
    title: "Draft smarter with AI",
    description:
      "Generate compelling captions, hashtags, and variations for every platform in seconds — then fine-tune before you publish.",
    accent: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-200 dark:border-violet-800/40",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: Calendar,
    title: "Plan your whole week at a glance",
    description:
      "Drag-and-drop scheduling across a visual calendar. See every draft, idea, and scheduled post without switching tabs.",
    accent: "from-sky-500/20 to-cyan-500/10",
    border: "border-sky-200 dark:border-sky-800/40",
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    icon: Zap,
    title: "Customize per channel, publish everywhere",
    description:
      "Start with one draft and tailor it for Twitter's brevity, LinkedIn's tone, or Instagram's hashtags — all in one workflow.",
    accent: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-200 dark:border-amber-800/40",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: BarChart3,
    title: "Stay organized, not overwhelmed",
    description:
      "A clean idea board keeps inspiration captured. Move ideas to drafts, drafts to scheduled — no spreadsheet required.",
    accent: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-200 dark:border-emerald-800/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

const steps = [
  {
    step: "01",
    icon: Pencil,
    title: "Capture your idea",
    description: "Write a quick idea or let AI help you expand it into a full draft.",
  },
  {
    step: "02",
    icon: Zap,
    title: "Customize per platform",
    description: "Adapt tone, length, and hashtags for each channel from one central post.",
  },
  {
    step: "03",
    icon: Send,
    title: "Schedule & publish",
    description: "Pick the perfect time and let Lemon.ai handle the rest automatically.",
  },
];

/* ─── Animations ──────────────────────────────────────────────────────── */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

/* ─── Component ──────────────────────────────────────────────────────── */

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  
  // 3D Scroll Effect
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: dashboardRef,
    offset: ["start end", "end center"],
  });
  
  const rotateX = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden dark:mesh-bg-dark mesh-bg selection:bg-primary/30">

      {/* ── Navbar ────────────────────────────────────────── */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-border/20 glass"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo className="shrink-0 scale-105" />

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:scale-105"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <>
                <Button asChild variant="ghost" className="rounded-full px-5 text-sm font-medium hover:bg-muted/50 transition-colors">
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full px-6 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  <Link href="/sign-up">Get started</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="rounded-full px-5 text-sm font-medium hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20">
                  <Link href="/schedule">Open workspace</Link>
                </Button>
                <UserButton appearance={{ elements: { avatarBox: "h-9 w-9 ring-2 ring-primary/20" } }} />
              </>
            )}
          </div>
        </div>
      </motion.header>

      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
          {/* Grid overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6">
            
            {/* 3D Floating Elements & Platform Badges */}
            <div className="pointer-events-none absolute inset-0 hidden xl:block z-0">
              
              {/* 3D Metallic Sphere */}
              <motion.div
                animate={{ y: [0, -30, 0], x: [0, 10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[15%] w-32 h-32 rounded-full z-0"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #fdf4ff 0%, #d946ef 20%, #701a75 70%, #2e1065 100%)",
                  boxShadow: "inset -10px -10px 20px rgba(0,0,0,0.6), inset 10px 10px 20px rgba(255,255,255,0.6), 20px 20px 40px rgba(217,70,239,0.3)"
                }}
              />

              {/* 3D Glass Pill */}
              <motion.div
                animate={{ y: [0, 25, 0], rotate: [-15, -5, -15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[20%] right-[12%] w-20 h-48 rounded-full glass-card border-t border-l border-white/40 z-0"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 100%)",
                  boxShadow: "inset -5px -5px 15px rgba(0,0,0,0.2), inset 5px 5px 15px rgba(255,255,255,0.5), 15px 15px 30px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(20px)"
                }}
              >
                <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/20 to-transparent" />
              </motion.div>

              {/* 3D Cyan Gem / Cube-ish */}
              <motion.div
                animate={{ y: [0, -20, 0], rotateZ: [0, 45, 0], rotateX: [0, 30, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[20%] right-[20%] w-24 h-24 rounded-3xl z-0"
                style={{
                  background: "radial-gradient(circle at 20% 20%, #cffafe 0%, #06b6d4 30%, #164e63 80%, #083344 100%)",
                  boxShadow: "inset -8px -8px 16px rgba(0,0,0,0.5), inset 8px 8px 16px rgba(255,255,255,0.6), 15px 15px 35px rgba(6,182,212,0.3)",
                  transformStyle: "preserve-3d"
                }}
              />

              {platformBadges.map((platform, i) => {
                const icon = getChannelIcon(platform.type);
                return (
                  <motion.div
                    key={`${platform.type}-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + platform.delay, type: "spring", bounce: 0.4 }}
                    className={`absolute ${platform.className}`}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -35, 0], 
                        rotateZ: [0, i % 2 === 0 ? 10 : -10, 0],
                        rotateY: [0, 20, 0]
                      }}
                      transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                      className="glass-card rounded-[2rem] p-5 shadow-2xl flex items-center justify-center relative group"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="absolute inset-0 rounded-[2rem] opacity-40 blur-2xl" style={{ backgroundColor: platform.color }} />
                      {icon && (
                        <div
                          className="relative flex size-14 items-center justify-center rounded-2xl text-white shadow-xl border border-white/20"
                          style={{ backgroundColor: platform.color, transform: "translateZ(20px)" }}
                        >
                          <HugeiconsIcon icon={icon} color="currentColor" className="size-7" />
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Hero copy */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="mb-8 inline-flex items-center gap-2 rounded-full glass-card px-5 py-2 text-sm font-medium shadow-sm border border-border/60">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-foreground/80">AI-powered scheduling for every platform</span>
                <span className="ml-2 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">NEW</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeInUp} className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl md:text-8xl leading-[1.1]">
                <span className="text-gradient drop-shadow-sm">Your social media</span>
                <br />
                <span className="text-foreground drop-shadow-sm">command centre</span>
              </motion.h1>

              {/* Sub */}
              <motion.p variants={fadeInUp} className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl font-medium">
                Draft with AI, customize per channel, and schedule across 8 platforms — all from one beautifully simple workspace.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap items-center justify-center gap-4">
                {!isSignedIn ? (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="group h-14 rounded-full px-8 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                    >
                      <Link href="/sign-up">
                        Start for free
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="h-14 rounded-full px-8 text-base font-semibold border-border/60 glass-card hover:bg-muted/50 transition-all hover:-translate-y-1"
                    >
                      <Link href="/sign-in">Log in</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="group h-14 rounded-full px-8 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                    >
                      <Link href="/schedule">
                        Open workspace
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-14 rounded-full px-8 text-base border-border/60 glass-card">
                      <Link href="/ideas">View ideas</Link>
                    </Button>
                  </>
                )}
              </motion.div>

              <motion.p variants={fadeInUp} className="mt-6 text-sm font-medium text-muted-foreground/60">
                No credit card required · Free forever tier
              </motion.p>
            </motion.div>

            {/* Dashboard Mockup / Floating Image */}
            <div ref={dashboardRef} className="w-full max-w-6xl mt-24 z-20 relative" style={{ perspective: "1200px" }}>
              <motion.div
                style={{ rotateX, scale, opacity, transformStyle: "preserve-3d" }}
                className="relative w-full rounded-3xl glass p-3 shadow-2xl shadow-primary/20 border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 rounded-3xl pointer-events-none" />
                
                {/* Inner Mockup Container */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.25rem] bg-background flex border border-border/50">
                   
                   {/* Mock Sidebar */}
                   <div className="w-56 border-r border-border/40 bg-muted/10 p-5 hidden sm:flex flex-col gap-6">
                     <div className="h-6 w-28 bg-primary/20 rounded-md mb-2" />
                     <div className="flex flex-col gap-3">
                       <div className="h-4 w-full bg-primary/10 rounded-sm" />
                       {[1,2,3,4].map(i => (
                          <div key={i} className="h-4 w-[85%] bg-border/40 rounded-sm" />
                       ))}
                     </div>
                     <div className="mt-auto h-10 w-full bg-border/30 rounded-lg" />
                   </div>

                   {/* Mock Main Content */}
                   <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 bg-gradient-to-br from-background to-muted/10">
                      {/* Top Bar */}
                      <div className="flex justify-between items-center border-b border-border/40 pb-4">
                         <div className="h-8 w-48 bg-border/40 rounded-md" />
                         <div className="flex gap-3">
                           <div className="h-9 w-9 rounded-full bg-primary/20" />
                           <div className="h-9 w-28 bg-primary text-primary-foreground flex items-center justify-center rounded-md text-sm font-bold shadow-md">New Post</div>
                         </div>
                      </div>

                      {/* Calendar Grid Mockup */}
                      <div className="grid grid-cols-7 gap-3 flex-1">
                         {Array.from({length: 21}).map((_, i) => (
                            <div key={i} className={`rounded-xl border border-border/30 p-2.5 ${i === 11 ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20' : 'bg-card'} flex flex-col gap-1.5 shadow-sm`}>
                               <div className="text-[11px] text-muted-foreground font-semibold">{i + 1}</div>
                               {i === 4 && <div className="h-4 w-full bg-[#1da1f2]/20 rounded-sm" />}
                               {i === 11 && (
                                 <>
                                  <div className="h-4 w-full bg-[#0a66c2]/30 rounded-sm border border-[#0a66c2]/20" />
                                  <div className="h-4 w-[80%] bg-[#e4405f]/30 rounded-sm border border-[#e4405f]/20" />
                                 </>
                               )}
                               {i === 16 && <div className="h-4 w-full bg-primary/30 rounded-sm border border-primary/20" />}
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* Floating AI Panel Mockup (3D pop-out effect) */}
                   <motion.div 
                     style={{ translateZ: 80 }}
                     className="absolute bottom-10 right-10 w-72 glass-card rounded-2xl p-5 shadow-2xl border border-primary/20 z-20 hidden md:block"
                   >
                     <div className="flex items-center gap-2 mb-4">
                       <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                         <Sparkles className="h-4 w-4 animate-pulse" />
                       </div>
                       <div className="text-sm font-bold text-foreground">AI Content Generator</div>
                     </div>
                     <div className="h-20 w-full bg-background rounded-lg border border-border/50 mb-4 p-3 shadow-inner">
                       <div className="h-2 w-[90%] bg-border/60 rounded-sm mb-2.5" />
                       <div className="h-2 w-[70%] bg-border/60 rounded-sm mb-2.5" />
                       <div className="h-2 w-[40%] bg-primary/40 rounded-sm" />
                     </div>
                     <div className="h-9 w-full bg-primary text-primary-foreground rounded-lg text-xs flex items-center justify-center font-bold shadow-md hover:opacity-90 transition-opacity">
                       Generate Variations
                     </div>
                   </motion.div>

                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-6 sm:grid-cols-3"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={fadeInUp}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group relative overflow-hidden rounded-[2rem] glass-card px-8 py-10 text-center border-white/5"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Icon className="mx-auto mb-4 h-8 w-8 text-primary drop-shadow-sm transition-transform group-hover:scale-110 duration-300" />
                    <div className="text-5xl font-black tracking-tight text-foreground">{stat.value}</div>
                    <div className="mt-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
        </section>

        {/* ── Features grid ─────────────────────────────────── */}
        <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="mb-20 text-center">
            <motion.p 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest text-primary"
            >
              Features
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mt-4 text-4xl font-black tracking-tight text-foreground md:text-6xl"
            >
              Everything you need,<br />nothing you don&apos;t
            </motion.h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`group relative overflow-hidden rounded-[2rem] border ${f.border} bg-gradient-to-br ${f.accent} p-8 backdrop-blur-xl transition-all duration-300 shadow-lg hover:shadow-xl dark:bg-card/30`}
                >
                  <div className={`mb-6 inline-flex rounded-2xl ${f.iconBg} p-4 shadow-inner border border-white/10`}>
                    <Icon className={`h-6 w-6 ${f.iconColor}`} />
                  </div>
                  <h3 className="mb-4 text-xl font-bold leading-snug text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground font-medium">{f.description}</p>
                  
                  <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-150 transition-all duration-700">
                    <Icon className={`h-40 w-40 ${f.iconColor}`} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section id="workflow" className="relative overflow-hidden border-y border-border/30 bg-muted/20 py-32 dark:bg-muted/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-24 text-center">
              <motion.p 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-sm font-bold uppercase tracking-widest text-primary"
              >
                Workflow
              </motion.p>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="mt-4 text-4xl font-black tracking-tight text-foreground md:text-6xl"
              >
                From idea to published<br />in three steps
              </motion.h2>
            </div>

            <div className="relative grid gap-12 md:grid-cols-3">
              {/* connector line */}
              <div className="absolute top-12 left-[16.67%] right-[16.67%] hidden h-1 rounded-full bg-border/40 md:block overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" 
                />
              </div>

              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div 
                    key={s.step} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.3, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative flex flex-col items-center text-center group"
                  >
                    <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] glass-card group-hover:scale-110 group-hover:shadow-primary/20 transition-all duration-500 z-10 bg-card border-white/5">
                      <Icon className="h-10 w-10 text-primary" />
                      <span className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground shadow-lg shadow-primary/30">
                        {i + 1}
                      </span>
                    </div>
                    <div className="text-4xl font-black tracking-tight text-primary/10 mb-2 group-hover:text-primary/20 transition-colors">{s.step}</div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{s.title}</h3>
                    <p className="max-w-xs text-base font-medium leading-relaxed text-muted-foreground">{s.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Platforms strip ───────────────────────────────── */}
        <section id="channels" className="relative mx-auto max-w-7xl px-6 py-32 overflow-hidden">
          <div className="mb-20 text-center">
            <motion.p 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest text-primary"
            >
              Supported channels
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mt-4 text-4xl font-black tracking-tight text-foreground md:text-6xl"
            >
              Publish everywhere<br />from one place
            </motion.h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { type: ChannelTypeEnum.TWITTER,   label: "Twitter / X",  color: "#000000" },
              { type: ChannelTypeEnum.LINKEDIN,  label: "LinkedIn",     color: "#2867b2" },
              { type: ChannelTypeEnum.INSTAGRAM, label: "Instagram",    color: "#E4405F" },
              { type: ChannelTypeEnum.FACEBOOK,  label: "Facebook",     color: "#1877F2" },
              { type: ChannelTypeEnum.BLUESKY,   label: "Bluesky",      color: "#1285fe" },
              { type: ChannelTypeEnum.THREADS,   label: "Threads",      color: "#000000" },
              { type: ChannelTypeEnum.YOUTUBE,   label: "YouTube",      color: "#FF0000" },
            ].map((p, i) => {
              const icon = getChannelIcon(p.type);
              return (
                <motion.div
                  key={p.type}
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  whileHover={{ scale: 1.1, rotateZ: 5, y: -10 }}
                  className="group flex items-center gap-4 rounded-[2.5rem] glass-card px-8 py-4 shadow-xl hover:shadow-primary/20 cursor-pointer border border-white/5"
                >
                  {icon && (
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-inner"
                      style={{ backgroundColor: p.color }}
                    >
                      <HugeiconsIcon icon={icon} color="currentColor" className="size-7" />
                    </div>
                  )}
                  <span className="text-lg font-bold text-foreground">{p.label}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────── */}
        <section id="pricing" className="mx-auto max-w-7xl px-6 py-32">
          <div className="mb-20 text-center">
            <motion.p 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest text-primary"
            >
              Pricing
            </motion.p>
            <motion.h2 
               initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
               className="mt-4 text-4xl font-black tracking-tight text-foreground md:text-6xl"
            >
              Simple, honest pricing
            </motion.h2>
            <motion.p 
               initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
               className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-muted-foreground"
            >
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </motion.p>
          </div>

          <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-50px" }}
             variants={staggerContainer}
             className="grid gap-8 lg:grid-cols-3 items-center"
          >
            {/* Free */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="flex flex-col rounded-[2.5rem] glass-card p-10 transition-all duration-300 border-white/5"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Free</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-6xl font-black tracking-tight text-foreground">$0</span>
                <span className="mb-2 text-lg font-bold text-muted-foreground">/mo</span>
              </div>
              <p className="mt-4 text-base font-medium text-muted-foreground/80">Perfect for getting started and exploring the platform.</p>
              <ul className="mt-10 flex flex-col gap-4 text-base font-medium text-foreground flex-1">
                {["3 scheduled posts/month", "2 connected channels", "AI drafting (10 uses/mo)", "Idea board"].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="h-5 w-5 shrink-0 text-primary" />{f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" size="lg" className="mt-10 rounded-full h-14 text-base font-bold bg-transparent">
                <Link href="/sign-up">Get started free</Link>
              </Button>
            </motion.div>

            {/* Pro — highlighted */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative flex flex-col rounded-[2.5rem] border-2 border-primary bg-gradient-to-b from-primary/10 to-transparent p-12 shadow-2xl shadow-primary/20 z-10 backdrop-blur-xl dark:bg-card/40"
            >
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-1.5 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30">
                Most popular
              </span>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">Pro</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-7xl font-black tracking-tight text-foreground">$12</span>
                <span className="mb-2 text-lg font-bold text-muted-foreground">/mo</span>
              </div>
              <p className="mt-4 text-base font-medium text-muted-foreground/80">For creators who publish consistently across platforms.</p>
              <ul className="mt-10 flex flex-col gap-4 text-base font-medium text-foreground flex-1">
                {["Unlimited scheduled posts", "7 connected channels", "AI drafting (unlimited)", "Per-channel customization", "Priority support"].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="h-5 w-5 shrink-0 text-primary" />{f}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-10 rounded-full h-14 text-base font-bold shadow-xl shadow-primary/30 hover:shadow-primary/50">
                <Link href="/sign-up">Start Pro trial</Link>
              </Button>
            </motion.div>

            {/* Team */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="flex flex-col rounded-[2.5rem] glass-card p-10 transition-all duration-300 border-white/5"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Team</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-6xl font-black tracking-tight text-foreground">$39</span>
                <span className="mb-2 text-lg font-bold text-muted-foreground">/mo</span>
              </div>
              <p className="mt-4 text-base font-medium text-muted-foreground/80">For small teams managing multiple brands and clients.</p>
              <ul className="mt-10 flex flex-col gap-4 text-base font-medium text-foreground flex-1">
                {["Everything in Pro", "Up to 5 team members", "All 7 channels", "Shared workspace", "Analytics dashboard"].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="h-5 w-5 shrink-0 text-primary" />{f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" size="lg" className="mt-10 rounded-full h-14 text-base font-bold bg-transparent">
                <Link href="/sign-up">Contact sales</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border/20 glass px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <Logo className="opacity-80 scale-105" />
          <p className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
