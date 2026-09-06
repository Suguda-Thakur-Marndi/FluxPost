# Media Scheduler — Master Design System (MASTER.md)

> **SINGLE SOURCE OF TRUTH FOR FRONTEND UI/UX ARCHITECTURE**  
> **Logic:** When building or modifying a specific page, first consult `design-system/media-scheduler/pages/[page-name].md`.  
> If that file exists, its specific deviations and rules override this Master file.  
> If no page override exists or for shared components/foundations, strictly adhere to this Master specification.

---

## 1. Product Context & Brand Identity

### Product Definition
**Media Scheduler** is a high-performance, enterprise-ready social media content scheduling, multi-platform publishing, media asset management, and performance monitoring SaaS platform. It serves content creators, social media managers, marketing agencies, small businesses, and enterprise brand teams.

### Brand Personality & Core Attributes
- **Professional & Trustworthy:** Reliable publishing engine where missed posts or broken formats never occur. Clean, stable, and predictable.
- **Productivity-First & Fast:** Low cognitive load, high density where needed, zero unnecessary clicks, instant keyboard shortcuts, fast navigation.
- **Modern & Content-Centric:** The interface recedes into the background so user media, post copy, and schedule timelines take center stage.
- **Organized & Clear:** Information hierarchy is sharp, status signals (Scheduled, Draft, Published, Failed) are instantly distinguishable without ambiguity.

### Design Principles
1. **Utility Over Decoration:** Never sacrifice readability or workflow speed for visual vanity. Eliminate generic AI purple/pink gradients, excessive glassmorphism, floating decorative orbs, and neon glows.
2. **Predictable Status & Feedback:** Every asynchronous action (save, schedule, publish, upload, channel sync) must have visible, instantaneous state feedback (Loading, Success, Warning, Error, Offline).
3. **Platform Authenticity:** Social media previews (X/Twitter, LinkedIn, Instagram, Facebook, YouTube, Threads, Bluesky) must accurately reflect the real platform dimensions, typography, and constraints.
4. **Resilient Responsiveness:** Mobile (375px), Tablet (768px), Laptop (1024px), and Desktop (1440px+) receive purposeful layouts, not awkwardly shrunk desktop views.
5. **Universal Accessibility (WCAG 2.1 AA):** High-contrast text (>=4.5:1 for normal text, >=3:1 for UI controls), visible keyboard focus rings, zero color-only status indicators, screen reader labels on all icon controls, and full `prefers-reduced-motion` compliance.

---

## 2. Color System & Semantic Tokens

The color architecture is built on a high-contrast, functional foundation that maintains strict legibility across Light and Dark themes while allowing official social network brand colors to stand out contextually on channel badges.

### Color Palette Specification

