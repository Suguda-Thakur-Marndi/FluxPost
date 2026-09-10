"use client"
import * as React from "react"
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, addHours, isBefore, startOfDay } from "date-fns"
import { enUS } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus, } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"

import "react-big-calendar/lib/css/react-big-calendar.css"
import "./post-calendar.css"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getChannelIcon } from "@/constants/channels"
import { PostType } from "@/types/post.type"

const locales = { "en-US": enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface PostCalendarProps {
  posts: PostType[]
  isPending: boolean
  currentDate: Date
  view: "month" | "week"
  onViewChange: (view: string) => void
  onDateChange: (date: Date) => void
  onPostClick: (post: PostType) => void
  onCreatePost: (date: Date) => void
  rightActions?: React.ReactNode
}

export function PostCalendar({
  posts,
  isPending,
  currentDate,
  view,
  onViewChange,
  onDateChange,
  onPostClick,
  onCreatePost,
  rightActions,
}: PostCalendarProps) {

  const events = React.useMemo(() =>
    isPending ? [] : posts.map(p => ({
      ...p,
      title: p.content,
      start: new Date(p.scheduled_at),
      end: addHours(new Date(p.scheduled_at), 1),
    })), [posts, isPending]
  )

  const formats = React.useMemo(() => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    weekdayFormat: (date: Date, culture?: string, localizer?: any) =>
      localizer.format(date, 'EEEE', culture),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dayFormat: (date: Date, culture?: string, localizer?: any) =>
      localizer.format(date, 'EEEE d', culture),
  }), []);

  const isWeekView = view === "week"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomToolbar = (toolbar: any) => {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden shadow-2xs">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-none border-r border-border hover:bg-muted" 
                onClick={() => toolbar.onNavigate('PREV')}
                title="Previous period"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-none hover:bg-muted" 
                onClick={() => toolbar.onNavigate('NEXT')}
                title="Next period"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 text-xs font-semibold rounded-lg shadow-2xs border-border" 
              onClick={() => toolbar.onNavigate('TODAY')}
            >
              Today
            </Button>

            <span className="text-sm font-semibold tracking-tight text-foreground ml-1">
              {format(toolbar.date, "MMMM yyyy")}
            </span>

            <div className="hidden sm:flex items-center bg-muted/60 p-0.5 rounded-lg border border-border text-xs font-medium ml-2">
              <button
                type="button"
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                  view === "month" 
                    ? "bg-background text-foreground shadow-2xs font-semibold" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onViewChange("month")}
              >
                Month
              </button>
              <button
                type="button"
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                  view === "week" 
                    ? "bg-background text-foreground shadow-2xs font-semibold" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onViewChange("week")}
              >
                Week
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {rightActions}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("h-full relative flex flex-col min-h-[600px] bg-background")}>
      <Calendar
        localizer={localizer}
        events={events}
        date={currentDate}
        formats={formats}
        step={isWeekView ? 15 : 60}
        timeslots={10}
        min={new Date(2026, 0, 1, 0, 0)}
        max={new Date(2026, 0, 1, 22, 0)}
        onNavigate={onDateChange}
        view={view === "month" ? Views.MONTH : Views.WEEK}
        onView={(v: View) => onViewChange(v === Views.MONTH ? "month" : "week")}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSelectEvent={(event: any) => onPostClick(event)}

        slotPropGetter={(date: Date) => {
          const isPastSlot = isBefore(date, new Date())
          return isPastSlot
            ? {
              className: "rbc-time-slot-disabled",
              style: {
                backgroundColor: "hsl(var(--muted) / 0.35)",
                pointerEvents: "none",
              },
            }
            : {}
        }}

        dayPropGetter={(date: Date) => {
          const isPastDate = isBefore(date, startOfDay(new Date()))
          return {
            className: isPastDate ? "rbc-past-day opacity-75" : "",
            style: isPastDate ? { backgroundColor: "hsl(var(--muted) / 0.3)" } : {}
          }
        }}
        components={{
          toolbar: CustomToolbar,

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          event: ({ event }: { event: any }) => {
            const channel = event.user_channels?.channel_types
            const Icon = getChannelIcon(channel?.type || undefined)
            const color = channel?.color || "var(--primary)"
            const isFailed = event.status === "failed"
            const isPublished = event.status === "published"
            
            return (
              <div
                className="group relative flex items-center gap-1.5 px-2 py-1 h-full rounded-md border border-border/60 bg-card/95 hover:bg-card hover:border-primary/50 hover:shadow-xs transition-all cursor-pointer overflow-hidden"
                style={{ borderLeft: `3px solid ${color}` }}
                onClick={() => onPostClick(event)}
              >
                <div 
                  className="size-4 rounded flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: color }}
                >
                  {Icon ? (
                    <HugeiconsIcon icon={Icon} className="size-2.5 text-white" color="currentColor" />
                  ) : (
                    <span className="text-[8px] font-bold leading-none">{channel?.name?.[0] || "P"}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-foreground truncate flex-1 leading-tight">
                  {event?.title || "Untitled post"}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground/80 shrink-0 tabular-nums">
                  {format(new Date(event.scheduled_at), "h:mm a")}
                </span>
                {isFailed && (
                  <span className="size-1.5 rounded-full bg-destructive shrink-0" title="Publishing Failed" />
                )}
                {isPublished && (
                  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" title="Published" />
                )}
              </div>
            )
          },

          month: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dateHeader: ({ label, date: cellDate }: any) => {
              const isCellToday = format(cellDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              const isPastDate = isBefore(cellDate, startOfDay(new Date()))
              return (
                <div className="group flex items-center justify-between w-full px-1 pt-1">
                  <span className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isCellToday 
                      ? "bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/20" 
                      : isPastDate 
                        ? "text-muted-foreground/50 font-normal" 
                        : "text-foreground group-hover:text-primary"
                  )}>
                    {label}
                  </span>
                  {!isPastDate && !isPending && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        onCreatePost(cellDate)
                      }}
                      title={`Add post for ${format(cellDate, 'MMM d')}`}
                    >
                      <Plus className="size-3" />
                    </Button>
                  )}
                  {isPending && <Skeleton className="h-4 w-12" />}
                </div>
              )
            }
          },
        }}
      />
    </div>
  )
}
