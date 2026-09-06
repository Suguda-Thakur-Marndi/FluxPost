# Page Design System: Media Library

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for the Media Library page are defined here.

---

## 1. Page Purpose & Mental Model
The Media Library is a centralized asset repository where users store, organize, preview, and reuse high-resolution images, videos, GIFs, and brand assets for their multi-channel campaigns.

---

## 2. Layout Structure & Toolbar

```
+-----------------------------------------------------------------------------------------------+
| Header: "Media Library" + Total Assets Count | [ Upload Files (Primary) ]                     |
+-----------------------------------------------------------------------------------------------+
| Search & Filter Bar:                                                                          |
| [ Search assets... ] [ Type: All | Images | Videos ] [ Sort: Recent ▼ ] | [ Grid | List View ] |
+-----------------------------------------------------------------------------------------------+
| Asset Canvas:                                                                                 |
| - Grid: Responsive cards (2 cols on mobile, 3 on tablet, 4-5 on desktop)                     |
| - List: Data table with thumbnail, title, dimensions, size, format, upload date, actions      |
+-----------------------------------------------------------------------------------------------+
| Multi-Select Floating Action Bar (Appears when 1+ assets selected):                           |
| [ 3 assets selected ]  [ Create Post with Media ]  [ Download ]  [ Delete (Red) ]             |
+-----------------------------------------------------------------------------------------------+
```

---

## 3. Specific Component Overrides & Tokens

### Media Grid Card
- **Aspect Ratio:** Fixed `4:3` or `1:1` container with `object-cover`.
- **Badge Overlays:**
  - Video duration chip in bottom-left (`0:45` with film icon).
  - Format chip in bottom-right (`PNG`, `MP4`, `WEBP`).
- **Selection State:**
  - Checkbox circle in top-left (always visible on hover or when in multi-select mode).
  - Selected state: Thick 2.5px primary border (`border-primary ring-2 ring-primary/30`), background tint, and checked checkmark.
- **Card Hover Overlay:**
  - Quick action buttons: "Preview (Eye)", "Create Post (Plus)", "Options Menu (More)".

### Media Detail & Preview Modal
- Large preview of image/video player.
- Sidebar metadata panel:
  - File Name (inline editable)
  - File Size (e.g. `2.4 MB`)
  - Resolution (e.g. `1920 x 1080 px`)
  - MIME Type (e.g. `image/jpeg`)
  - Date Uploaded
  - Used in posts list
  - Primary CTA: "Use in New Post"
  - Destructive CTA: "Delete Asset" (triggers confirmation dialog).

---

## 4. Empty & Error States
- **Empty Library:** Upload dropzone container with drag-over visual feedback, supported format pills (`JPG, PNG, GIF, MP4, MOV up to 50MB`), and "Upload Files" button.
- **Upload Progress:** Floating drawer showing multi-file upload progress bars with cancel buttons and retry states for network dropouts.