| Token | Light Mode Hex / Variable | Dark Mode Hex / Variable | Purpose & Semantic Role |
|-------|--------------------------|-------------------------|-------------------------|
| **Background** | `#F8FAFC` (`slate-50`) | `#090D16` (`obsidian-950`) | Global page background |
| **Surface (Card)** | `#FFFFFF` (`white`) | `#111827` (`gray-900`) | Cards, modals, drawers, calendar grid |
| **Surface Elevated** | `#F1F5F9` (`slate-100`) | `#1E293B` (`slate-800`) | Hovered rows, popovers, dropdown menus |
| **Primary** | `#2563EB` (`blue-600`) | `#3B82F6` (`blue-500`) | Primary CTAs, active highlights, key navigation |
| **Primary Foreground** | `#FFFFFF` | `#FFFFFF` | Text on Primary |
| **Primary Hover** | `#1D4ED8` (`blue-700`) | `#60A5FA` (`blue-400`) | Interactive hover state for Primary |
| **Secondary** | `#F1F5F9` (`slate-100`) | `#1E293B` (`slate-800`) | Secondary buttons, subtle badges, filter pills |
| **Secondary Foreground** | `#0F172A` (`slate-900`) | `#F8FAFC` (`slate-50`) | Text on Secondary |
| **Accent** | `#0284C7` (`sky-600`) | `#38BDF8` (`sky-400`) | Telemetry callouts, link accents, focus rings |
| **Accent Foreground** | `#FFFFFF` | `#090D16` | Text on Accent |
| **Text Primary (Foreground)** | `#0F172A` (`slate-900`, 15.2:1) | `#F8FAFC` (`slate-50`, 16.5:1) | Headings, primary post titles, table data |
| **Text Secondary (Muted)** | `#475569` (`slate-600`, 5.9:1) | `#94A3B8` (`slate-400`, 6.8:1) | Captions, timestamps, secondary labels |
| **Text Tertiary (Subtle)** | `#64748B` (`slate-500`, 4.6:1) | `#64748B` (`slate-500`, 4.5:1) | Metadata footnotes, empty state hints |
| **Border (Subtle)** | `#E2E8F0` (`slate-200`) | `#1F2937` (`gray-800`) | Card borders, dividers, subtle table rows |
| **Border Strong** | `#CBD5E1` (`slate-300`) | `#374151` (`gray-700`) | Input borders, active tab borders |
| **Ring (Focus)** | `#2563EB` with 35% opacity | `#60A5FA` with 45% opacity | Accessible keyboard navigation indicator |

### Status Tokens (Never rely on color alone — always accompany with icon + text)
- **Scheduled / Queue:**
  - Light: `#0284C7` (Sky) | Bg: `#F0F9FF` | Border: `#BAE6FD`
  - Dark: `#38BDF8` | Bg: `#082F49`/30 | Border: `#0369A1`
- **Published / Success:**
  - Light: `#16A34A` (Green) | Bg: `#F0FDF4` | Border: `#BBF7D0`
  - Dark: `#4ADE80` | Bg: `#052E16`/30 | Border: `#15803D`
- **Draft:**
  - Light: `#64748B` (Slate) | Bg: `#F8FAFC` | Border: `#E2E8F0`
  - Dark: `#94A3B8` | Bg: `#1E293B`/40 | Border: `#334155`
- **Failed / Error:**
  - Light: `#DC2626` (Red) | Bg: `#FEF2F2` | Border: `#FECACA`
  - Dark: `#F87171` | Bg: `#450A0A`/40 | Border: `#991B1B`
- **Warning / Action Required:**
  - Light: `#D97706` (Amber) | Bg: `#FFFBEB` | Border: `#FDE68A`
  - Dark: `#FBBF24` | Bg: `#451A03`/40 | Border: `#B45309`

### Channel Brand System (Reserved strictly for channel badges, platform icons, and previews)
- **Twitter / X:** `#000000` (Dark: `#FFFFFF`)
- **LinkedIn:** `#0A66C2`
- **Facebook:** `#1877F2`
- **Instagram:** `#E4405F` (Gradient allowed only on official brand avatar icon border: `linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)`)
- **YouTube:** `#FF0000`
- **Threads:** `#000000` (Dark: `#FFFFFF`)
- **Bluesky:** `#0085FF`
- **Pinterest:** `#BD081C`

---

## 3. Typography Architecture

### Font Families
- **Primary Heading & UI Font:** `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`
- **Body & Editorial Font:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Monospace / Counter / Timestamp Font:** `JetBrains Mono`, `Fira Code`, `monospace`

### Font Scale & Line Heights

