"use client"
import React, { useEffect, useMemo, useState } from "react";
import { format, parse, set } from "date-fns"
import { getChannelIcon } from "@/constants/channels";
import { ChannelType } from "@/types/channel.type";
import { ImageObject } from "@/types/post.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Lightbulb, ScanEye, Wand2 } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { toggleVariants } from "../ui/toggle";
import ContentTextarea from "../content-textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { HugeiconsIcon } from "@hugeicons/react";
import IdeasList from "./ideas-list";
import PreviewPanel from "./preview";
import { ButtonGroup } from "../ui/button-group";
import { POST_STATUS, PostStatus } from "@/constants/post";
import { ScheduleDatePicker } from "./schedule-date-picker";
import Link from "next/link";
import { Spinner } from "../ui/spinner";
import { AIAssistant } from "./ai-assitant";

type PropsType = {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedDate?: Date | null
}

type ChannelContent = {
    text: string
    images: ImageObject[]
}

type ActionTabType = "ideas" | "ai" | "preview"

const rightTabs = [
    { id: "ideas" as ActionTabType, label: "Ideas", icon: Lightbulb },
    { id: "ai" as ActionTabType, label: "AI Assistant", icon: Wand2 },
    { id: "preview" as ActionTabType, label: "Preview", icon: ScanEye },
]

