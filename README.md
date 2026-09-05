# Media Scheduler

Media Scheduler is a Next.js application for creating, organizing, scheduling, and publishing social media content from one workspace. It combines an AI-assisted ideas board, a content calendar, media uploads, social-channel OAuth connections, and background publishing jobs.

## Features

- Clerk authentication with protected dashboard routes
- Dashboard overview with post totals and recent scheduling activity
- Idea board with groups, drag-and-drop organization, image support, and AI idea generation
- Post creation and editing with text, images, channel selection, and scheduled publish times
- Calendar and list views for scheduled posts
- Post previews before publishing
- OAuth connection management for Twitter/X, LinkedIn, Instagram, Facebook, Threads, Bluesky, YouTube, and TikTok
- Encrypted storage of connected-channel access and refresh tokens
- AI-assisted post and idea generation through the InsForge backend
- Inngest cron and event functions for scheduled publishing
- Light and dark themes
- Health endpoint for local and container monitoring

> OAuth connection support exists for all listed providers. The current background publishing implementation has provider-specific publishing code for Twitter/X and LinkedIn; other providers can connect and store tokens but are not yet supported by the scheduled publisher.

## Technology

- Next.js `16.2.9` App Router
- React `19.2.4` and TypeScript
- Tailwind CSS v4 and shadcn/ui components
- Clerk for authentication
- InsForge SDK and PostgreSQL for backend data, storage, and AI access
- TanStack Query for client data fetching
- Inngest for scheduled/background jobs
- `react-big-calendar` for calendar views
- Docker with Next.js standalone output for production containers

## Prerequisites

- Node.js 20 or newer
- npm
- A Clerk application
- An InsForge project
- OAuth applications for the social providers you want to connect
- Docker Desktop, only if you want to use the container workflow

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root. Start from `.env.example` if useful, but verify the variable names against the list below. Never commit `.env`, `.env.local`, API keys, client secrets, or encryption keys.

#### Core variables

```env
# InsForge
NEXT_PUBLIC_INSFORGE_BASE_URL=https://<project-id>.us-east.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=<insforge-anon-key>
INSFORGE_PROJECT_API_KEY=<server-side-project-api-key>

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_<key>
CLERK_SECRET_KEY=sk_test_<key>
CLERK_INSFORGE_TEMPLATE=insforge
NEXT_PUBLIC_CLERK_INSFORGE_TEMPLATE=insforge
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/routes/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/routes/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Generate both with:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CHANNEL_TOKEN_ENCRYPTION_KEY=<64-character-hex-key>
CHANNEL_OAUTH_STATE_SECRET=<64-character-hex-key>
```

`NEXT_PUBLIC_INSFORGE_ANON_KEY` is used to create the InsForge client. `INSFORGE_PROJECT_API_KEY` is used only for server-side administrative operations such as scheduled publishing and uploads.

The Clerk JWT template named by `CLERK_INSFORGE_TEMPLATE` must exist in the Clerk Dashboard and be configured for the InsForge project. Without that template, authenticated InsForge requests fall back to the project API key when it is available.

#### Social OAuth variables

For every provider you want to connect, define all six variables for that provider. The provider names must be uppercase.

