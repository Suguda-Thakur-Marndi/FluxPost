# Page Design System: Post Composer (Post Creation Studio)

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for the Post Composer are defined here.

---

## 1. Page Purpose & Mental Model
The Post Composer is a professional publishing studio. It unifies caption editing, AI assistance, multi-channel customization, media management, and pixel-accurate previews into an intuitive, error-preventing workspace.

---

## 2. Studio Layout Architecture

```
+----------------------------------------------------------------------------------------------------+
| Header: "Create Post" + Channel Selector Badges (Twitter/X, LinkedIn, IG, FB, Threads, etc.)       |
+----------------------------------------------------------------------------------------------------+
| Main Body (3-Section or Modular 2-Column with Side Drawer):                                        |
|                                                                                                    |
| [ Left: Content Editor & Channels ]                 [ Right: Live Platform Preview ]                |
| - Global / Per-Channel Accordion Editor             - Tabbed Platform Switcher (X, LinkedIn, IG...) |
| - Character limit counter with color warning        - High-fidelity feed mockup                    |
| - Media Drag-and-Drop (Images, Reorder, Delete)     - Exact typography, verified badge & handle    |
| - AI Assistant Tools (Rewrite, Hook, Hashtags)      - Media aspect ratio container                 |
+----------------------------------------------------------------------------------------------------+
| Footer: [Save as Draft]                 [Date & Time Schedule Picker]                 [Publish Now] |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Component Specifications & Tokens

### Channel Selector
- Top bar with clickable channel pills.
- Connected channel: Full color platform badge, icon, and account handle.
- Selected state: Primary ring, checkmark, and active indicator.
- Disconnected channel: Subtle muted pill with plus icon opening connection dialog.
- Warning state: Red border if channel connection has expired or requires re-authentication.

### Content Editor
- Global editor for writing core copy, propagating automatically to connected channels.
- Per-channel accordion: allows tailoring copy for Twitter's 280-char limit, LinkedIn's long-form format, or Instagram's hashtag block.
- Character Counter:
  - Normal (< 85% limit): `text-xs text-muted-foreground`
  - Warning (85% - 100%): `text-xs text-amber-600 dark:text-amber-400 font-semibold`
  - Over limit (> 100%): `text-xs text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-950/40 px-2 py-0.5 rounded`

### Media Uploader
- Compact dropzone supporting multi-image upload.
- Thumbnail gallery with drag handle for reordering, aspect ratio indicator, and delete button.

### Live Social Previews
- Support all 8 platforms: Twitter/X, LinkedIn, Instagram, Facebook, Threads, Bluesky, YouTube, and TikTok.
- Each preview faithfully matches real platform structure without distracting third-party chrome.
