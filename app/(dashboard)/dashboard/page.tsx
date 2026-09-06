"use client"

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Plus, 
  ArrowUpRight, 
  Radio, 
  Sparkles, 
  Image as ImageIcon,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import CreatePostDialog from "@/components/schedule/create-post-dialog";
import ChannelAvatar from "@/components/channel-avatar";
import { getChannelIcon, getChannelUrl } from "@/constants/channels";
import { ChannelType } from "@/types/channel.type";
import { PostType } from "@/types/post.type";
import { HugeiconsIcon } from "@hugeicons/react";

export default function DashboardOverviewPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 1. Fetch Post Totals (KPIs)
  const { data: totalsData, isLoading: totalsLoading } = useQuery({
    queryKey: ["post-totals"],
    queryFn: async () => {
      const res = await fetch("/api/post/totals");
      if (!res.ok) throw new Error("Failed to fetch totals");
      return res.json();
    },
    refetchInterval: 30000,
  });

  // 2. Fetch Upcoming Queued Posts
  const { data: queuedData, isLoading: queueLoading, refetch: refetchQueue } = useQuery({
    queryKey: ["upcoming-queue"],
    queryFn: async () => {
      const res = await fetch("/api/post?status=queue");
      if (!res.ok) throw new Error("Failed to fetch queued posts");
      return res.json();
    },
    refetchInterval: 30000,
  });

  // 3. Fetch Recent Published Posts
  const { data: publishedData, isLoading: publishedLoading } = useQuery({
    queryKey: ["recent-published"],
    queryFn: async () => {
      const res = await fetch("/api/post?status=published");
      if (!res.ok) throw new Error("Failed to fetch published posts");
      return res.json();
    },
  });

  // 4. Fetch Channels
  const { data: channelsData, isLoading: channelsLoading } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const res = await fetch("/api/channel");
      if (!res.ok) throw new Error("Failed to fetch channels");
      return res.json();
    },
  });

  const totals = totalsData || { totalQueue: 0, totalPublished: 0, totalFailed: 0, totalDrafts: 0 };
  const queuedPosts = (queuedData?.posts || []) as PostType[];
  const recentPublished = (publishedData?.posts || []).slice(0, 5) as PostType[];
  const channels = (channelsData?.channels || []) as ChannelType[];
  const connectedChannels = channels.filter((c) => c.connected);

  // Format relative date display
  const formatPostTime = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      const timeStr = format(date, "h:mm a");
      if (isToday(date)) return `Today at ${timeStr}`;
      if (isTomorrow(date)) return `Tomorrow at ${timeStr}`;
      return `${format(date, "MMM d")} at ${timeStr}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Dashboard Overview
            </h1>
            <Badge variant="outline" className="text-xs font-semibold border-border bg-muted/40 text-muted-foreground">
              Live
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Operational publishing overview and queue monitor across your connected networks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetchQueue()}
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
            title="Refresh publishing state"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh</span>
          </Button>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 gap-1.5"
          >
            <Plus className="size-4" />
            <span>Create Post</span>
          </Button>
        </div>
      </div>

      {/* 4 Operational KPI Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Queue Card */}
        <Card className="surface-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Scheduled Queue
            </CardTitle>
            <div className="size-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {totalsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {totals.totalQueue}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span>In publishing queue</span>
                  <Link href="/schedule" className="text-primary hover:underline ml-auto font-medium">
                    View &rarr;
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* 2. Published Card */}
        <Card className="surface-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Published Posts
            </CardTitle>
            <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {totalsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {totals.totalPublished}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span>Delivered to feeds</span>
                  <Link href="/content?status=published" className="text-primary hover:underline ml-auto font-medium">
                    Log &rarr;
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* 3. Attention Needed / Failed Card */}
        <Card className={`surface-card ${totals.totalFailed > 0 ? "border-red-300 dark:border-red-900 bg-red-50/20 dark:bg-red-950/10" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Attention Needed
            </CardTitle>
            <div className={`size-8 rounded-lg flex items-center justify-center ${totals.totalFailed > 0 ? "bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400" : "bg-muted text-muted-foreground"}`}>
              <AlertTriangle className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {totalsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${totals.totalFailed > 0 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
                  {totals.totalFailed}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {totals.totalFailed > 0 ? (
                    <Link href="/content?status=failed" className="text-red-600 dark:text-red-400 font-semibold hover:underline">
                      Review & retry failed posts &rarr;
                    </Link>
                  ) : (
                    <span>All systems healthy</span>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* 4. Drafts Card */}
        <Card className="surface-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Saved Drafts
            </CardTitle>
            <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <FileText className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {totalsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {totals.totalDrafts}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span>In-progress posts</span>
                  <Link href="/content?status=draft" className="text-primary hover:underline ml-auto font-medium">
                    Open &rarr;
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Two-Column Operations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Publishing Queue (7 of 12 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="surface-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
              <div>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Clock className="size-4.5 text-primary" />
                  <span>Upcoming Queue</span>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Next posts in line to be published chronologically
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-primary font-medium hover:underline">
                <Link href="/schedule">View Full Calendar &rarr;</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {queueLoading ? (
                <div className="p-4 space-y-3">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              ) : queuedPosts.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
                    <Clock className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Your publishing queue is clear</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mt-1">
                      No posts currently scheduled. Keep your audience engaged by scheduling your next post.
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => setIsCreateOpen(true)}
                    className="mt-2 bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90"
                  >
                    <Plus className="size-3.5 mr-1.5" />
                    Schedule a Post
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {queuedPosts.slice(0, 6).map((post) => {
                    const channel = post.user_channels?.channel_types;
                    const Icon = getChannelIcon(channel?.type || undefined);
                    const channelColor = channel?.color || "#2563EB";

                    return (
                      <div 
                        key={post.id}
                        className="p-4 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {/* Channel Badge Indicator */}
                          <div 
                            className="size-9 rounded-lg flex items-center justify-center shrink-0 text-white font-bold shadow-xs mt-0.5"
                            style={{ backgroundColor: channelColor }}
                            title={channel?.name || "Channel"}
                          >
                            {Icon ? (
                              <HugeiconsIcon icon={Icon} className="size-5" color="currentColor" />
                            ) : (
                              <span className="text-xs uppercase">{channel?.name?.[0] || "P"}</span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-foreground">
                                {post.user_channels?.handle || channel?.name}
                              </span>
                              <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0 h-5 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-900">
                                {formatPostTime(post.scheduled_at)}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground/90 line-clamp-2 mt-1 font-normal">
                              {post.content}
                            </p>
                            {post.images && post.images.length > 0 && (
                              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
                                <ImageIcon className="size-3" />
                                <span>{post.images.length} media item{post.images.length > 1 ? "s" : ""} attached</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button 
                          asChild
                          variant="outline" 
                          size="sm"
                          className="shrink-0 text-xs h-8 px-2.5"
                        >
                          <Link href={`/schedule?view=list`}>
                            Manage
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Log */}
          <Card className="surface-card">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Recently Published Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {publishedLoading ? (
                <div className="p-4 space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : recentPublished.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No recently published posts to display yet.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {recentPublished.map((post) => {
                    const channel = post.user_channels?.channel_types;
                    return (
                      <div key={post.id} className="p-3.5 px-4 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span 
                            className="size-2 rounded-full shrink-0" 
                            style={{ backgroundColor: channel?.color || "#16A34A" }} 
                          />
                          <span className="font-semibold text-foreground truncate max-w-[120px]">
                            {post.user_channels?.handle || channel?.name}
                          </span>
                          <span className="text-muted-foreground truncate max-w-[280px]">
                            {post.content}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-[11px] shrink-0">
                          {formatPostTime(post.scheduled_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Channel Health & Fast Action Hub (5 of 12 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Channel Health Status */}
          <Card className="surface-card">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Radio className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Channel Connections</span>
                </CardTitle>
                <Link 
                  href="/settings"
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  Manage
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {channelsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ) : connectedChannels.length === 0 ? (
                <div className="p-4 text-center rounded-lg border border-dashed border-border bg-muted/20">
                  <p className="text-xs font-semibold text-foreground">No channels connected yet</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Connect your Twitter, LinkedIn, or Facebook account to start scheduling.
                  </p>
                  <Button asChild size="sm" variant="outline" className="mt-3 text-xs w-full">
                    <Link href="/settings">
                      Connect First Channel
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {connectedChannels.map((channel) => {
                    const url = getChannelUrl(channel.type);
                    return (
                      <div 
                        key={channel.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <ChannelAvatar
                            size="sm"
                            type={channel.type}
                            color={channel.color}
                            profileImage={channel.profile_image}
                            name={channel.handle || channel.name}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {channel.handle || channel.name}
                            </p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              Active & Synchronized
                            </p>
                          </div>
                        </div>

                        <a 
                          href={`${url}/${channel.handle}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground p-1"
                          title="Open Profile"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Publishing Workflow Shortcuts */}
          <Card className="surface-card">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span>Publishing Shortcuts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <Plus className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      Compose New Post
                    </p>
                    <p className="text-[11px] text-muted-foreground">Draft or schedule immediately</p>
                  </div>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground" />
              </button>

              <Link
                href="/schedule"
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Calendar className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      Content Calendar
                    </p>
                    <p className="text-[11px] text-muted-foreground">Month and week timeline grid</p>
                  </div>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground" />
              </Link>

              <Link
                href="/ideas"
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      AI Ideas Kanban
                    </p>
                    <p className="text-[11px] text-muted-foreground">Brainstorm and generate topics</p>
                  </div>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground" />
              </Link>

              <Link
                href="/media"
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <ImageIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      Media Library
                    </p>
                    <p className="text-[11px] text-muted-foreground">Browse uploaded assets</p>
                  </div>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Composer */}
      <CreatePostDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