```env
# Twitter / X
TWITTER_CLIENT_ID=<client-id>
TWITTER_CLIENT_SECRET=<client-secret>
TWITTER_AUTH_URL=https://x.com/i/oauth2/authorize
TWITTER_TOKEN_URL=https://api.x.com/2/oauth2/token
TWITTER_PROFILE_URL=https://api.x.com/2/users/me?user.fields=profile_image_url,username
TWITTER_SCOPES=tweet.read,users.read,tweet.write,offline.access,media.write

# Instagram
INSTAGRAM_CLIENT_ID=<client-id>
INSTAGRAM_CLIENT_SECRET=<client-secret>
INSTAGRAM_AUTH_URL=https://api.instagram.com/oauth/authorize
INSTAGRAM_TOKEN_URL=https://api.instagram.com/oauth/access_token
INSTAGRAM_PROFILE_URL=https://graph.instagram.com/me?fields=id,username,profile_picture_url
INSTAGRAM_SCOPES=instagram_basic,instagram_content_publish,pages_read_engagement

# Threads
THREADS_CLIENT_ID=<client-id>
THREADS_CLIENT_SECRET=<client-secret>
THREADS_AUTH_URL=https://threads.net/oauth/authorize
THREADS_TOKEN_URL=https://graph.threads.net/oauth/access_token
THREADS_PROFILE_URL=https://graph.threads.net/me?fields=id,username,threads_profile_picture_url
THREADS_SCOPES=threads_basic,threads_content_publish

# Facebook
FACEBOOK_CLIENT_ID=<client-id>
FACEBOOK_CLIENT_SECRET=<client-secret>
FACEBOOK_AUTH_URL=https://www.facebook.com/v19.0/dialog/oauth
FACEBOOK_TOKEN_URL=https://graph.facebook.com/v19.0/oauth/access_token
FACEBOOK_PROFILE_URL=https://graph.facebook.com/me?fields=id,name,picture
FACEBOOK_SCOPES=pages_show_list,pages_read_engagement,pages_manage_posts

# LinkedIn
LINKEDIN_CLIENT_ID=<client-id>
LINKEDIN_CLIENT_SECRET=<client-secret>
LINKEDIN_AUTH_URL=https://www.linkedin.com/oauth/v2/authorization
LINKEDIN_TOKEN_URL=https://www.linkedin.com/oauth/v2/accessToken
LINKEDIN_PROFILE_URL=https://api.linkedin.com/v2/userinfo
LINKEDIN_SCOPES=openid,profile,email,w_member_social

# Bluesky
BLUESKY_CLIENT_ID=<client-id>
BLUESKY_CLIENT_SECRET=<client-secret>
BLUESKY_AUTH_URL=https://bsky.social/oauth/authorize
BLUESKY_TOKEN_URL=https://bsky.social/oauth/token
BLUESKY_PROFILE_URL=https://bsky.social/xrpc/app.bsky.actor.getProfile
BLUESKY_SCOPES=atproto,transition:generic

# YouTube
YOUTUBE_CLIENT_ID=<client-id>
YOUTUBE_CLIENT_SECRET=<client-secret>
YOUTUBE_AUTH_URL=https://accounts.google.com/o/oauth2/v2/auth
YOUTUBE_TOKEN_URL=https://oauth2.googleapis.com/token
YOUTUBE_PROFILE_URL=https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true
YOUTUBE_SCOPES=https://www.googleapis.com/auth/youtube.upload,https://www.googleapis.com/auth/youtube.readonly

# TikTok
TIKTOK_CLIENT_ID=<client-id>
TIKTOK_CLIENT_SECRET=<client-secret>
TIKTOK_AUTH_URL=https://www.tiktok.com/v2/auth/authorize
TIKTOK_TOKEN_URL=https://open.tiktokapis.com/v2/oauth/token
TIKTOK_PROFILE_URL=https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,username
TIKTOK_SCOPES=user.info.basic,video.publish,video.upload
```

If a provider client ID is empty, local development uses a mock provider for that channel. This is useful for UI testing, but it does not validate a real provider OAuth flow or publish real content.

### 3. Apply the database schema

Run [`lib/db/create-social-scheduling-tables.sql`](lib/db/create-social-scheduling-tables.sql) in the SQL editor for your InsForge project. It creates and seeds:

- `channel_types`
- `user_channels`
- `idea_groups`
- `ideas`
- `scheduled_posts`
- The `requesting_user_id()` helper and row-level security policies

The migration is safe to rerun for its seed data and table definitions. Additional SQL fixes are available in [`lib/db/fix-channel-types-rls.sql`](lib/db/fix-channel-types-rls.sql) when needed for an existing database.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Application Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Application entry point | Public |
| `/landing`, `/features`, `/pricing`, `/workflow`, `/channels`, `/contact` | Marketing pages | Public |
| `/sign-in`, `/sign-up` | Clerk authentication pages | Public |
| `/dashboard` | Dashboard overview | Authenticated |
| `/ideas` | Idea board | Authenticated |
| `/schedule` | Calendar and scheduled posts | Authenticated |
| `/settings` | Connected channels and settings | Authenticated |
| `/billing` | Billing page | Authenticated |
| `/routes/...` | Alternate route tree retained for existing Clerk configuration | Mixed |

## API Routes

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Returns application health and uptime |
| `GET, POST, PUT /api/inngest` | Inngest function registration and events |
| `GET /api/channel` | List connected channels |
| `POST /api/channel/connect` | Start an OAuth connection |
| `GET /api/channel/callback` | Complete an OAuth connection |
| `POST /api/channel/disconnect` | Disconnect a channel |
| `GET, POST /api/idea` | List and create ideas |
| `PATCH, DELETE /api/idea/:id` | Update or delete an idea |
| `POST /api/idea/generate-ideas` | Generate AI idea suggestions |
| `GET, POST /api/post` | List and create posts |
| `PATCH, DELETE /api/post/:id` | Update or delete a post |
| `POST /api/post/:id/publish` | Publish a post immediately or queue it |
| `GET /api/post/totals` | Return post totals |
| `POST /api/post/generate-post` | Generate AI post copy |
| `POST /api/upload-image` | Upload post or idea images |