| Style Token | Size (px / rem) | Weight | Line Height | Letter Spacing | Target Breakpoints & Usage |
|-------------|----------------|--------|-------------|----------------|----------------------------|
| `text-display` | `32px` / `2.0rem` | `700` (Bold) | `1.2` | `-0.03em` | Main dashboard titles (1024px+) |
| `text-h1` | `24px` / `1.5rem` | `700` (Bold) | `1.25` | `-0.025em` | Page headers, Modal titles |
| `text-h2` | `20px` / `1.25rem` | `600` (SemiBold) | `1.3` | `-0.02em` | Section headers, Card group headers |
| `text-h3` | `16px` / `1.0rem` | `600` (SemiBold) | `1.4` | `-0.01em` | Card titles, Table header groups |
| `text-body` | `14px` / `0.875rem` | `400` (Regular) | `1.5` | `0em` | Default UI text, table rows, form inputs |
| `text-body-strong` | `14px` / `0.875rem` | `600` (SemiBold) | `1.5` | `0em` | Table data emphasis, active menu items |
| `text-sm` | `13px` / `0.8125rem` | `400` / `500` | `1.45` | `0em` | Metadata, post preview copy, helper hints |
| `text-caption` | `12px` / `0.75rem` | `500` / `600` | `1.4` | `+0.01em` | Badges, channel handles, timestamps |
| `text-micro` | `11px` / `0.6875rem` | `600` (SemiBold) | `1.3` | `+0.03em` | Character counters, uppercase label caps |

### Responsive Type Behavior
- On mobile (`375px`), `text-display` steps down to `24px` (`text-h1`), preventing headline clipping or excessive wrapping.
- All body copy maintains minimum `14px` (`13px` for secondary metadata), preserving touch legibility and avoiding iOS auto-zoom on input focus.

---

## 4. Spacing System & Layout Grid

Spacing adheres strictly to a predictable 4px/8px modular scale. Arbitrary values (e.g. `margin: 19px`) are forbidden.

| Token | Value | Tailwind Class | Concrete Usage |
|-------|-------|----------------|----------------|
| `space-1` | `4px` | `gap-1`, `p-1` | Micro-gaps between badge icon and text |
| `space-2` | `8px` | `gap-2`, `p-2` | Component internal padding, compact button gaps |
| `space-3` | `12px` | `gap-3`, `p-3` | Form field spacing, list item padding |
| `space-4` | `16px` | `gap-4`, `p-4` | Standard card internal padding, toolbar gaps |
| `space-5` | `20px` | `gap-5`, `p-5` | Modal header-to-body spacing, medium grid gap |
| `space-6` | `24px` | `gap-6`, `p-6` | Section divider padding, container padding |
| `space-8` | `32px` | `gap-8`, `p-8` | Major section margins on desktop |
| `space-10` | `40px` | `gap-10`, `p-10` | Empty state vertical spacing |
| `space-12` | `48px` | `gap-12`, `p-12` | Page top header padding on wide monitors |
| `space-16` | `64px` | `gap-16`, `p-16` | Unauthenticated auth/landing section padding |
| `space-20` | `80px` | `gap-20`, `p-20` | Hero container vertical breathing room |

### Layout Grid & Container Dimensions
- **Sidebar Width (Desktop Expanded):** `260px`
- **Sidebar Width (Desktop Collapsed):** `68px`
- **Content Max Width:** `1440px` (fluid with `mx-auto` on ultrawide monitors)
- **Main Viewport Inset:** `px-4 py-4 md:px-6 md:py-6 lg:px-8`

---

## 5. Component Design System Specifications

### 1. Button (`Button`, `IconButton`)
- **Variants:**
  - `primary`: Solid `#2563EB` (Dark: `#3B82F6`), text white, subtle shadow `shadow-sm hover:shadow hover:bg-blue-700 active:bg-blue-800`.
  - `secondary`: Slate surface `bg-secondary text-secondary-foreground hover:bg-slate-200 dark:hover:bg-slate-700 border border-border`.
  - `outline`: `bg-transparent border border-border text-foreground hover:bg-muted/60`.
  - `ghost`: Transparent background, `hover:bg-muted/80 text-foreground`.
  - `destructive`: `bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm`.
