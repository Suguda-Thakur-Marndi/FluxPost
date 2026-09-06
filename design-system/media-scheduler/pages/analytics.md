# Page Design System: Analytics & Performance

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for the Analytics page are defined here.

---

## 1. Page Purpose & Mental Model
The Analytics page turns publishing telemetry into actionable scheduling decisions. Rather than burying the user under twenty decorative, indecipherable graphs, it focuses on three high-leverage insights:
1. **What content type resonates best?**
2. **Which platform yields the highest engagement?**
3. **What time of day produces peak reach?**

---

## 2. Layout Structure & Toolbar

```
+-----------------------------------------------------------------------------------+
| Header: "Analytics & Insights" | [ Time Range: 7D | 30D | 90D ▼ ] [ Export CSV ] |
+-----------------------------------------------------------------------------------+
| Top KPI Row: 4 Metric Cards (Total Reach, Engagements, Avg Engagement Rate, Posts Published) |
+-----------------------------------------------------------------------------------+
| Main Chart: Publishing & Engagement Trend (Area / Bar Chart with channel breakdown) |
+-----------------------------------------------------------------------------------+
| Lower Grid:                                                                       |
| [ Left (60%): Top Performing Posts Table with metric sort ]                       |
| [ Right (40%): Platform Distribution & Best Times to Post Heatmap ]               |
+-----------------------------------------------------------------------------------+
```

---

## 3. Specific Component Overrides & Tokens

### KPI Cards with Trend Indicators
- Four cards featuring:
  - Metric title + Tooltip explaining calculation
  - Big number in `text-2xl font-bold`
  - Delta badge (`+14.2% vs previous period` with green UpArrow or red DownArrow)
  - Sparkline mini-graph showing 7-day trajectory

### Engagement Trend Chart
- Line/Area chart built with accessible data labels.
- Tooltip displays exact timestamp, post title, channel, and metrics on hover.
- Legend toggles individual channels on and off.
- High contrast colors: Sky Blue (`#0284C7`), Emerald (`#16A34A`), Amber (`#D97706`), Violet (`#7C3AED`).

### Top Performing Posts Table
- Columns:
  1. Post Snippet & Channel icon
  2. Published Date
  3. Impressions / Reach
  4. Clicks
  5. Engagement Rate (%)
  6. Action ("Duplicate / Repurpose to Queue")

### Best Time to Post Heatmap
- 7 rows (Mon-Sun) x 24 columns (Hours 00:00 to 23:00) with color intensity indicating historical engagement rate.
- Tooltip shows: "Wednesday at 10:00 AM — Average 4.8% engagement rate across 12 posts".
- One-click action: "Schedule post for this recommended slot".