Authenticated API routes require a Clerk session. The Inngest endpoint is public so the local or hosted Inngest service can invoke it.

## Scheduled Publishing

The Inngest integration exposes two functions through `/api/inngest`:

1. `publish-scheduled-posts-cron` runs every 10 minutes and finds queued posts whose `scheduled_at` time has passed.
2. `publish-scheduled-post` handles the `post/publish.requested` event, refreshes an expired OAuth token when possible, publishes the post, and marks it `published` or `failed`.

For local background-job testing, start the app and the Inngest Dev Server:

```bash
docker compose --profile with-inngest up --build
```

The app is available at [http://localhost:3000](http://localhost:3000), and the Inngest dashboard is available at [http://localhost:8288](http://localhost:8288).

## Commands

```bash
npm run dev          # Start Next.js in development mode
npm run build        # Create a production build
npm start            # Start the production server
npm run lint         # Run ESLint
npm run docker:build # Build the production image
npm run docker:run   # Run the image with .env.local
npm run docker:up    # Start Docker Compose
npm run docker:down  # Stop Docker Compose
```

There is currently no automated test script in `package.json`. Use `npm run lint`, `npm run build`, and `GET /api/health` as the basic verification checks.

## Docker

Docker uses a multi-stage Node 20 Alpine image and runs Next.js as an unprivileged user. The image exposes port `3000` and includes a health check for `/api/health`.

```bash
# Build and run with Docker Compose
docker compose up --build

# Run the image directly
docker build -t media-scheduler .
docker run --env-file .env.local -p 3000:3000 media-scheduler
```

`NEXT_PUBLIC_*` variables are embedded into the client bundle during `docker build`, so they must be present as Compose build arguments or in the environment used by the build. Server-only secrets such as `CLERK_SECRET_KEY`, OAuth client secrets, and `INSFORGE_PROJECT_API_KEY` are supplied at runtime.

## Deployment

The standalone Docker image can run on any container platform that supports Node containers, including Cloud Run, ECS, Azure Container Apps, Railway, Render, and DigitalOcean. The application can also be deployed to Vercel.

Before deployment:

1. Set `NEXT_PUBLIC_APP_URL` to the public HTTPS origin.
2. Configure all required Clerk and InsForge variables in the hosting provider.
3. Configure the Clerk JWT template used by `CLERK_INSFORGE_TEMPLATE`.
4. Apply the InsForge SQL schema and verify row-level security.
5. Register each OAuth callback URL as `<APP_URL>/api/channel/callback` with the provider.
6. Run an Inngest worker or hosted Inngest environment against `<APP_URL>/api/inngest` if scheduled publishing is required.
7. Run `npm run build` before release.

## Security Notes

- Keep `.env` and `.env.local` out of version control.
- Generate separate encryption and OAuth-state secrets for each environment.
- Rotate any credential that has been exposed in logs, screenshots, commits, or shared files.
- Do not expose `CLERK_SECRET_KEY`, `INSFORGE_PROJECT_API_KEY`, OAuth client secrets, or channel encryption keys to the browser.
- Use HTTPS in production because OAuth callbacks and authentication cookies depend on a secure origin.

## Project Structure

```text
app/                 Next.js pages, layouts, and API route handlers
components/          Reusable UI and feature components
constants/           Channel and post constants
hooks/               Custom React hooks
inngest/             Inngest client and background functions
lib/                 InsForge, encryption, OAuth, and shared utilities
lib/db/              Database schema and SQL fixes
public/              Static assets
types/               Shared TypeScript types
Dockerfile           Multi-stage production container definition
docker-compose.yml   App and optional local Inngest services
proxy.ts             Clerk route protection middleware
```

## Current Limitations

- Scheduled publishing currently has provider-specific implementations for Twitter/X and LinkedIn only.
- OAuth provider APIs may require app review, production approval, redirect URI registration, or additional scopes before real accounts can connect or publish.
- No automated test suite is defined yet.
- Billing and analytics pages are present, but full payment and analytics workflows are not documented as implemented backend features.

## License and Author

This project was developed by Suguda Thakur Marndi. No license file is currently included in the repository.
