"use client"

import { Suspense, useState } from "react";
import { useQueryState } from "nuqs"
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CalendarIcon, LayoutList, Plus } from "lucide-react";
import ListView from "@/components/schedule/list-view";
import CalendarView from "@/components/schedule/calendar-view";
import CreatePostDialog from "@/components/schedule/create-post-dialog";

type ViewType = "calendar" | "list"
const SchedulePageContent = () => {
  const [activeView, setActiveView] = useQueryState("view", {
    defaultValue: "calendar",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_,setStatus] = useQueryState("status", {
    defaultValue: "",
  })
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false)
  return (
    <div className="flex flex-col h-full bg-transparent">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 md:px-8 pt-6 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Content Calendar
            </h1>
            <Badge variant="outline" className="text-xs font-semibold border-border bg-muted/40">
              Schedule
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Plan, schedule, and monitor posts across all connected channels.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="bg-muted/60 p-1 rounded-lg border border-border flex relative">
            {["list", "calendar"].map((view) => (
              <button
                key={view}
                onClick={() => {
                  setStatus(null);
                  setActiveView(view as ViewType);
                }}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-md transition-colors z-10 flex items-center gap-1.5 ${
                  activeView === view ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeView === view && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-background rounded-md shadow-xs border border-border/80"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
                  />
                )}
                <span className="relative z-20 flex items-center gap-1.5">
                  {view === "list" ? <LayoutList className="size-3.5" /> : <CalendarIcon className="size-3.5" />}
                  <span className="capitalize">{view}</span>
                </span>
              </button>
            ))}
          </div>
          
          <Button 
            onClick={() => setCreatePostModalOpen(true)}
            size="sm"
            className="rounded-lg bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 gap-1.5"
          >
            <Plus className="size-4" />
            <span>Add Post</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {activeView === "list" ? (
          <ListView setCreatePostModalOpen={setCreatePostModalOpen} />
        ) : (
          <CalendarView />
        )}
      </div>

      <CreatePostDialog
        open={createPostModalOpen}
        onOpenChange={setCreatePostModalOpen}
      />
    </div>
  )
}

const SchedulePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NuqsAdapter>
        <SchedulePageContent />
      </NuqsAdapter>
    </Suspense>
  )
}

export default SchedulePage