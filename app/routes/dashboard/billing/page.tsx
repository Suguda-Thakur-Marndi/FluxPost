"use client"
import { ClerkLoaded, ClerkLoading, PricingTable } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, CreditCard, Layers, Send, Sparkles, Zap } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

const BillingPage = () => {
  const { data: totalsData, isPending: isTotalsPending } = useQuery({
    queryKey: ["posts", "totals"],
    queryFn: async () => {
      const res = await fetch("/api/post/totals")
      if (!res.ok) return { totalPosts: 0, totalQueue: 0, totalPublished: 0, totalDrafts: 0 }
      return res.json()
    },
  })

  const { data: channelsData, isPending: isChannelsPending } = useQuery({
    queryKey: ["channels-connected"],
    queryFn: async () => {
      const res = await fetch("/api/channel?filter=connected")
      if (!res.ok) return { channels: [] }
      return res.json()
    },
  })

  const totalPosts = totalsData?.totalPosts || 0
  const connectedCount = channelsData?.channels?.length || 0
  const maxFreePosts = 4
  const postProgress = Math.min(100, Math.round((totalPosts / maxFreePosts) * 100))

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 space-y-6">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Billing & Subscription
            </h1>
            <Badge variant="outline" className="text-xs font-semibold border-border bg-muted/40">
              Plans
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your workspace plan, review current usage quotas, and upgrade for unlimited publishing.
          </p>
        </div>

        {/* Quota & Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="surface-card">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Tier</span>
                <Badge variant="outline" className="text-[10px] font-semibold bg-primary/10 text-primary border-primary/20">
                  Active
                </Badge>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="size-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">Starter Workspace</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Individual creator plan with standard scheduling & multi-channel draft composer.
                </p>
              </div>
              <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Renews automatically via Clerk</span>
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Post Quota</span>
                <span className="text-xs font-semibold text-foreground">
                  {isTotalsPending ? "..." : `${totalPosts} / ${maxFreePosts}`}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Send className="size-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">Scheduled Posts</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${postProgress}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {totalPosts >= maxFreePosts 
                      ? "Limit reached on free tier. Upgrade for unlimited scheduling."
                      : `${maxFreePosts - totalPosts} posts remaining in standard tier.`}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500" />
                <span>Unlimited on Pro & Team</span>
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Channels</span>
                <span className="text-xs font-semibold text-foreground">
                  {isChannelsPending ? "..." : `${connectedCount} / 8`}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="size-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">Social Accounts</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.round((connectedCount / 8) * 100)}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    8 channels supported (Twitter, LinkedIn, TikTok, IG, FB, Threads, Bluesky, YT).
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" />
                <span>Multi-account sync included</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Table Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Select a Plan</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose the tier that matches your publishing frequency and team collaboration needs.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-4 md:p-6 shadow-2xs overflow-hidden">
            <ClerkLoading>
              <div className="flex flex-col items-center justify-center h-72 gap-3">
                <Spinner className="size-6 text-primary" />
                <span className="text-xs text-muted-foreground">Loading available plans...</span>
              </div>
            </ClerkLoading>

            <ClerkLoaded>
              <div className="w-full clerk-pricing-wrapper">
                <PricingTable
                  for="user"
                  newSubscriptionRedirectUrl="/billing"
                />
              </div>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingPage