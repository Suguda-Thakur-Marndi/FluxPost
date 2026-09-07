import { useEffect, useState, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MoreHorizontal, Plus, Search, Share2, Trash2, Edit2 } from "lucide-react"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type DraggableProvidedDraggableProps,
} from "@hello-pangea/dnd"
import React from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { Input } from "../ui/input"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ImageObject } from "@/types/post.type"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import IdeaDialog from "./idea-dialog"
import { IdeaType } from "@/types/idea.type"
import { GenerateIdeasPopover } from "./generate-ideas-popover"
import CreatePostDialog from "../schedule/create-post-dialog"

type Column = {
    id: string
    title: string
    ideas: IdeaType[]
}

const IdeaKanban = () => {
    const queryClient = useQueryClient()
    const [columns, setColumns] = useState<Column[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [showIdeaDialog, setShowIdeaDialog] = useState<boolean>(false)
    const [selectedIdea, setSelectedIdea] = useState<IdeaType | null>(null)
    const [selectedColumnId, setSelectedColumnId] = useState<string>("")
    const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false)

    const { data: ideaData, isPending } = useQuery({
        queryKey: ["ideas"],
        queryFn: async () => {
            const res = await fetch("/api/idea")
            if (!res.ok) throw new Error("Failed to fetch ideas")
            return res.json()
        },
    })

    useEffect(() => {
        if (ideaData?.groups) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setColumns(ideaData.groups)
        }
    }, [ideaData])

    const saveIdeaMutation = useMutation({
        mutationFn: async (idea: IdeaType) => {
            const response = await fetch("/api/idea", {
                method: "POST",
                keepalive: true,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: idea.id,
                    title: idea.title,
                    description: idea.description,
                    groupId: idea.columnId,
                    images: idea.images,
                    sortOrder: idea.sortOrder
                })
            })
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to save idea");
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ideas"] })
        },
        onError: (error) => {
            console.error("Failed to save idea:", error)
            toast.error(error instanceof Error ? error.message : "Failed to save idea")
        }
    })

    const deleteIdeaMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/idea/${id}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Failed to delete idea")
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ideas"] })
        },
        onError: (error) => {
            console.error("Failed to delete idea", error);
            toast.error("Failed to delete idea")
        }
    })

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceColumn = columns.find(col => col.id === source.droppableId);
        const destinationColumn = columns.find(col => col.id === destination.droppableId);

        if (!sourceColumn || !destinationColumn) return;
        if (source.droppableId === destination.droppableId) {
            const newIdeas = [...sourceColumn.ideas]

            const [movedIdea] = newIdeas.splice(source.index, 1)
            movedIdea.sortOrder = destination.index;
            newIdeas.splice(destination.index, 0, movedIdea)

            const newColumns = columns.map(col =>
                col.id === sourceColumn.id ? { ...col, ideas: newIdeas } : col
            )
            setColumns(newColumns)

            saveIdeaMutation.mutate({
                ...movedIdea,
                sortOrder: destination.index
            })
        } else {
            const sourceIdeas = [...sourceColumn.ideas];
            const destIdeas = [...destinationColumn.ideas];

            const [movedIdea] = sourceIdeas.splice(source.index, 1)

            movedIdea.sortOrder = destination.index;
            movedIdea.columnId = destination.droppableId;

            destIdeas.splice(destination.index, 0, movedIdea)

            const newColumns = columns.map(col => {
                if (col.id === sourceColumn.id) {
                    return { ...col, ideas: sourceIdeas }
                }
                if (col.id === destinationColumn.id) {
                    return { ...col, ideas: destIdeas }
                }
                return col
            })

            setColumns(newColumns)

            saveIdeaMutation.mutate({
                ...movedIdea,
                columnId: destination.droppableId,
                sortOrder: destination.index
            })
        }
    }

    const handleAddIdea = (columnId: string) => {
        setSelectedIdea(null)
        setSelectedColumnId(columnId)
        setShowIdeaDialog(true)
    }

    const handleEditIdea = (idea: IdeaType, columnId: string) => {
        setSelectedIdea(idea)
        setSelectedColumnId(columnId)
        setShowIdeaDialog(true)
    }

    const handleSaveIdea = (idea: IdeaType) => {
        if (idea.id) {
            const newColumns = columns.map((col) => ({
                ...col,
                ideas: col.ideas.map((ideaCol) => (ideaCol.id === idea.id) ? {
                    ...ideaCol,
                    ...idea
                } : ideaCol)
            }))
            setColumns(newColumns)
        } else {
            const newIdea = { ...idea, id: `temp-${Date.now()}` }
            const newColumn = columns.map((col) =>
                col.id === idea.columnId ? {
                    ...col,
                    ideas: [newIdea, ...col.ideas]
                }
                    : col
            )
            setColumns(newColumn)
        }
        console.log(idea,"idea")
        saveIdeaMutation.mutate(idea, {
            onSuccess: () => {
                setSelectedIdea(null);
                setShowIdeaDialog(false)
            }
        })
    }

    const handleDeleteIdea = (columnId: string, ideaId: string) => {
        if (!ideaId) return;
        const newColumns = columns.map((col) =>
            col.id === columnId
                ? {
                    ...col,
                    ideas: col.ideas.filter((idea) => idea.id !== ideaId)
                }
                : col
        )
        setColumns(newColumns)

        if (!ideaId.startsWith('temp-')) {
            deleteIdeaMutation.mutate(ideaId)
        }
    }

    const handleGeneratedIdea = (title: string, description: string) => {
        const targetColumnId = columns[0]?.id;
        if (!targetColumnId) return;

        const newIdea: IdeaType = {
            id: `temp-${Date.now()}`,
            title,
            description,
            columnId: targetColumnId,
        };

        const newColumns = columns.map((col) =>
            col.id === targetColumnId
                ? {
                    ...col,
                    ideas: [newIdea, ...col.ideas]
                }
                : col
        )
        setColumns(newColumns);
        saveIdeaMutation.mutate({
            title: title,
            description: description,
            columnId: targetColumnId,
            sortOrder: 0
        });
    }

    const filteredColumns = useMemo(() => {
        if (!searchQuery.trim()) return columns;
        const q = searchQuery.toLowerCase();
        return columns.map(col => ({
            ...col,
            ideas: col.ideas.filter(idea => 
                idea.title.toLowerCase().includes(q) || 
                (idea.description && idea.description.toLowerCase().includes(q))
            )
        }));
    }, [columns, searchQuery]);

    return (
        <>
            <div className="flex flex-col h-full overflow-hidden">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 px-6 py-4 gap-4 bg-background">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-foreground">Content Ideas Board</h1>
                            <Badge variant="outline" className="text-xs font-semibold">
                                {columns.reduce((acc, c) => acc + c.ideas.length, 0)} Ideas
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Capture, brainstorm, and organize raw concepts into scheduled social posts.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <div className="relative w-48 sm:w-64">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search ideas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-8 pl-8 text-xs bg-muted/30"
                            />
                        </div>
                        <GenerateIdeasPopover onGenerated={handleGeneratedIdea} />
                        <Button 
                            onClick={() => handleAddIdea(columns[0]?.id ?? "")}
                            size="sm"
                            className="bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 gap-1.5 h-8 text-xs"
                        >
                            <Plus className="size-3.5" />
                            <span>New Idea</span>
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden p-6">
                    <div className="kanban--board relative h-full overflow-hidden">
                        {isPending ? (
                            <div className="flex gap-4 w-full h-full items-start">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="shrink-0 w-[290px] flex flex-col h-full min-h-0 rounded-xl bg-card border border-border/70 p-3.5 space-y-3">
                                        <div className="flex items-center justify-between pb-2">
                                            <Skeleton className="h-5 w-24" />
                                            <Skeleton className="h-5 w-6 rounded-full" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <Skeleton className="h-[90px] w-full rounded-lg" />
                                            <Skeleton className="h-[110px] w-full rounded-lg" />
                                            <Skeleton className="h-[75px] w-full rounded-lg" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full overflow-x-auto pb-2">
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <div className="flex gap-4 h-full items-start">
                                        {filteredColumns?.map((column) => (
                                            <div
                                                key={column.id}
                                                className="shrink-0 w-[290px] flex flex-col max-h-full rounded-xl bg-card border border-border/80 shadow-xs p-3.5"
                                            >
                                                <div className="flex items-center justify-between pb-3">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                                                            {column.title}
                                                        </h3>
                                                        <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 font-bold">
                                                            {column.ideas.length}
                                                        </Badge>
                                                    </div>
                                                    <Button 
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-6 text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleAddIdea(column.id)}
                                                    >
                                                        <Plus className="size-3.5" />
                                                    </Button>
                                                </div>

                                                <Droppable droppableId={column.id}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                            className={cn(
                                                                "flex-1 overflow-y-auto overflow-x-hidden p-1 space-y-2.5 transition-colors min-h-[120px] rounded-lg",
                                                                snapshot.isDraggingOver
                                                                    ? "bg-primary/5 border-2 border-dashed border-primary/40"
                                                                    : "bg-transparent",
                                                            )}
                                                        >
                                                            {column.ideas.length === 0 && !snapshot.isDraggingOver && (
                                                                <div className="p-4 text-center border border-dashed border-border/60 rounded-lg text-xs text-muted-foreground my-2">
                                                                    No ideas yet
                                                                </div>
                                                            )}

                                                            <div className="space-y-2.5">
                                                                {column?.ideas.map((idea, index) => (
                                                                    <Draggable
                                                                        key={idea.id || `idea-${index}`}
                                                                        draggableId={idea.id || `idea-${index}`}
                                                                        index={index}
                                                                    >
                                                                        {(provided, snapshot) => (
                                                                            <Card
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={provided.draggableProps.style as React.CSSProperties}
                                                                                className={cn(
                                                                                    "group cursor-pointer rounded-xl border border-border/70 bg-card p-3 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs active:cursor-grabbing transition-all select-none",
                                                                                    snapshot.isDragging && "scale-95 rotate-1 shadow-lg ring-2 ring-primary/30"
                                                                                )}
                                                                                onClick={() => handleEditIdea(idea, column.id)}
                                                                            >
                                                                                <CardContent className="p-0 space-y-2">
                                                                                    {idea.images && idea.images.length > 0 && (
                                                                                        <div className="grid grid-cols-4 gap-1.5 rounded-lg overflow-hidden">
                                                                                            {idea.images.slice(0, 4).map((image, index) => (
                                                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                                                <img
                                                                                                    key={index}
                                                                                                    src={image.url}
                                                                                                    alt={idea.title}
                                                                                                    className="w-full h-12 rounded-md object-cover border border-border/60"
                                                                                                />
                                                                                            ))}
                                                                                        </div>
                                                                                    )}

                                                                                    <div className="flex items-start justify-between gap-2">
                                                                                        <h4 className="font-semibold text-xs text-foreground line-clamp-2">
                                                                                            {idea.title}
                                                                                        </h4>
                                                                                        <DropdownMenu>
                                                                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                                                <Button
                                                                                                    size="icon"
                                                                                                    variant="ghost"
                                                                                                    className="size-6 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                                >
                                                                                                    <MoreHorizontal className="size-3.5" />
                                                                                                </Button>
                                                                                            </DropdownMenuTrigger>
                                                                                            <DropdownMenuContent align="end" className="w-44 text-xs">
                                                                                                <DropdownMenuItem onClick={() => handleEditIdea(idea, column.id)}>
                                                                                                    <Edit2 className="size-3.5 mr-2" />
                                                                                                    Edit Idea
                                                                                                </DropdownMenuItem>
                                                                                                <DropdownMenuItem onClick={() => {
                                                                                                    setSelectedIdea(idea);
                                                                                                    setIsCreatePostOpen(true);
                                                                                                }}>
                                                                                                    <Share2 className="size-3.5 mr-2 text-primary" />
                                                                                                    Turn into Post
                                                                                                </DropdownMenuItem>
                                                                                                <DropdownMenuSeparator />
                                                                                                <DropdownMenuItem
                                                                                                    className="text-red-600 dark:text-red-400 font-semibold cursor-pointer"
                                                                                                    disabled={deleteIdeaMutation.isPending}
                                                                                                    onSelect={() => handleDeleteIdea(column.id, idea.id || "")}
                                                                                                >
                                                                                                    <Trash2 className="size-3.5 mr-2" />
                                                                                                    Delete Idea
                                                                                                </DropdownMenuItem>
                                                                                            </DropdownMenuContent>
                                                                                        </DropdownMenu>
                                                                                    </div>

                                                                                    {idea.description && (
                                                                                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                                                                            {idea.description}
                                                                                        </p>
                                                                                    )}
                                                                                </CardContent>
                                                                            </Card>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                            </div>

                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => handleAddIdea(column.id)}
                                                                className="w-full text-xs h-8 text-muted-foreground hover:text-foreground mt-2 border border-dashed border-border/60 hover:border-border"
                                                            >
                                                                <Plus className="size-3 mr-1.5" />
                                                                Add Idea
                                                            </Button>

                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                        ))}
                                    </div>
                                </DragDropContext>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CreatePostDialog
                open={isCreatePostOpen}
                onOpenChange={setIsCreatePostOpen}
            />

            <IdeaDialog
                open={showIdeaDialog}
                onOpenChange={(open) => {
                    setShowIdeaDialog(open)
                }}
                idea={selectedIdea ?? undefined}
                isSaving={saveIdeaMutation.isPending}
                selectedColumnId={selectedColumnId || columns[0]?.id || ""}
                columns={columns?.map((col) => ({
                    id: col.id,
                    title: col.title
                }))}
                onSave={handleSaveIdea}
            />
        </>
    )
}

export default IdeaKanban