- **Sizes:**
  - `xs`: `h-7 px-2.5 text-xs rounded-md`
  - `sm`: `h-8 px-3 text-xs rounded-lg`
  - `default`: `h-9.5 px-4 text-sm font-medium rounded-lg`
  - `lg`: `h-11 px-5 text-sm font-semibold rounded-xl`
  - `icon`: `size-9 p-0 flex items-center justify-center rounded-lg`
- **States:**
  - `focus-visible`: `ring-2 ring-primary ring-offset-2 ring-offset-background outline-none`
  - `disabled`: `opacity-50 cursor-not-allowed pointer-events-none`
  - `loading`: Replaces icon with `<Spinner className="size-4 animate-spin" />`, text remains intact or transitions to "Saving..."

### 2. Form Inputs (`Input`, `Textarea`, `Select`, `Combobox`)
- **Structure:** Always paired with visible `<Label>` and optional helper/error text.
- **Heights & Padding:** Inputs `h-10 px-3 py-2 text-sm rounded-lg border border-border bg-background hover:border-slate-400 dark:hover:border-slate-600 transition-colors`.
- **Textarea:** Minimum height `120px`, auto-resizing where supported, character counter pinned to bottom right.
- **Focus:** `focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none`.
- **Validation Error:** `border-red-500 focus:border-red-500 focus:ring-red-500/20 text-foreground` + `<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="size-3.5" /> {message}</p>`.

### 3. Checkbox, Radio, Switch
- **Hit Target:** Minimum tap area `44px x 44px` on mobile (using invisible padding or flex wrapper).
- **Switch:** `h-6 w-11 rounded-full p-0.5 transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-700`.

### 4. Badge & Status Chips
- **Geometry:** `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border`.
- **Types:**
  - `Scheduled`: Sky background + Sky dot + "Scheduled for [Date]"
  - `Published`: Emerald background + Emerald CheckCircle + "Published"
  - `Draft`: Slate background + Slate FileEdit + "Draft"
  - `Failed`: Red background + Red AlertTriangle + "Failed"
  - `Platform`: Specific channel icon + handle

### 5. Dialogs, Modals, Drawers & Confirmation Alerts
- **Scrim Overlay:** `bg-black/60 backdrop-blur-sm fixed inset-0 z-50 animate-in fade-in-0 duration-200`.
- **Modal Body:** `bg-surface border border-border shadow-2xl rounded-2xl max-w-lg w-full p-6 z-50`.
- **Destructive Confirmation:** Requires clear modal with explicit explanation of consequence ("Disconnecting Twitter will cancel 3 scheduled posts"), red confirmation button, and "Cancel" secondary button.
- **Mobile Behavior:** Bottom drawer on `<= 768px` for better one-hand ergonomics.

### 6. Toast Notifications (Sonner)
- **Position:** Bottom right on desktop (`bottom-4 right-4`), top center on mobile (`top-4 inset-x-4`).
- **Icons:** Success (CheckCircle2), Error (XCircle), Info (Info), Warning (AlertTriangle).
- **Duration:** 4000ms default; sticky with action button for recoverable errors.

### 7. Tables & Data Lists
- **Header:** Sticky `bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border h-10 px-4`.
- **Rows:** `h-14 px-4 hover:bg-muted/30 transition-colors border-b border-border/60 flex items-center`.
- **Mobile Adaptation:** Switches from multi-column table to structured card stack on `<= 768px`.

---

## 6. Information Architecture & Navigation

