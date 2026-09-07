
"use client"
import { Suspense, useEffect } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { ChannelType } from '@/types/channel.type'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { getChannelIcon } from '@/constants/channels'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { AlertCircle, CheckCircle2, Globe, Link2, RefreshCw, Unlink } from 'lucide-react'

function ChannelTabContent() {
    const searchParams = useSearchParams()
    const queryClient = useQueryClient()

    const { data: channelsData, isPending } = useQuery({
        queryKey: ["channels"],
        queryFn: async () => {
            const res = await fetch("/api/channel")
            const data = await res.json()
            return data
        }
    })
    const channels = (channelsData?.channels || []) as ChannelType[]

    const errorParam = searchParams.get("error")
    const connectedParam = searchParams.get("connected")
    const channelTypeParam = searchParams.get("channelType")

    useEffect(() => {
        if (!connectedParam && !errorParam) return
        queryClient.invalidateQueries({ queryKey: ["channels"] })
        if (connectedParam) {
            toast.success(`Successfully connected to ${channelTypeParam || "channel"}`)
        }
        if (errorParam) {
            toast.error(`Connection failed: ${channelTypeParam || "channel"}`)
        }
    }, [queryClient, searchParams, connectedParam, errorParam, channelTypeParam])

    const connectMutation = useMutation({
        mutationFn: async (channelTypeId: string) => {
            const res = await fetch("/api/channel/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ channelTypeId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to start connection")
            return data
        },
        onSuccess: ({ url }) => {
            window.location.href = url
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to start connection")
        },
    })

    const disconnectMutation = useMutation({
        mutationFn: async (userChannelId: string) => {
            const res = await fetch("/api/channel/disconnect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userChannelId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to disconnect channel")
            return data
        },
        onSuccess: () => {
            toast.success("Channel disconnected successfully")
            queryClient.invalidateQueries({ queryKey: ["channels"] })
        },
        onError: (error: Error) => {
            console.error("Disconnect error:", error)
            toast.error("Failed to disconnect channel")
        },
    })

    const handleConnect = (channelTypeId: string) => {
        if (!channelTypeId) return
        if (connectMutation.isPending) return
        connectMutation.mutate(channelTypeId)
    }

    const handleDisconnect = (userChannelId: string) => {
        if (!userChannelId) return
        if (disconnectMutation.isPending) return
        disconnectMutation.mutate(userChannelId)
    }

    const connectedCount = channels.filter(c => c.connected).length

    return (
        <Card className="surface-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-semibold tracking-tight">Connected Accounts</CardTitle>
                        <Badge variant="outline" className="text-xs font-semibold border-border">
                            {connectedCount} of {channels.length} Active
                        </Badge>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground mt-1">
                        Connect your social platforms to schedule and publish content seamlessly across networks.
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {errorParam && (
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-xs">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">OAuth authorization was not completed</p>
                            <p className="text-muted-foreground mt-0.5">
                                Please check that popup blockers are disabled and verify that your account has administrator rights for this channel.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isPending ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex flex-col justify-between p-5 rounded-xl border border-border bg-card space-y-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-10 rounded-xl" />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-8 w-24 rounded-lg" />
                                </div>
                            </div>
                        ))
                    ) : (
                        channels?.map((channel) => {
                            const icon = getChannelIcon(channel.type)
                            const isConnecting = connectMutation.isPending && connectMutation.variables === channel.id
                            const isDisconnecting = disconnectMutation.isPending && disconnectMutation.variables === channel.user_channel_id

                            return (
                                <div
                                    key={channel.id}
                                    className="group relative flex flex-col justify-between p-5 rounded-xl border border-border/80 bg-card hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex items-center gap-3">
                                              <div
                                                  className="size-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                                                  style={{ backgroundColor: channel.color || "var(--primary)" }}
                                              >
                                                  {icon ? (
                                                      <HugeiconsIcon icon={icon} color="currentColor" className="size-5 text-white" />
                                                  ) : (
                                                      <Globe className="size-5 text-white" />
                                                  )}
                                              </div>
                                              <div>
                                                  <div className="flex items-center gap-2">
                                                      <h3 className="text-sm font-semibold text-foreground">{channel.name}</h3>
                                                      {channel.connected && (
                                                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1">
                                                              <span className="size-1 rounded-full bg-emerald-500" />
                                                              Connected
                                                          </Badge>
                                                      )}
                                                  </div>
                                                  <p className="text-xs text-muted-foreground mt-0.5">
                                                      {channel.connected ? (
                                                          <span className="font-medium text-foreground/80">{channel.handle || "Account verified"}</span>
                                                      ) : (
                                                          "Not connected"
                                                      )}
                                                  </p>
                                              </div>
                                          </div>

                                          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-normal text-muted-foreground">
                                              {Number(channel.character_limit).toLocaleString()} chars
                                          </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
                                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                            {channel.connected ? (
                                                <>
                                                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                                                    <span>Ready to publish</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Unlink className="size-3.5 text-muted-foreground/60" />
                                                    <span>Requires authorization</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {channel.connected ? (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                                                        disabled={isConnecting || isDisconnecting}
                                                        onClick={() => handleConnect(channel.id)}
                                                        title="Reconnect channel OAuth"
                                                    >
                                                        <RefreshCw className="size-3 mr-1" />
                                                        Reconnect
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive border-border hover:border-destructive/30 rounded-lg transition-all"
                                                        disabled={isConnecting || isDisconnecting}
                                                        onClick={() => handleDisconnect(channel.user_channel_id!)}
                                                    >
                                                        {isDisconnecting ? <Spinner className="size-3 mr-1.5" /> : null}
                                                        Disconnect
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="h-8 px-3.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-2xs gap-1.5 transition-all"
                                                    disabled={isConnecting || isDisconnecting}
                                                    onClick={() => handleConnect(channel.id)}
                                                >
                                                    {isConnecting ? <Spinner className="size-3 mr-1.5" /> : <Link2 className="size-3.5" />}
                                                    Connect Channel
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

const ChannelsTab = () => {
    return (
        <Suspense fallback={<div className="text-xs text-muted-foreground py-8 text-center">Loading channels...</div>}>
            <ChannelTabContent />
        </Suspense>
    )
}

export default ChannelsTab
