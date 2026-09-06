# Page Design System: Notifications & Activity

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for the Notifications page are defined here.

---

## 1. Page Purpose & Mental Model
The Notifications center provides an audit trail of publishing events, automation outcomes, account alerts, and team interactions. It ensures creators never miss a publishing issue or expired credential.

---

## 2. Layout Structure & Toolbar

```
+-----------------------------------------------------------------------------------+
| Header: "Notifications" | [ Filter: All | Unread | Failed | Channels ] [ Mark All Read ] |
+-----------------------------------------------------------------------------------+
| Notification List (Grouped by Today, Yesterday, Earlier this week)                |
| - Individual Notification Rows with icon, timestamp, message, and quick action    |
+-----------------------------------------------------------------------------------+
```

---

## 3. Specific Component Overrides & Tokens

### Notification Item Hierarchy
- **Failed Post Alert (High Priority):**
  - Icon: `<AlertCircle className="size-5 text-red-600 bg-red-100 dark:bg-red-950/50 p-1 rounded-full" />`
  - Title: *"Publishing Failed: 'Quarterly Product Announcement' on LinkedIn"*
  - Reason: *"LinkedIn API responded: Media format not supported (400)"*
  - Actions: `[ Edit & Retry ]` `[ Dismiss ]`
- **Publish Success:**
  - Icon: `<CheckCircle2 className="size-5 text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 p-1 rounded-full" />`
  - Title: *"Successfully published to 3 channels"*
  - Action: `[ View Live Post ]`
- **Account Warning:**
  - Icon: `<Key className="size-5 text-amber-600 bg-amber-100 dark:bg-amber-950/50 p-1 rounded-full" />`
  - Title: *"Twitter connection expires in 48 hours"*
  - Action: `[ Reconnect ]`

### Read vs Unread State
- **Unread:** Slight primary tint background (`bg-blue-50/40 dark:bg-blue-950/15`), solid unread blue dot on right edge, bold text.
- **Read:** Standard surface background, neutral muted text.