```
Media Scheduler App Architecture
│
├── Dashboard (Overview)                [/dashboard]
│   ├── Publishing Status Cards (Queue, Published, Failed, Drafts)
│   ├── Next Up (Chronological scheduled posts for next 24-48 hours)
│   ├── Channel Health & Sync Status (Connected platforms & expiry warnings)
│   ├── Quick Actions (Create Post, Connect Channel, View Calendar)
│   └── Weekly Activity Sparkline / Performance Summary
│
├── Content                             [/content]
│   ├── All Posts                       [/content]
│   ├── Scheduled (Queue)               [/content?status=queue]
│   ├── Drafts                          [/content?status=draft]
│   ├── Published (History)             [/content?status=published]
│   └── Failed (Attention Needed)       [/content?status=failed]
│
├── Calendar                            [/schedule]
│   ├── Month View
│   ├── Week View
│   ├── Day View
│   ├── Filters (By Channel, By Status)
│   └── Quick Schedule on Slot Click
│
├── Create & Compose                    [Post Composer Dialog / Drawer]
│   ├── Multi-Platform Selector (Toggle X, LinkedIn, FB, IG, etc.)
│   ├── Rich Text Editor with Character Counter per Platform
│   ├── Media Upload & Library Picker (Images, Video, Carousel)
│   ├── Platform Live Previews (Pixel-accurate tabbed preview)
│   ├── Scheduling Timezone & Optimal Time Picker
│   └── Actions: Publish Now, Schedule, Save Draft
│
├── Media Library                       [/media]
│   ├── Asset Grid & List Views
│   ├── Upload Dropzone (Drag-and-Drop, Multi-file)
│   ├── Filter by Type (Images, Videos, GIFs)
│   └── Asset Details & Direct "Create Post with Media" action
│
├── Ideas & Kanban                      [/ideas]
│   ├── Brainstorming Columns (Backlog, In Progress, Ready to Schedule)
│   └── AI Content Assistant & Idea Generation
│
├── Social Accounts                     [/settings/channels]
│   ├── Connected Accounts (Profile avatar, handle, follower count, sync status)
│   ├── Available Integrations (OAuth Connect Buttons)
│   └── Channel Health & Permission Re-authentication
│
├── Analytics                           [/analytics]
│   ├── Cross-Platform Performance (Reach, Impressions, Engagement)
│   ├── Top Performing Posts
│   └── Best Times to Post Insights
│
├── Notifications                       [/notifications]
│   ├── Post Published Confirmation
│   ├── Post Failed Alert with Retry Action
│   └── Token Expiry & Connection Warnings
│
└── Settings                            [/settings]
    ├── Account & Profile
    ├── Channels & Integrations
    ├── Team & Workspace
    ├── Billing & Subscription
    └── Preferences (Theme, Timezone, Default Channels)
```

---

## 7. Content Calendar UX Master Standard

1. **Information Density & Clarity:** Calendar cells must show date number, count of posts, and compact post chips colored with the respective channel's accent bar and status dot.
2. **Multiple Time Horizons:**
   - **Month View:** High-level overview of publishing cadence. Overloaded days show "+3 more" badge that opens day popover on click.
   - **Week View:** Time-grid format displaying exact publishing slots throughout the week.
   - **Day View:** Hourly breakdown displaying full post preview card, attached media thumbnails, and retry/reschedule buttons.
3. **Slot Interaction:** Clicking any empty slot immediately opens the Post Composer pre-filled with that slot's date and hour.
4. **Post Inspection:** Clicking a post chip opens a rapid preview popover with:
   - Full post copy
   - Media thumbnail
   - Connected channels
   - Status badge
   - Quick actions: "Edit", "Reschedule", "Publish Now", "Delete"
5. **Filters:** Sticky calendar header with multi-select channel filter pills and status toggles (Draft, Queued, Published, Failed).

---

## 8. Post Composer UX Master Standard

1. **Multi-Channel Target Selection:** Header allows one-click toggling of connected accounts (e.g. X + LinkedIn + Instagram).
2. **Channel-Specific Validation & Counter:**
   - Dynamic counter badge for each selected channel (e.g. X: 280 max, LinkedIn: 3000 max).
   - Real-time warning if post exceeds a specific platform's character limit or video length restriction.
3. **Media Management:**
   - Supports drag-and-drop file upload directly into the composer.
   - Allows choosing existing assets from the Media Library.
   - Thumbnails show file size, format tag, and remove button.