const CreatePostDialog = ({ open, onOpenChange, selectedDate }: PropsType) => {

    const queryClient = useQueryClient();
    const [globalContent, setGlobalContent] = useState<ChannelContent>({ text: "", images: [] })
    const [channelContent, setChannelContent] = useState<Record<string, ChannelContent>>({})
    const [selectedChannels, setSelectedChannels] = useState<string[]>([])
    const [selectedRightTab, setSelectedRightTab] = useState<ActionTabType | null>(null)
    const [activePreview, setActivePreview] = useState<string>("")
    const [activeAccordion, setActiveAccordion] = useState<string>("")
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [timeSlot, setTimeSlot] = useState<string>("")

    const { data, isPending } = useQuery({
        queryKey: ["channels"],
        queryFn: async () => {
            const res = await fetch("/api/channel");
            const data = await res.json();
            return data
        },
    });

    const channelsData = data?.channels
    const hasConnectedChannel = data?.connectedCount > 0

    const channels = useMemo(() => {
        if (isPending) {
            return []
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (channelsData || []).map((channel: any) => ({
            ...channel,
            icon: getChannelIcon(channel.type)
        })) as ChannelType[]
    }, [isPending, channelsData])

     useEffect(() => {
       if(selectedDate){
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDate(selectedDate)
       }
    }, [selectedDate])

    useEffect(() => {
        if (channels.length > 0 && Object.keys(channelContent).length === 0) {
            const initialContent: Record<string, ChannelContent> = {}
            channels.forEach(channel => {
                initialContent[channel.id] = { text: "", images: [] }
            })
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setChannelContent(initialContent)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channels])

    const connectedChannels = channels.filter(channel => channel.connected);
    const selectedChannelsList = channels.filter((channel) => selectedChannels.includes(channel.id))
    const previewChannel = channels.find((c) => c.id === activePreview) || selectedChannelsList[0] || connectedChannels[0] || null;
    const previewContent = channelContent?.[activePreview || previewChannel?.id || ""] ?? (globalContent.text ? globalContent : { text: "", images: [] })

    const isContentValid = selectedChannelsList.length > 0 && selectedChannelsList.every((ch) => {
        const content = channelContent[ch.id];
        return Boolean(content?.text?.trim() || content?.images?.length || globalContent.text?.trim() || globalContent.images?.length);
    });

    const createPostMutation = useMutation({
        mutationFn: async ({ posts, scheduledAt, status }:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { posts: any[], scheduledAt: string, status?: PostStatus }) => {
            const response = await fetch("/api/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    posts,
                    scheduledAt,
                    status
                })
            });
            if (!response.ok) {
                throw new Error("Failed to create posts");
            }
            return response.json();
        },
        onSuccess: (data, variables) => {
            toast.success(`${data.posts.length} post(s) ${variables.status === POST_STATUS.DRAFT ? 'saved to draft' : 'scheduled'} successfully`);
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "posts",
            });
            handleOpenChange(false)
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            console.log("failed to create post", error)
            toast.error("Failed to save post")
        }
    })

    const handleSelectRightTab = (tab: ActionTabType) => {
        setSelectedRightTab((prev) => {
            const next = prev === tab ? null : tab;
            if (next === "preview" && !activePreview) {
                const defaultId = selectedChannels[0] || connectedChannels[0]?.id || "";
                if (defaultId) setActivePreview(defaultId);
            }
            return next;
        });
    }

    const handleSelectAll = () => {
        setSelectedChannels((prev) => {
            if (prev.length === connectedChannels.length) {
                setActivePreview("")
                return []
            }

            setChannelContent((prev) => {
                const update = { ...prev }
                connectedChannels.forEach((channel) => {
                    if (!update[channel.id]?.text && globalContent.text) {
                        const limit = Number(channel.character_limit);

                        update[channel.id] = {
                            text: globalContent.text.slice(0, limit),
                            images: [...globalContent.images]
                        }
                    } else if (!update[channel.id]) {
                        update[channel.id] = { text: "", images: [] }
                    }
                })
                return update;
            })
            return connectedChannels.map(channel => channel.id)
        })
    }

    const handleGlobalContentChange = (text: string, images?: ImageObject[]) => {
        setGlobalContent((prev) => ({
            ...prev,
            text,
            images: images || prev.images
        }))
    }

    const handleAccordionChange = (value: string) => {
        setActiveAccordion(value)
        setActivePreview(value)
    }

    const handleTextChange = (
        channelId: string,
        text: string,
        character_limit: number
    ) => {
        const limit = Number(character_limit);
        if (text.length <= limit) {
            setChannelContent((prev) => ({
                ...prev,
                [channelId]: {
                    ...prev[channelId],
                    text
                }
            }))
        }
    }

    const toggleChannel = (channelId: string, character_limit: number) => {
        setSelectedChannels((prev) => {
            if (prev.includes(channelId) && activePreview === channelId) setActivePreview("")
            const isSelected = prev.includes(channelId);

            const newChannels = isSelected ? prev.filter((id) => id != channelId) : [...prev, channelId];

            if (!isSelected) {
                if (globalContent.text && !channelContent[channelId]?.text) {
                    const limit = Number(character_limit);
                    setChannelContent((prev) => ({
                        ...prev,
                        [channelId]: {
                            ...prev[channelId],
                            text: globalContent.text.slice(0, limit),
                            images: [...globalContent.images]
                        }
                    }))
                }
            } else {
                setChannelContent((prev) => ({
                    ...prev,
                    [channelId]: { text: "", images: [] }
                }))
            }
            return newChannels;
        })

        if (!selectedChannels.includes(channelId)) {
            setActiveAccordion(channelId)
            setActivePreview(channelId)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleIdeaSelect = (idea: any) => {
        if (!hasConnectedChannel) {
            toast.error("Connect at least one channel to add idea")
            return
        }
        if (selectedChannels.length === 0) {
            setGlobalContent({
                text: idea.title + "\n\n" + idea.description,
                images: idea.images || []
            })
            return
        }
        setChannelContent((prev) => {
            return ({
                ...prev,
                [activeAccordion]: {
                    text: idea.title + "\n\n" + idea.description,
                    images: idea.images || []
                }
            })
        })
    }

    const handleCreatePost = (status?: PostStatus, publishNow: boolean = false) => {
        if (selectedChannels.length === 0) {
            toast.error("Select at least one channel")
            return;
        }
        const postToCreate = selectedChannelsList.map((channel) => {
            const content = channelContent[channel.id] ?? { text: "", images: [] }
            return {
                channelTypeId: channel.id,
                content: content.text,
                images: content.images
            }
        })
        if (postToCreate.some((post) => !post.content)) {
            toast.error("Each selected channel must have content")
            return
        }

        let scheduleAt: Date;
        if (publishNow || status === POST_STATUS.DRAFT) {
            scheduleAt = new Date();
        } else {
            const parsedTime = parse(timeSlot, "h:mm a", new Date());
            scheduleAt = set(date || new Date(), {
                hours: parsedTime.getHours(),
                minutes: parsedTime.getMinutes(),
                seconds: 0,
                milliseconds: 0
            })
        }

        createPostMutation.mutate({
            posts: postToCreate,
            scheduledAt: scheduleAt.toISOString(),
            status
        })
    }

    const handleOpenChange = (open: boolean) => {
        onOpenChange(open);
        setGlobalContent({ text: "", images: [] });
        setChannelContent({});
        setActiveAccordion("")
        setActivePreview("")
        setSelectedRightTab(null)
        setDate(new Date())
        setTimeSlot("")
        setSelectedChannels([])
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className={cn(
                "sm:w-full sm:min-w-[700px] gap-0 px-0 pt-0 pb-0",
                selectedRightTab && "sm:max-w-[950px]"
            )}>
                <div>
                    <DialogHeader className="px-8 py-3 border-b">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="font-semibold">Create Post</DialogTitle>
                            <div className="flex items-center gap-px">
                                {rightTabs.map((tab) => (
                                    <Button
                                        key={tab.id}
                                        variant={selectedRightTab === tab.id ? "default" : "ghost"}
                                        className={cn(!selectedRightTab && "size-8")}
                                        onClick={() => handleSelectRightTab(tab.id)}
                                    >
                                        <tab.icon className="size-4" />
                                        <span className={cn(!selectedRightTab && "hidden")}> {tab.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="w-full flex flex-1 min-w-0 overflow-hidden h-[580px]">

                        { }
                        <div className="flex flex-1 flex-col min-w-0 w-[300px] pb-5">
                            <div className="channel--selector py-5  px-8">
                                {channels?.length > 0 && !isPending && (
                                    <button
                                        className="mb-4 text-[13px] font-medium cursor-pointer"
                                        onClick={handleSelectAll}
                                    >
                                        {selectedChannels.length === connectedChannels.length ? "Unselect all" : "Select all"}
                                    </button>
                                )}
                                <div className="flex flex-wrap gap-2.5">
                                    {isPending ? (
                                        Array.from({ length: 4 }).map((_, index) => (
                                            <Skeleton key={index} className="h-9 w-28 rounded-xl" />
                                        ))
                                    ) : (
                                        channels?.map((channel) => {
                                            const selected = selectedChannels.includes(channel.id)
                                            const isConnected = channel.connected
                                            const Icon = getChannelIcon(channel.type)
                                            return (
                                                <Tooltip key={channel.id}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            type="button"
                                                            style={{ "--channel-color": channel.color } as React.CSSProperties}
                                                            className={cn(
                                                                "relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all select-none",
                                                                !isConnected 
                                                                    ? "border-dashed border-border/80 text-muted-foreground/60 bg-muted/20 opacity-60 cursor-not-allowed" 
                                                                    : selected 
                                                                        ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20 shadow-xs cursor-pointer" 
                                                                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
                                                            )}
                                                            onClick={() => {
                                                                if (!isConnected) {
                                                                    toast.error(`Please connect ${channel.name} in Settings first`);
                                                                    return;
                                                                }
                                                                toggleChannel(channel.id, channel.character_limit);
                                                            }}
                                                        >
                                                            <div 
                                                                className="size-5 rounded-md flex items-center justify-center text-white shrink-0"
                                                                style={{ backgroundColor: isConnected ? channel.color : "#94A3B8" }}
                                                            >
                                                                {Icon ? (
                                                                    <HugeiconsIcon icon={Icon} className="size-3.5" color="currentColor" />
                                                                ) : (
                                                                    <span className="text-[10px] font-bold">{channel.name?.[0] || "P"}</span>
                                                                )}
                                                            </div>
                                                            <span className="truncate max-w-[90px]">{channel.handle || channel.name || "Channel"}</span>
                                                            {selected && (
                                                                <span className="size-1.5 rounded-full bg-primary shrink-0" />
                                                            )}
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {isConnected ? (
                                                            <span>{selected ? "Click to deselect" : `Select ${channel.name}`}</span>
                                                        ) : (
                                                            <span>{channel.name} (Not connected) — Connect in Settings</span>
                                                        )}
                                                    </TooltipContent>
                                                </Tooltip>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="channel--content relative
                                        flex flex-col px-8 min-h-[300px]
                                        h-full overflow-y-auto">
                                {selectedChannels.length === 0 ? (
                                    <div className="border rounded-xl p-4">
                                        <ContentTextarea
                                            value={globalContent?.text || ""}
                                            images={globalContent?.images || []}
                                            placeholder="Write your main content here..
        . It will be copied to channels when you select them"
                                            minHeight={270}
                                            showAIAssistant={true}
                                            disabled={!hasConnectedChannel}
                                            contentClass="text-sm placeholder:opacity-50 pt-0!"
                                            onChange={(text) => handleGlobalContentChange(text)}
                                            onImagesChange={(images) =>
                                                handleGlobalContentChange(globalContent.text, images)
                                            }
                                        />
                                    </div>
                                ) : (
                                    <Accordion
                                        type="single"
                                        collapsible
                                        value={activeAccordion}
                                        className="w-full space-y-3"
                                        onValueChange={(val) => {
                                            handleAccordionChange(val)
                                        }}
                                    >
                                        {selectedChannelsList?.map((channel) => {
                                            const content = channelContent[channel.id] || { text: "", images: [] };
                                            const isExpanded = activeAccordion === channel.id;
                                            const icon = getChannelIcon(channel.type);
                                            return (
                                                <AccordionItem
                                                    key={channel.id}
                                                    value={channel.id}
                                                    className="border rounded-xl"
                                                >
                                                    {!isExpanded && (
                                                        <AccordionTrigger
                                                            className="w-full px-3 cursor-pointer [&>svg]:hidden! hover:bg-muted
hover:no-underline! justify-start gap-3
"
                                                        >
                                                            <span>
                                                                <HugeiconsIcon
                                                                    icon={icon}
                                                                    className={cn(
                                                                        "shrink-0 text-white! size-5! p-[3px] rounded-sm",
                                                                    )}
                                                                    style={{ background: channel.color }}
                                                                />
                                                            </span>
                                                            {content.text ? (
                                                                <p className="text-sm text-muted-foreground/80
truncate flex-1 text-left max-w-[400px]">
                                                                    {content.text}
                                                                </p>
                                                            ) : (
                                                                <p className="text-sm tex-muted">What would you like to share</p>
                                                            )}
                                                        </AccordionTrigger>
                                                    )}

                                                    <AccordionContent className="overflow-visible">
                                                        <div className="flex pt-3 px-3 gap-3">
                                                            {isExpanded && (
                                                                <span>
                                                                    <HugeiconsIcon
                                                                        icon={icon}
                                                                        className={cn(
                                                                            "shrink-0 text-white! size-5! p-[3px] rounded-sm",
                                                                        )}
                                                                        style={{ background: channel.color }}
                                                                    />
                                                                </span>
                                                            )}

                                                            <div className="flex-1">
                                                                {!content?.text && (
                                                                    <div className="w-full flex items-center gap-2 rounded-md
bg-[#ffefd0] px-3 py-1 text-xs text-amber-700
dark:bg-amber-950/40
dark:text-amber-400">
                                                                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                                                        <p>Please include at least some text or an attachment.</p>
                                                                    </div>
                                                                )}

                                                                <ContentTextarea
                                                                    value={content?.text || ""}
                                                                    images={content?.images || []}
                                                                    placeholder="Start writing or get inspired by AI"
                                                                    minHeight={260}
                                                                    contentClass="text-sm placeholder:opacity-50 pt-0"
                                                                    showAIAssistant={true}
                                                                    disabled={!channel.connected}
                                                                    onAIAssistantClick={() => {
                                                                        setSelectedRightTab("ai")
                                                                    }}
                                                                    onChange={(text) => handleTextChange(
                                                                        channel.id, text, channel.character_limit
                                                                    )}
                                                                    onImagesChange={(images) => {
                                                                        setChannelContent((prev) => (
                                                                            {
                                                                                ...prev,
                                                                                [channel.id]: {
                                                                                    ...content,
                                                                                    images,
                                                                                }
                                                                            }
                                                                        ))
                                                                    }}

                                                                    renderToolbarRight={
                                                                        <div className="flex items-center gap-3">
                                                                            <span className={cn(
                                                                                "text-[10px] font-medium px-2 py-0.5 rounded-full",
                                                                                (content?.text?.length || 0) >= Number(channel.character_limit) * 0.9
                                                                                    ? "bg-orange-100 text-orange-600"
                                                                                    : "bg-muted text-muted-foreground"
                                                                            )}>
                                                                                {content?.text?.length || 0} / {channel.character_limit}
                                                                            </span>
                                                                        </div>
                                                                    }

                                                                />
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        })}
                                    </Accordion>
                                )}

                            </div>
                        </div>

                        { }
                        {selectedRightTab && (
                            <div className="w-[350px] flex flex-col shrink-0 border-l border-border
            bg-muted/30 h-full
            ">
                                <div className="py-4 flex-1 flex flex-col h-full">
                                    {selectedRightTab === "ai" && (
                                        <div className="px-6">
                                            <AIAssistant
                            content={channelContent[activeAccordion]?.text ||
                                globalContent?.text || ""
                            }
                            channelId={activeAccordion}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onGenerate={(content:any) => {
                                if(globalContent?.text){
                                    setGlobalContent((prev) => ({
                                        ...prev,
                                        text: content,
                                    }))
                                }
                                setChannelContent((prev) => ({
                                ...prev,
                                [activeAccordion]: {
                                    ...prev[activeAccordion],
                                    text: content,
                                }
                                }))
                            }}
                        />
                                        </div>
                                    )}

                                    {selectedRightTab === "ideas" && (
                                        <IdeasList
                                            onSelect={handleIdeaSelect}
                                        />
                                    )}

                                    {selectedRightTab === "preview" && (
                                        <PreviewPanel
                                            channel={previewChannel}
                                            channels={selectedChannelsList.length > 0 ? selectedChannelsList : connectedChannels}
                                            onSelectChannel={(chId) => {
                                                setActivePreview(chId);
                                                setActiveAccordion(chId);
                                            }}
                                            content={previewContent}
                                        />
                                    )}
                                </div>
                            </div>

                        )}

                    </div>
                </div>

                {/* Publishing Summary & Validation Status Bar */}
                {hasConnectedChannel && (
                    <div className="px-8 py-2.5 border-t border-border/70 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="font-semibold text-foreground text-xs">Publishing Targets:</span>
                            {selectedChannelsList.length === 0 ? (
                                <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                                    <AlertTriangle className="size-3" /> Select at least one channel above
                                </span>
                            ) : (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {selectedChannelsList.map((ch) => (
                                        <span
                                            key={ch.id}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-white shadow-2xs"
                                            style={{ backgroundColor: ch.color || "#2563EB" }}
                                        >
                                            {ch.handle || ch.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground text-xs self-end sm:self-auto shrink-0">
                            {selectedChannelsList.length > 0 && (
                                <span className={cn(
                                    "font-medium flex items-center gap-1",
                                    isContentValid ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-amber-600 dark:text-amber-400"
                                )}>
                                    {isContentValid ? (
                                        <>
                                            <CheckCircle2 className="size-3.5" /> All content valid
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="size-3.5" /> Text needed
                                        </>
                                    )}
                                </span>
                            )}
                            <span className="text-[11px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded border border-border/70">
                                {date ? format(date, "MMM d") : ""} {timeSlot ? `@ ${timeSlot}` : "Draft / Now"}
                            </span>
                        </div>
                    </div>
                )}

                <DialogFooter className="px-8 py-3.5 border-t border-border bg-card/60 flex flex-row items-center justify-between gap-3 m-0!">
                    {hasConnectedChannel ? (
                        <div className="w-full flex items-center justify-between gap-3">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground hover:text-foreground font-medium text-xs h-9 px-3"
                                disabled={createPostMutation.isPending}
                                onClick={() => handleCreatePost(POST_STATUS.DRAFT)}
                            >
                                {createPostMutation.isPending && createPostMutation.variables?.status === POST_STATUS.DRAFT && <Spinner className="mr-1.5 size-3.5" />}
                                Save Draft
                            </Button>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="font-medium text-xs h-9 px-3.5 border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                                    disabled={createPostMutation.isPending || selectedChannels.length === 0}
                                    onClick={() => handleCreatePost(undefined, true)}
                                >
                                    {createPostMutation.isPending && createPostMutation.variables?.status === undefined && !timeSlot && <Spinner className="mr-1.5 size-3.5" />}
                                    Publish Now
                                </Button>
                                <ButtonGroup className="p-0!">
                                    <ScheduleDatePicker
                                        date={date}
                                        setDate={setDate}
                                        time={timeSlot}
                                        setTime={setTimeSlot}
                                        renderButton={(isDatePassed, isTimeNotAvailable) => (
                                            <Button
                                                size="sm"
                                                className="shadow-xs font-semibold text-xs h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                                                disabled={createPostMutation.isPending || !date || !timeSlot || isDatePassed || isTimeNotAvailable}
                                                onClick={() => {
                                                    if (isDatePassed || isTimeNotAvailable) {
                                                        toast.error("Please select a valid date and time")
                                                        return;
                                                    }
                                                    handleCreatePost()
                                                }}
                                            >
                                                {createPostMutation.isPending && createPostMutation.variables?.status === undefined && timeSlot && <Spinner className="mr-1.5 size-3.5" />}
                                                Schedule Post
                                            </Button>
                                        )}
                                    />
                                </ButtonGroup>
                            </div>
                        </div>
                    ) : (
                        <Button size="sm" className="h-9 px-4 text-xs font-semibold" asChild>
                            <Link href="/settings?tab=channels">Connect Channel to Post</Link>
                        </Button>
                    )}
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}

export default CreatePostDialog
