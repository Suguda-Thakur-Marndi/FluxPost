# Page Design System: Billing & Subscription (/billing)

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for Billing are defined here.

---

## 1. Page Purpose & Mental Model
The Billing page clearly communicates the user's active tier, usage limits, and renewal timing. It wraps Clerk's `<PricingTable />` with a polished SaaS dashboard without inventing mock backend payment endpoints.

---

## 2. Layout Architecture

```
+------------------------------------------------------------------------------------+
| Header: "Billing & Subscription" + Manage Plans Subtitle                          |
+------------------------------------------------------------------------------------+
| Active Subscription Hero Card:                                                     |
| [ Current Plan: Pro ]  [ Status: Active ]  [ Renews: Oct 1, 2026 ]  [ Auto-renew ] |
+------------------------------------------------------------------------------------+
| Usage Metrics Bar (3 Cards):                                                       |
| - Posts Scheduled: 42 / Unlimited                                                  |
| - Connected Channels: 5 / 8 platforms                                              |
| - AI Content Generations: 128 / Unlimited                                          |
+------------------------------------------------------------------------------------+
| Clerk Embedded Subscription & Pricing Table:                                       |
| - Free Plan                                                                        |
| - Pro Plan (Active)                                                                |
| - Team Plan                                                                        |
+------------------------------------------------------------------------------------+
| Payment & Invoice History Table:                                                   |
| - Date | Invoice ID | Amount | Status | Download Receipt                           |
+------------------------------------------------------------------------------------+
```

---

## 3. Important Implementation Rules
- Do NOT invent fake backend checkout endpoints.
- Seamlessly wrap Clerk's official `<PricingTable />` component.
- Display clean progress bars for quota tracking.
