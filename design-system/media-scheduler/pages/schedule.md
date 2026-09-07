# Page Design System: Schedule & Content Calendar (/schedule)

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for Schedule & Calendar are defined here.

---

## 1. Page Purpose & Mental Model
The Schedule page gives users absolute clarity and control over their publishing timeline. It provides multiple time perspectives (Month view, Week view, and List view) with instant filtering by channel and post status.

---

## 2. Layout Architecture

```
+-----------------------------------------------------------------------------------------------+
| Header: "Content Schedule" + [Month | Week | List Toggle] + Date Navigation + [Create Post]   |
+-----------------------------------------------------------------------------------------------+
| Filter Toolbar: Channel multi-select pills + Status tabs (All, Scheduled, Drafts, Published)  |
+-----------------------------------------------------------------------------------------------+
| Main Viewport:                                                                                |
| - If Calendar (Month/Week): react-big-calendar grid with custom styled event pills           |
| - If List: Chronological cards grouped by date (Today, Tomorrow, Later this week)            |
+-----------------------------------------------------------------------------------------------+
```

---

## 3. Component Specifications & Tokens

### View Switcher
- Segmented control with smooth spring active indicator (`layoutId="activeTab"`).
- Icons: `Calendar` for Month/Week, `LayoutList` for List.

### Calendar Event Pills
- Compact, high-density event cards inside day cells.
- Visual elements:
  - Channel badge/color pip
  - Time badge (e.g. `10:30 AM`)
  - Post snippet
  - Status indicator (Scheduled: Sky dot, Published: Emerald dot, Failed: Red alert)
- Interaction: Click opens fast inspection popover or edit post dialog; clicking empty day cell opens Composer pre-filled with that date.

### List View Cards
- Grouped by relative date headers ("Today - Sep 8", "Tomorrow - Sep 9", "Next Week").
- Post card includes channel avatar, post copy excerpt, image thumbnails, scheduled timestamp, and quick action buttons ("Publish Now", "Edit", "Delete").
