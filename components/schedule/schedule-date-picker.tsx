"use client"

import * as React from "react"
import { CalendarDays, ChevronDown, Clock, Check, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, startOfDay, addMinutes, isSameDay, isBefore, addDays } from "date-fns"

interface ScheduleDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  time: string
  setTime: (time: string) => void
  className?: string
  align?: "start" | "center" | "end"
  renderButton?: (isDatePassed: boolean, isTimeNotAvailable: boolean) => React.ReactNode
}

const generateTimeOptions = () => {
  const options: string[] = []
  const baseDate = startOfDay(new Date())
  for (let i = 0; i < 24 * 4; i++) {
    options.push(format(addMinutes(baseDate, i * 15), "h:mm a"))
  }
  return options
}

const timeOptions = generateTimeOptions()

export function ScheduleDatePicker({
  date,
  setDate,
  time,
  setTime,
  className,
  align = "end",
  renderButton
}: ScheduleDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const today = React.useMemo(() => startOfDay(new Date()), [])

  // Detect and format local timezone
  const userTimeZone = React.useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local Time";
    } catch {
      return "Local Time";
    }
  }, []);

  const timeZoneOffset = React.useMemo(() => {
    try {
      const offset = -new Date().getTimezoneOffset();
      const sign = offset >= 0 ? "+" : "-";
      const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, "0");
      const hours = pad(offset / 60);
      const mins = pad(offset % 60);
      return `UTC${sign}${hours}:${mins}`;
    } catch {
      return "";
    }
  }, []);

  const availableTimeOptions = React.useMemo(() => {
    if (!date || !isSameDay(date, new Date())) return timeOptions
    const now = new Date()
    return timeOptions.filter((slot) => {
      const [timeValue, meridiem] = slot.split(" ")
      const [rawHour, rawMinute] = timeValue.split(":").map(Number)

      const hour = meridiem === "PM" && rawHour !== 12 ? rawHour + 12 : meridiem === "AM" && rawHour === 12 ? 0 : rawHour
      const candidate = new Date(date)
      candidate.setHours(hour, rawMinute, 0, 0)
      return !isBefore(candidate, now)
    })
  }, [date])

  React.useEffect(() => {
    if (!time && availableTimeOptions.length > 0) {
      setTime(availableTimeOptions[0])
      return
    }
    if (time) {
      setTime(time)
    }
  }, [availableTimeOptions, setTime, time])

  const isDatePassed = date ? isBefore(date, new Date()) && !isSameDay(date, new Date()) : false
  const isTimeNotAvailable = time ? !availableTimeOptions.includes(time) : false

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
  }

  // Quick Preset Handlers
  const handleSetPreset = (targetDate: Date, targetTime: string) => {
    setDate(targetDate)
    setTime(targetTime)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            size="sm" 
            className={cn(
              "h-9 px-3 rounded-lg border border-border bg-card text-foreground hover:bg-muted/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors font-medium text-xs gap-2", 
              className
            )} 
            variant="outline"
          >
            <CalendarDays className="size-3.5 text-primary shrink-0" />
            <span className="flex items-center gap-1.5 truncate">
              {date ? (
                <>
                  <span className="font-semibold">{format(date, "MMM d")}</span>
                  {time && <span className="text-muted-foreground font-normal">at {time}</span>}
                  <span className="text-[10px] font-mono text-muted-foreground/80 hidden sm:inline-block">
                    ({timeZoneOffset})
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">Select Date & Time</span>
              )}
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[310px] p-0 shadow-xl border-border surface-card" align={align}>
          {/* Header with explicit Timezone Indicator */}
          <div className="p-3 pb-2.5 border-b border-border/70 bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Clock className="size-3.5 text-primary" />
              <span>Schedule Details</span>
            </div>
            <div 
              className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-md border border-border/80"
              title={`Active Timezone: ${userTimeZone} (${timeZoneOffset})`}
            >
              <Globe className="size-3 text-primary" />
              <span className="truncate max-w-[120px]">{userTimeZone.split("/").pop()?.replace("_", " ")}</span>
              <span className="text-muted-foreground/70 font-mono">({timeZoneOffset})</span>
            </div>
          </div>

          <div className="p-3.5 space-y-4">
            {/* Quick Presets */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="size-3 text-primary" />
                <span>Quick Timing Presets</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSetPreset(addDays(new Date(), 1), "9:00 AM")}
                  className="px-2 py-1 text-[11px] font-medium rounded-md border border-border/80 bg-background hover:bg-muted text-foreground text-left transition-colors cursor-pointer"
                >
                  Tomorrow 9:00 AM
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPreset(addDays(new Date(), 1), "12:00 PM")}
                  className="px-2 py-1 text-[11px] font-medium rounded-md border border-border/80 bg-background hover:bg-muted text-foreground text-left transition-colors cursor-pointer"
                >
                  Tomorrow 12:00 PM
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPreset(addDays(new Date(), 1), "5:00 PM")}
                  className="px-2 py-1 text-[11px] font-medium rounded-md border border-border/80 bg-background hover:bg-muted text-foreground text-left transition-colors cursor-pointer"
                >
                  Tomorrow 5:00 PM
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPreset(addDays(new Date(), 2), "10:00 AM")}
                  className="px-2 py-1 text-[11px] font-medium rounded-md border border-border/80 bg-background hover:bg-muted text-foreground text-left transition-colors cursor-pointer"
                >
                  In 2 days 10:00 AM
                </button>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="border border-border/60 rounded-lg p-1 bg-background/50">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={{ before: today }}
                className="p-1 w-full"
                formatters={{
                  formatWeekdayName: (d) => d.toLocaleDateString('en-US', { weekday: 'narrow' })
                }}
                classNames={{
                  month_caption: "flex justify-start items-center h-8 ml-1",
                  caption_label: "text-sm font-semibold text-foreground",
                  nav: "absolute right-2 top-1 flex items-center gap-1",
                  month: "space-y-3 w-full",
                  day: cn(
                    "h-8 w-8 p-0 font-normal text-xs aria-selected:opacity-100 rounded-md hover:bg-muted transition-colors text-foreground"
                  ),
                }}
              />
            </div>

            {/* Time Slot Select */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Publish Time
                </label>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {timeZoneOffset}
                </span>
              </div>
              <Select value={time} onValueChange={handleTimeChange}>
                <SelectTrigger className="w-full h-8 text-xs bg-background">
                  <SelectValue placeholder="Select publishing time" />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[190px]">
                  {availableTimeOptions.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">
                      <Clock className="size-3 text-muted-foreground mr-1.5 inline" />
                      <span>{t}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border-t border-border/70 bg-muted/20">
            <span className="text-[11px] text-muted-foreground font-medium">
              {date ? format(date, "MMM d, yyyy") : "Date"} {time ? `@ ${time}` : ""}
            </span>
            <Button size="sm" className="h-7 px-3 text-xs font-semibold bg-primary text-primary-foreground" onClick={() => setOpen(false)}>
              <Check className="size-3.5 mr-1" />
              Confirm Time
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {renderButton && renderButton(isDatePassed, isTimeNotAvailable)}
    </>
  )
}
