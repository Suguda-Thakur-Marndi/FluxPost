# Page Design System: Content Calendar

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for the Calendar page are defined here.

---

## 1. Page Purpose & Mental Model
The Calendar is the scheduling workspace where creators and social media teams orchestrate publishing cadence across all channels over days, weeks, and months.
It must feel like a dedicated productivity canvas: responsive, dense, and visual.

---

## 2. Layout Structure & Toolbar

```
+---------------------------------------------------------------------------------------------+
| Top Toolbar:                                                                                |
| [ < > Today ] [ Month Year ]  |  [ Filter Channels ▼ ] [ Filter Status ▼ ]  | [ Month|Week|Day ] [ + Add Post ] |
+---------------------------------------------------------------------------------------------+
| Main Calendar Canvas (Month Grid / Week Timegrid / Day Agenda)                              |
| - Month: 7 columns (Sun-Sat or Mon-Sun depending on locale), cell dates, post chips        |
| - Week: 7 day columns with hourly time slots, past slots shaded with reduced opacity       |
| - Day: Detailed hour-by-hour view with full post cards and media thumbnails               |
+---------------------------------------------------------------------------------------------+
```

---

## 3. Specific Component Overrides & Tokens

### Post Event Chips
- **Height:** `24px` in month view, proportional to duration in week view.
- **Background & Border:** Channel color at 15% opacity (`color + "26"`) with 3px solid channel left border.
- **Content:** Channel icon (14x14px), scheduled time (`h:mm a`), snippet of content.
- **Status Indicator:**
  - Queued: Solid channel bar
  - Published: Subtle green checkmark badge
  - Failed: Red left border with warning triangle icon
  - Draft: Dashed border with slate text

### Day Cell Header & Hover Actions
- Date number in top-left.
- Current day highlighted with solid `#2563EB` pill.
- Past dates receive `opacity-60 pointer-events-auto` (viewable, but slot creation disabled for past timestamps).
- Hovering an empty slot reveals a subtle `+` button to quickly schedule a post at that exact date/time.

### Quick Post Preview Popover (On Chip Click)
- Displays on click without leaving the calendar view.
- Card contains:
  - Header: Target channels + status badge + scheduled datetime
  - Body: Complete post text
  - Media: Media gallery preview if images/videos attached
  - Footer actions: "Edit", "Reschedule", "Publish Now", "Delete"

---

## 4. Mobile Calendar Strategy (<= 768px)
- Month view calendar cells on small screens are unreadable when packed with multiple posts.
- **Mobile Adaptive Pattern:**
  - Displays a compact horizontal date carousel strip (7 days).
  - Below the date strip, renders an "Agenda List" for the selected day, listing scheduled posts with full details, platform badges, and action buttons.
  - Allows smooth horizontal swiping to navigate between days.
