# Page Design System: Dashboard (Overview)

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for the Dashboard page are defined here.

---

## 1. Page Purpose & Mental Model
The Dashboard is the operational mission control for content publishing. When users open Media Scheduler, they must answer three questions within 3 seconds:
1. **What is scheduled next, and is it ready?**
2. **Did anything fail that requires immediate attention?**
3. **Are my connected social accounts active and authenticated?**

Avoid decorative generic SaaS fluff (e.g. giant irrelevant world maps or 12 unrelated metric cards).

---

## 2. Layout Structure (Desktop & Mobile)

```
+-----------------------------------------------------------------------------------+
| Top Header: "Overview" + Connected Channels Summary + [Add Post Button (Primary)] |
+-----------------------------------------------------------------------------------+
| Status Metrics Bar: 4 Cards (Queue / Published / Failed / Drafts)                 |
+-----------------------------------------------------------------------------------+
| Main Grid (2-Column on Desktop, 1-Column on Mobile):                              |
| [ Left Column (65%): Next 48 Hours Scheduled Queue Timeline ]                     |
| [ Right Column (35%): Channel Health Widget + Quick Post Ideas / AI Suggestion ]  |
+-----------------------------------------------------------------------------------+
| Bottom Section: Recent Publishing Activity Log                                   |
+-----------------------------------------------------------------------------------+
```

---

## 3. Specific Component Overrides & Tokens

### Metric Cards (Publishing Health)
- **Grid:** `grid grid-cols-2 lg:grid-cols-4 gap-4`
- **Queue Card:**
  - Icon: `<Clock className="size-5 text-sky-600 dark:text-sky-400" />`
  - Metric: Count of posts currently queued
  - Subtext: "Next post publishing in 2 hours"
- **Published Card:**
  - Icon: `<CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />`
  - Metric: Count of successfully published posts this cycle
- **Failed Card (High Priority Alert):**
  - Icon: `<AlertTriangle className="size-5 text-red-600 dark:text-red-400" />`
  - Metric: Count of failed posts
  - State: If > 0, highlight with subtle red border (`border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20`) and show "Review & Retry" link.
- **Drafts Card:**
  - Icon: `<FileText className="size-5 text-slate-600 dark:text-slate-400" />`
  - Metric: Total saved drafts

### Upcoming Queue Timeline
- Compact card layout showing chronologically ordered upcoming posts.
- Each item shows:
  - Time badge (`h:mm a`) + Day relative tag ("Today", "Tomorrow")
  - Channel badge (`X`, `LinkedIn`, etc.)
  - Post snippet (first 80 chars, truncated)
  - Attached media thumbnail (36x36px thumbnail or icon if video)
  - Quick hover actions: "Preview", "Reschedule", "Edit"

### Channel Health Status Widget
- Lists each connected social account:
  - Avatar, platform icon, handle
  - Connection status badge: "Active" (Green dot) or "Needs Re-auth" (Amber warning with "Reconnect" button)
  - Token expiration warning if expiring within 7 days.

---

## 4. Empty & Loading States
- **Loading:** 4 skeleton metric cards + 4 skeleton timeline rows.
- **Empty Queue:** Card with friendly illustration: "Your publishing queue is clear. Keep your audience engaged by scheduling your next post." with `<Button onClick={openComposer}><Plus className="size-4 mr-2" /> Schedule Post</Button>`.
