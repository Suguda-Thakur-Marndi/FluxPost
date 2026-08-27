"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChannelTypeEnum, getChannelIcon } from "@/constants/channels";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Check, Zap, Shield, Image as ImageIcon } from "lucide-react";

const channelsList = [
  {
    type: ChannelTypeEnum.TWITTER,
    name: "Twitter / X",
    tagline: "Short-form thoughts, threads & real-time commentary.",
    color: "#000000",
    charLimit: "280 chars",
    mediaSupport: "Up to 4 images / GIFs",
    features: [
      "OAuth 2.0 PKCE secure authorization",
      "Real-time character counter with limit warnings",
      "Multi-image carousel publishing",
      "Native live feed preview",
    ],
  },
  {
    type: ChannelTypeEnum.LINKEDIN,
    name: "LinkedIn",
    tagline: "Thought leadership, career insights & company news.",
    color: "#2867b2",
    charLimit: "3,000 chars",
    mediaSupport: "Single & multi-image uploads",
    features: [
      "Official LinkedIn REST API integration",
      "Long-form storytelling & formatting cleanup",
      "Personal profiles & company page scheduling",
      "Live LinkedIn post feed preview",
    ],
  },
  {
    type: ChannelTypeEnum.INSTAGRAM,
    name: "Instagram",
    tagline: "Visual storytelling, reels, carousels & hashtags.",
    color: "#E4405F",
    charLimit: "2,200 chars",
    mediaSupport: "Carousel & single image posts",
    features: [
      "Carousel swipe preview with interactive indicator",
      "AI hashtag generator & caption expander",
      "Direct publishing via Graph API",
      "Square & portrait media validation",
    ],
  },
  {
    type: ChannelTypeEnum.FACEBOOK,
    name: "Facebook",
    tagline: "Community updates, rich links & group announcements.",
    color: "#1877F2",
    charLimit: "63,206 chars",
    mediaSupport: "Multi-photo grid",
    features: [
      "Page and profile post scheduler",
      "Facebook feed mockup preview",
      "Rich caption formatting and emoji support",
      "Automated queue delivery",
    ],
  },
  {
    type: ChannelTypeEnum.THREADS,
    name: "Threads",
    tagline: "Fast conversational updates & developer discussions.",
    color: "#000000",
    charLimit: "500 chars",
    mediaSupport: "Images & text",
    features: [
      "Connected via Meta Threads API",
      "Instant quick-fire thought sharing",
      "Threaded post simulation preview",
      "Zero-latency automated posting",
    ],
  },
  {
    type: ChannelTypeEnum.BLUESKY,
    name: "Bluesky",
    tagline: "Decentralized social networking on the AT Protocol.",
    color: "#1285fe",
    charLimit: "300 chars",
    mediaSupport: "Up to 4 images",
    features: [
      "Direct AT Protocol API integration",
      "Decentralized network publishing",
      "Clean handle verification",
      "Live Bluesky card preview",
    ],
  },
  {
    type: ChannelTypeEnum.YOUTUBE,
    name: "YouTube",
    tagline: "Short-form video captions & community posts.",
    color: "#FF0000",
    charLimit: "100 chars (title)",
    mediaSupport: "Video / Shorts / Thumbnails",
    features: [
      "Vertical 9:16 Shorts live mockup",
      "Community tab update scheduler",
      "Google OAuth 2.0 connection",
      "Title & description optimizer",
    ],
  },
  {
    type: ChannelTypeEnum.TIKTOK,
    name: "TikTok",
    tagline: "Trending short videos, captions & viral hooks.",
    color: "#000000",
    charLimit: "2,200 chars",
    mediaSupport: "Video & cover preview",
    features: [
      "TikTok creator API integration",
      "Viral hook AI suggestions",
      "Trending hashtag explorer",
      "Mobile screen mockup preview",
    ],
  },
];

export default function ChannelsPage() {
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
          <span className="text-foreground/80">Multi-Channel Social Hub</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
        >
          Connect & schedule to <span className="text-gradient">all major networks</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-muted-foreground font-medium leading-relaxed"
        >
          One unified dashboard to orchestrate your social presence across Twitter, LinkedIn, Instagram, Facebook, Threads, Bluesky, and YouTube.
        </motion.p>
      </div>

      {/* ── Channels Grid ─────────────────────────────────── */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {channelsList.map((channel, idx) => {
          const icon = getChannelIcon(channel.type);
          return (
            <motion.div
              key={channel.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="flex flex-col justify-between rounded-[2rem] glass-card p-7 border border-white/10 shadow-xl backdrop-blur-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  {icon && (
                    <div
                      className="size-14 rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/20"
                      style={{ backgroundColor: channel.color }}
                    >
                      <HugeiconsIcon icon={icon} color="currentColor" className="size-7" />
                    </div>
                  )}
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/40">
                    {channel.charLimit}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{channel.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-6">
                  {channel.tagline}
                </p>

                <div className="space-y-2 mb-6 pt-4 border-t border-border/20">
                  {channel.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground/80 font-medium">
                      <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="size-3.5 text-primary" />
                  {channel.mediaSupport}
                </span>
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <Zap className="size-3.5" /> Ready
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Security Callout ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-20 rounded-[2.5rem] glass-card p-10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-primary/5 via-purple-500/5 to-transparent"
      >
        <div className="flex items-center gap-6">
          <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Shield className="size-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Bank-Grade Encryption</h3>
            <p className="text-sm text-muted-foreground font-medium max-w-xl">
              All social access tokens and refresh secrets are encrypted at rest using AES-256 and never shared with any third party.
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="rounded-full px-8 font-bold shrink-0 shadow-lg shadow-primary/20">
          <Link href="/settings">
            Connect Channels
            <ArrowRight className="ml-2 size-5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
