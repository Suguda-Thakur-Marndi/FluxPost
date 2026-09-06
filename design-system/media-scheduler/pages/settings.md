# Page Design System: Settings & Preferences

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for Settings are defined here.

---

## 1. Page Purpose & Mental Model
The Settings center allows users to manage user identity, connected channels, workspace team members, default publishing preferences, theme, and billing subscription without visual friction.

---

## 2. Layout Structure & Navigation

On desktop (>= 1024px), vertical sidebar tabs or horizontal segmented pills:
- Tabs:
  1. **Profile & Account** (Name, email, avatar, security)
  2. **Channels** (Connected social networks & API tokens)
  3. **Publishing Preferences** (Default timezone, default channels, shorten links toggle)
  4. **Appearance** (Light, Dark, System theme toggle)
  5. **Team & Workspace** (Invite members, role permissions: Admin, Editor, Viewer)
  6. **Billing & Plans** (Current subscription tier, invoice history, payment method)

---

## 3. Specific Component Overrides & Tokens

### Form Section Card
- Header with clear Section Title + Description.
- Border-delimited rows for each setting.
- Clean field labels with helper tooltips.
- Bottom action bar: "Save Changes" (Primary) + "Discard" (Ghost), enabled only when form state is dirty.

### Appearance Selector
- Three visual selection cards for Theme:
  - **Light:** Crisp white surface illustration with blue accent.
  - **Dark:** Deep obsidian slate surface illustration.
  - **System:** Split day/night illustration.
- Active state: Selected card has thick 2px primary border with blue checkmark badge in top-right.

### Team Member Table
- Avatar, Name, Email, Role selector (`Admin` / `Editor` / `Viewer`), Status (`Active` / `Invited`), Remove button.
- "Invite Member" modal with email input, role dropdown, and instant send button.
