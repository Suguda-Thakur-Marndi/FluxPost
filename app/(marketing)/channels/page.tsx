"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChannelTypeEnum, getChannelIcon } from "@/constants/channels";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, Shield, Image as ImageIcon, CheckCircle2 } from "lucide-react";

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
    tagline: "Thought leadership, career insights & company updates.",
    color: "#0A66C2",
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
    tagline: "Visual storytelling, carousels, reels & hashtags.",
    color: "#E4405F",
    charLimit: "2,200 chars",
    mediaSupport: "Carousel & single image posts",
    features: [
      "Carousel swipe preview with indicator",
      "AI hashtag generator & caption expander",
      "Direct publishing via Graph API",
      "Square & portrait media validation",
    ],
  },
  {
    type: ChannelTypeEnum.TIKTOK,
    name: "TikTok",
    tagline: "Trending short videos, captions & viral hooks.",
    color: "#000000",
    charLimit: "2,200 chars",
    mediaSupport: "Vertical video & cover preview",
    features: [
      "TikTok creator API integration",
      "Viral hook AI suggestions",
      "Trending hashtag explorer",
      "9:16 mobile screen mockup preview",
    ],
  },
  {
    type: ChannelTypeEnum.FACEBOOK,
    name: "Facebook",
    tagline: "Community updates, rich links & page announcements.",
    color: "#1877F2",
    charLimit: "63,206 chars",
    mediaSupport: "Multi-photo grid",
    features: [
      "Page and profile post scheduler",
      "Facebook feed mockup preview",
      "Rich caption formatting",
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
    color: "#1285FE",
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
];

export default function ChannelsPage() {
  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold rounded-full border-border bg-card">
          Multi-Channel Social Hub
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Connect & schedule across all 8 major networks.
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
          One unified command center to orchestrate your social presence across Twitter/X, LinkedIn, Instagram, TikTok, Facebook, Threads, Bluesky, and YouTube.
        </p>
      </div>

      {/* ── Channels Grid ─────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {channelsList.map((channel) => {
          const icon = getChannelIcon(channel.type);
          return (
            <Card
              key={channel.name}
              className="surface-card flex flex-col justify-between p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
            >
              <CardContent className="p-0 flex flex-col justify-between h-full space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {icon && (
                      <div
                        className="size-11 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: channel.color }}
                      >
                        <HugeiconsIcon icon={icon} color="currentColor" className="size-5 text-white" />
                      </div>
                    )}
                    <Badge variant="secondary" className="text-[10px] font-semibold">
                      {channel.charLimit}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-1">{channel.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {channel.tagline}
                  </p>

                  <div className="space-y-2 mt-4 pt-4 border-t border-border/60">
                    {channel.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                        <Check className="size-3 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5 truncate">
                    <ImageIcon className="size-3 text-primary shrink-0" />
                    <span className="truncate">{channel.mediaSupport}</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                    <CheckCircle2 className="size-3" /> Ready
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Security Callout ──────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
            <Shield className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Bank-Grade OAuth 2.0 Security</h3>
            <p className="text-xs text-muted-foreground max-w-xl mt-0.5">
              All social access tokens and credentials are encrypted at rest with AES-256 via InsForge PostgreSQL. We never store personal account passwords.
            </p>
          </div>
        </div>
        <Button asChild size="default" className="h-10 px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-xs shrink-0">
          <Link href="/settings?tab=channels">
            Manage Channels
            <ArrowRight className="ml-1.5 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
