# Page Design System: Connected Channels (/settings?tab=channels or /channels)

> **Inherits from:** `design-system/media-scheduler/MASTER.md`  
> **Rule:** Only deviations, specific layout structures, and component placements for Channels management are defined here.

---

## 1. Page Purpose & Mental Model
The Channels page is the connectivity hub where users manage authentication with external social platforms. It must communicate account health, connection timestamps, and token states with absolute reliability and zero credential leakage.

---

## 2. Layout Architecture

```
+------------------------------------------------------------------------------------+
| Header: "Connected Social Accounts" + Sync All Status + Explanatory Subtitle       |
+------------------------------------------------------------------------------------+
| Channels Grid (Responsive 1-col on mobile, 2-col on tablet, 3 or 4-col on desktop):|
|                                                                                    |
| [ Twitter / X Card ]       [ LinkedIn Card ]           [ Instagram Card ]          |
| Status: Connected          Status: Connected           Status: Disconnected        |
| Handle: @teamlemon         Handle: Lemon AI            CTA: [Connect Instagram]   |
| Last synced: 10m ago       Last synced: 1h ago                                     |
| [Disconnect] [Settings]    [Disconnect] [Settings]                                 |
|                                                                                    |
| [ Facebook Card ]          [ Threads Card ]            [ Bluesky Card ]            |
| [ YouTube Card ]           [ TikTok Card ]                                         |
+------------------------------------------------------------------------------------+
```

---

## 3. Supported Platforms
1. Twitter / X
2. LinkedIn
3. Instagram
4. Facebook
5. Threads
6. Bluesky
7. YouTube
8. TikTok

---

## 4. Component Specifications

### Channel Card States
- **Connected State:**
  - Border: Subtle border `border-border/80 hover:border-slate-300 dark:hover:border-slate-700`
  - Status badge: Emerald check badge ("Connected & Active")
  - Profile info: Avatar, account display name, and @handle
  - Timestamp: "Last synced [X minutes/hours ago]"
  - Actions: "Disconnect" button (opens confirmation alert) and "Reconnect / Refresh token"
- **Disconnected State:**
  - Border: Dashed or muted border `border-dashed border-border`
  - Status badge: Neutral badge ("Not Connected")
  - Clear primary CTA button: "Connect [Platform Name]"
- **Error / Expired State:**
  - Border: Red/amber border `border-amber-300 dark:border-amber-800 bg-amber-50/20`
  - Alert banner: Clear explanation ("Authentication expired. Reconnect to resume scheduled publishing.")
  - Action button: "Reconnect Account" (Highlighted)
- **Security Rule:** Never render raw OAuth tokens, client secrets, or sensitive hashes.
