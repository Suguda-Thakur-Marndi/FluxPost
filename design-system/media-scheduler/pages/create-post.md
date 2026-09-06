# Page Design System: Post Composer (Create Post)

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for the Post Composer are defined here.

---

## 1. Page Purpose & Mental Model
The Post Composer is the creative engine. The experience must answer three core questions clearly at all times:
1. **Where is this being posted?** (Which channels are toggled)
2. **What will it look like?** (Live, realistic preview of text and media)
3. **When will it go live?** (Exact scheduled date, time, and timezone)

---

## 2. Layout Structure

On desktop (>= 1024px), use a side-by-side two-column split layout:
- **Left Column (55%):** Channel selector, post textarea, media uploader/picker, date & time scheduler, action bar.
- **Right Column (45%):** Live interactive Platform Preview tabs (switching between selected platforms to see real simulated feeds).

On tablet & mobile (< 1024px):
- Single-column layout with a sticky top tab switcher: `[ Compose | Preview ]`.

---

## 3. Specific Component Overrides & Tokens

### Channel Selector Pills
- Row of toggle buttons with channel avatar and name.
- Active state: Channel border with matching channel tint (`bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-foreground`).
- Inactive state: `opacity-50 grayscale hover:grayscale-0 hover:opacity-80`.
- Validation: At least one channel must be active before "Publish" or "Schedule" is enabled.

### Post Textarea & Character Limiter
- Resizable vertical textarea with clean typography matching platform guidelines.
- Dynamic character counter chip pinned to bottom-right:
  - Twitter/X: 280 max (Turns amber at 260, red at > 280)
  - LinkedIn: 3000 max
  - Instagram: 2200 max
  - Facebook: 63,206 max
  - Threads: 500 max
  - Bluesky: 300 max
- If multiple channels are selected, the counter warns against the **most restrictive** active channel.

### Media Dropzone & Asset Selector
- Drag-and-drop file target + "Browse Media Library" button.
- Uploaded media row with drag-to-reorder thumbnails.
- Shows file size, resolution/aspect ratio warning (e.g. "Instagram requires 1:1 or 4:5 for feed posts").

### Live Platform Preview Cards
- Pixel-perfect replicas of official mobile/web feed cards:
  - **Twitter / X:** Dark/Light feed item with user handle, timestamp ("just now"), verified badge, text formatting, media container with rounded corners, action row (reply, retweet, like, analytics).
  - **LinkedIn:** Business post card with author headline, connection degree, rich text formatting, media attachment, reaction icons (Like, Celebrate, Support, Insightful).
  - **Instagram:** Square/portrait media frame with top author bar, carousel pagination dots, double-tap heart animation, caption and hashtag display.
  - **Facebook:** Feed card with globe privacy icon, text copy, edge-to-edge media block, reaction counter bar.

### Action Footer
- Primary button: "Schedule Post" (or "Publish Now" if toggle active).
- Secondary button: "Save as Draft".
- Tertiary button: "Cancel / Close".
- Shows scheduled summary string: *"Will publish to 3 channels on Thursday, Oct 12 at 9:30 AM EST"*.