4. **Live Platform Preview:**
   - Split-screen (desktop) or tabbed preview (mobile) displaying how the post will look on the selected channels.
   - Render accurate platform avatar, name, handle, verified badge, copy formatting, and media aspect ratios.
5. **Scheduling Controls:**
   - Date picker with calendar popup.
   - Time picker with AM/PM or 24h toggle.
   - Explicit display of target timezone (e.g., `America/New_York (UTC-5)`).
   - "Suggested Best Time" AI/analytics quick buttons.

---

## 9. UX States & Edge Cases

### Loading States
- Never leave a blank container while data fetches.
- Use animated skeleton loaders (`<Skeleton className="h-10 w-full rounded-lg" />`) that precisely replicate the geometry of cards, table rows, and calendar cells.
- Primary buttons display inline `<Spinner className="size-4 animate-spin mr-2" />` while preserving label or updating to "Saving...".

### Empty States
- Must feature a meaningful vector illustration/icon (from Lucide/Phosphor).
- Title explaining what is missing (e.g., "No posts scheduled for this week").
- Subtitle explaining the benefit of taking action.
- Direct primary CTA (e.g., `<Button><Plus className="size-4 mr-2" /> Schedule Your First Post</Button>`).

### Error States
- Inline field errors for form validation.
- Banner/callout cards for API or synchronization failures with exact diagnostic reason and a single-click "Retry" action.
- Avoid raw technical stack traces in end-user views.

### Offline & Connection Failures
- If client loses internet connection, show a persistent non-blocking banner: "You are offline. Changes will sync when reconnected."
- Disallow destructive actions while offline.

---

## 10. Micro-Interactions & Motion Guidelines

Adheres to a low motion dial (`3/10 — Subtle`) to ensure instant perceived speed and avoid distraction:
- **Button / Card Hover:** `transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease`. No layout-shifting scale transforms.
- **Modals & Dialogs:** `transition: opacity 200ms ease, transform 200ms cubic-bezier(0.16, 1, 0.3, 1)`. Small 8px slide-in (`translate-y-2 -> translate-y-0`).
- **Tab Switching:** Fluid layout indicator using Framer Motion `layoutId="activeTab"` with `transition: { type: "spring", bounce: 0.15, duration: 0.3 }`.
- **Prefers-Reduced-Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 11. Anti-Patterns & Forbidden Practices

- ❌ **NO generic AI purple/pink gradients or glowing mesh blobs** on product dashboards.
- ❌ **NO emoji icons** as navigation or system icons (use Lucide/Phosphor vector SVGs).
- ❌ **NO un-truncated text overflows** that clip content or produce accidental horizontal scrollbars.
- ❌ **NO ambiguous colors without labels** (e.g. green circle without "Published" text or screen reader announcement).
- ❌ **NO tiny tap targets** (< 44px on touch devices).
- ❌ **NO unconfirmed destructive actions** (disconnecting accounts or deleting posts must require confirmation).
- ❌ **NO decorative charts** with fake data that provide no actionable publishing value.
- ❌ **NO missing focus rings** for keyboard navigation users.

---

## 12. Verification & Pre-Delivery Audit Checklist

- [ ] Design tokens and CSS variables strictly followed
- [ ] Contrast ratio >= 4.5:1 on all text elements in both Light and Dark themes
- [ ] No emoji used for system controls or status indicators
- [ ] Vector icons from Lucide icon family with consistent 1.5px/2px stroke
- [ ] Keyboard navigation: `Tab`, `Shift+Tab`, `Enter`, `Escape` work across all dialogs, dropdowns, and calendar views
- [ ] Responsive layouts verified at `375px`, `768px`, `1024px`, and `1440px`
- [ ] Zero horizontal viewport scrolling on mobile
- [ ] Touch targets >= 44x44px on mobile
- [ ] Loading skeleton states exist for all asynchronous queries
- [ ] Empty states with actionable CTAs exist for all empty collections
- [ ] Platform previews render accurately for connected networks
- [ ] Reduced-motion media query respected
