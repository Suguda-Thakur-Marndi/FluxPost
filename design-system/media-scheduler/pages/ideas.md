# Page Design System: Ideas Board (/ideas)

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for the Ideas workspace are defined here.

---

## 1. Page Purpose & Mental Model
The Ideas Board is an agile creative workspace where social media managers, marketing teams, and creators capture, organize, and nurture raw concepts into publishable content. It replaces messy spreadsheets and disjointed notes with a tactile Kanban workflow and built-in AI ideation.

---

## 2. Layout Architecture

```
+------------------------------------------------------------------------------------+
| Header: "Ideas Workspace" + Tag/Search Filter + [Generate Ideas (AI)] + [New Idea]  |
+------------------------------------------------------------------------------------+
| Kanban Board: Horizontal scroll container with fixed-width columns (280px - 320px)  |
|                                                                                    |
| [ Column 1: Unassigned ]    [ Column 2: In Progress ]    [ Column 3: Scheduled ]   |
| - Idea Card 1 (with image)  - Idea Card 3                - Idea Card 5             |
| - Idea Card 2               - Idea Card 4                                          |
| + Add Idea CTA              + Add Idea CTA               + Add Idea CTA            |
+------------------------------------------------------------------------------------+
```

---

## 3. Component Specifications & Tokens

### Kanban Column
- Container: `w-72 sm:w-80 flex flex-col shrink-0 rounded-xl bg-card border border-border/80 shadow-xs max-h-full`
- Header: Sticky top within column, bold title, item count badge (`bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full`), plus button to add card.
- Droppable Body: `flex-1 overflow-y-auto p-2 space-y-2.5 transition-colors min-h-[150px]`
  - Drag over state: `bg-primary/5 border-2 border-dashed border-primary/50 rounded-lg`

### Idea Card
- Surface: `bg-surface border border-border/70 rounded-lg p-3 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all group`
- Dragging state: `rotate-1 scale-[1.02] shadow-lg ring-2 ring-primary/30 z-50`
- Content hierarchy:
  1. Image preview strip (up to 4 thumbnails with rounded corners and aspect-ratio crop)
  2. Idea Title (`text-sm font-semibold text-foreground line-clamp-2`)
  3. Description snippet (`text-xs text-muted-foreground line-clamp-3 mt-1`)
  4. Footer row: Target platform badge (if assigned), last modified date, hover action menu ("Turn into Post", "Edit", "Delete")

### AI Idea Generator Side Panel / Modal
- Multi-step guided generator:
  - Step 1: Input target audience, business niche, and optional topic focus.
  - Step 2: Interactive list of generated suggestions with platform recommendations.
  - Action: One-click "Add to Board" or "Draft Post Now" with instant toast feedback.
- Loading state: Clean pulse skeleton with progress indicator ("Brainstorming concepts...").
