# Page Design System: Social Accounts (Channel Management)

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for Social Accounts are defined here.

---

## 1. Page Purpose & Mental Model
The Social Accounts page is the security, authentication, and integration hub for managing external social network connections. Users need complete transparency into account permissions, sync health, and token expiration to prevent unexpected publishing failures.

---

## 2. Layout Structure

```
+-----------------------------------------------------------------------------------+
| Header: "Connected Channels" (e.g. 4/8 Connected)                                 |
+-----------------------------------------------------------------------------------+
| Section 1: Connected Accounts (Active Cards Grid)                                 |
| - Grid of connected account cards with avatar, handle, health, and settings       |
+-----------------------------------------------------------------------------------+
| Section 2: Available Integrations (Connect New Platform)                          |
| - Grid of unlinked social platforms with one-click "Connect" OAuth action         |
+-----------------------------------------------------------------------------------+
```

---

## 3. Specific Component Overrides & Tokens

### Connected Account Card
- **Border & Background:** Clean surface card with 4px left accent border matching official platform color (e.g. `#0A66C2` for LinkedIn, `#1877F2` for Facebook).
- **Header:**
  - Platform brand icon pill.
  - Profile Avatar (with platform micro-badge in corner).
  - Account display name + `@handle`.
- **Metadata Row:**
  - **Connection Status:**
    - Green dot + "Connected & Active"
    - Amber dot + "Token Expiring Soon (3 days left)" + "Refresh Token" button
    - Red dot + "Disconnected / Re-auth Required" + "Reconnect" button
  - **Last Synced:** Timestamp (e.g., "Synced 12 mins ago")
  - **Permissions:** "Publish, Read Analytics"
- **Actions:**
  - "Sync Now" button (triggers instant background refresh).
  - Destructive "Disconnect" button (opens confirmation dialog warning of affected scheduled posts).

### Connect New Platform Card
- Displays platform logo, description ("Publish updates, carousels, and articles to your professional network"), and a clear OAuth CTA button ("Connect LinkedIn").
- Disabled during OAuth redirection with loading indicator.

### Disconnect Confirmation Modal
- Must require explicit user confirmation.
- Body details exactly which active scheduled posts will be cancelled or halted if this account is unlinked.
- Cancel button (Secondary) + "Disconnect Account" (Destructive Red).
