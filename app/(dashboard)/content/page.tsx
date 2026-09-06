"use client"

import { Suspense, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { format, parseISO } from "date-fns";
import { 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  RotateCcw, 
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreatePostDialog from "@/components/schedule/create-post-dialog";
import { getChannelIcon } from "@/constants/channels";
import { ChannelType } from "@/types/channel.type";
import { PostType } from "@/types/post.type";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

type StatusTab = "all" | "queue" | "draft" | "published" | "failed";

function ContentPageContent() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useQueryState("status", { defaultValue: "all" });
  const [searchQuery, setSearchQuery] = useQueryState("q", { defaultValue: "" });
  const [selectedChannelId, setSelectedChannelId] = useQueryState("channel", { defaultValue: "" });
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTargetPost, setDeleteTargetPost] = useState<PostType | null>(null);

  // Fetch Totals for Tab Badges
  const { data: totalsData } = useQuery({
    queryKey: ["post-totals"],
    queryFn: async () => {
      const res = await fetch("/api/post/totals");
      if (!res.ok) throw new Error("Failed to fetch totals");
      return res.json();
    },
  });

  // Fetch Channels
  const { data: channelsData } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const res = await fetch("/api/channel");
      if (!res.ok) throw new Error("Failed to fetch channels");
      return res.json();
    },
  });

  // Fetch Posts based on tab filter
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["content-posts", activeTab, selectedChannelId],
    queryFn: async () => {
      let url = "/api/post";
      const params = new URLSearchParams();
      if (activeTab && activeTab !== "all") {
        params.append("status", activeTab);
      }
      if (selectedChannelId) {
        params.append("channelIds", selectedChannelId);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/post/${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      setDeleteTargetPost(null);
      queryClient.invalidateQueries({ queryKey: ["content-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-totals"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-queue"] });
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  // Retry Failed Post Mutation
  const retryMutation = useMutation({
    mutationFn: async (post: PostType) => {
      const res = await fetch(`/api/post/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "queue",
          scheduledAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to re-queue post");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Post re-queued for immediate publishing!");
      queryClient.invalidateQueries({ queryKey: ["content-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-totals"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-queue"] });
    },
    onError: () => {
      toast.error("Failed to re-queue post");
    },
  });

  const totals = totalsData || { totalQueue: 0, totalPublished: 0, totalFailed: 0, totalDrafts: 0 };
  const allCount = (totals.totalQueue || 0) + (totals.totalPublished || 0) + (totals.totalFailed || 0) + (totals.totalDrafts || 0);
  const channels = (channelsData?.channels || []) as ChannelType[];
  const connectedChannels = channels.filter((c) => c.connected);

  // Client-side search filter
  const filteredPosts = useMemo(() => {
    const rawPosts = (postsData?.posts || []) as PostType[];
    if (!searchQuery) return rawPosts;
    const q = searchQuery.toLowerCase();
    return rawPosts.filter((p) => 
      p.content?.toLowerCase().includes(q) ||
      p.user_channels?.handle?.toLowerCase().includes(q)
    );
  }, [postsData?.posts, searchQuery]);

  const tabs: { id: StatusTab; label: string; count: number; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "all", label: "All Posts", count: allCount, icon: Layers },
    { id: "queue", label: "Scheduled", count: totals.totalQueue, icon: Clock },
    { id: "draft", label: "Drafts", count: totals.totalDrafts, icon: FileText },
    { id: "published", label: "Published", count: totals.totalPublished, icon: CheckCircle2 },
    { id: "failed", label: "Failed", count: totals.totalFailed, icon: AlertTriangle },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Content Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage, filter, edit, and monitor all social posts across your active publishing pipeline.
          </p>
        </div>

        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 gap-1.5 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>New Post</span>
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/60 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const isFailedTab = tab.id === "failed" && tab.count > 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-xs" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              } ${isFailedTab && !isActive ? "text-red-600 dark:text-red-400 font-bold" : ""}`}
            >
              <Icon className="size-3.5 shrink-0" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isActive 
                  ? "bg-white/20 text-white" 
                  : isFailedTab 
                    ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400" 
                    : "bg-muted-foreground/15 text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Channel Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search by post text or account handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9 bg-background"
          />
        </div>

        {/* Channel Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={selectedChannelId === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedChannelId("")}
            className="text-xs h-9 px-3 rounded-lg"
          >
            All Channels
          </Button>

          {connectedChannels.map((c) => {
            const isSelected = selectedChannelId === c.id;
            return (
              <Button
                key={c.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChannelId(isSelected ? "" : c.id)}
                className="text-xs h-9 px-3 rounded-lg gap-1.5"
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.handle || c.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Posts List / Table */}
      <Card className="surface-card">
        <CardContent className="p-0">
          {postsLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
                <FileText className="size-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {searchQuery ? "No matching posts found" : activeTab === "failed" ? "No failed posts" : "No posts found in this view"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  {activeTab === "failed" 
                    ? "Great news! All scheduled publications have completed without issues." 
                    : searchQuery 
                      ? "Try searching for a different keyword or clear your filters." 
                      : "Create a draft or schedule your next publication."}
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={() => setIsCreateOpen(true)}
                className="mt-2 bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90"
              >
                <Plus className="size-3.5 mr-1.5" />
                Create New Post
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredPosts.map((post) => {
                const channel = post.user_channels?.channel_types;
                const Icon = getChannelIcon(channel?.type || undefined);
                const channelColor = channel?.color || "#2563EB";
                const isFailed = post.status === "failed";
                const isDraft = post.status === "draft";
                const isPublished = post.status === "published";
                const isQueue = post.status === "queue";

                return (
                  <div 
                    key={post.id} 
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors ${
                      isFailed ? "bg-red-50/15 dark:bg-red-950/10" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      {/* Platform Icon */}
                      <div 
                        className="size-9 rounded-lg flex items-center justify-center shrink-0 text-white font-bold shadow-xs mt-0.5"
                        style={{ backgroundColor: channelColor }}
                        title={channel?.name || "Platform"}
                      >
                        {Icon ? (
                          <HugeiconsIcon icon={Icon} className="size-5" color="currentColor" />
                        ) : (
                          <span className="text-xs uppercase">{channel?.name?.[0] || "P"}</span>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-foreground">
                            {post.user_channels?.handle || channel?.name}
                          </span>

                          {/* Status Badge */}
                          {isQueue && (
                            <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0 h-4.5 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-900 flex items-center gap-1">
                              <Clock className="size-2.5" />
                              Scheduled for {format(parseISO(post.scheduled_at), "MMM d, h:mm a")}
                            </Badge>
                          )}
                          {isPublished && (
                            <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0 h-4.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                              <CheckCircle2 className="size-2.5" />
                              Published {format(parseISO(post.scheduled_at), "MMM d, h:mm a")}
                            </Badge>
                          )}
                          {isDraft && (
                            <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0 h-4.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 flex items-center gap-1">
                              <FileText className="size-2.5" />
                              Draft
                            </Badge>
                          )}
                          {isFailed && (
                            <Badge variant="destructive" className="text-[10px] font-semibold px-2 py-0 h-4.5 flex items-center gap-1">
                              <AlertTriangle className="size-2.5" />
                              Publishing Failed
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-foreground/90 font-normal line-clamp-2">
                          {post.content}
                        </p>

                        {/* Media Attachment Thumbnails */}
                        {post.images && post.images.length > 0 && (
                          <div className="flex items-center gap-2 pt-1">
                            {post.images.slice(0, 3).map((img, idx) => (
                              <div key={idx} className="size-8 rounded-md overflow-hidden border border-border bg-muted shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} alt="Attachment" className="size-full object-cover" />
                              </div>
                            ))}
                            {post.images.length > 3 && (
                              <span className="text-[11px] text-muted-foreground font-medium">
                                +{post.images.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isFailed && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => retryMutation.mutate(post)}
                          disabled={retryMutation.isPending}
                          className="text-xs h-8 px-2.5 gap-1.5 shadow-xs"
                        >
                          <RotateCcw className="size-3.5" />
                          <span>Retry</span>
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreVertical className="size-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {isFailed && (
                            <DropdownMenuItem 
                              onClick={() => retryMutation.mutate(post)}
                              className="text-xs font-semibold text-primary cursor-pointer"
                            >
                              <RotateCcw className="size-3.5 mr-2" />
                              Retry Now
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => {
                              // Duplicate content into new composer
                              setIsCreateOpen(true);
                            }}
                            className="text-xs cursor-pointer"
                          >
                            <Layers className="size-3.5 mr-2" />
                            Duplicate Post
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setDeleteTargetPost(post)}
                            className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer"
                          >
                            <Trash2 className="size-3.5 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTargetPost} onOpenChange={(open) => !open && setDeleteTargetPost(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Delete Scheduled Post
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure you want to delete this post? This action cannot be undone and will cancel its scheduled publication.
            </DialogDescription>
          </DialogHeader>

          {deleteTargetPost && (
            <div className="p-3 rounded-lg bg-muted/40 border border-border/70 text-xs text-foreground/90 my-2 line-clamp-3">
              &ldquo;{deleteTargetPost.content}&rdquo;
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTargetPost(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteTargetPost && deleteMutation.mutate(deleteTargetPost.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}

export default function ContentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading content manager...</div>}>
      <NuqsAdapter>
        <ContentPageContent />
      </NuqsAdapter>
    </Suspense>
  );
}
