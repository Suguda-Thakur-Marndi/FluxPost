# Media Scheduler

Media Scheduler is a Next.js application for planning, generating, and publishing social media content from a single dashboard. It combines a content calendar, AI-assisted post ideas, scheduled publishing, and multi-channel account management in one place.

## Features

- Create and edit posts with rich text and media support
- Generate content ideas and post copy with AI assistance
- View scheduled content in calendar and list layouts
- Preview posts before publishing
- Connect and manage social channels through OAuth
- Automate publishing workflows with Inngest
- Use Clerk for authentication and InsForge for backend services

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Inngest
- Clerk
- InsForge
- PostgreSQL

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

Create a `.env.local` file in the project root and add the variables below.

```env
# InsForge
NEXT_PUBLIC_INSFORGE_BASE_URL=
NEXT_PUBLIC_INSFORGE_ANON_KEY=
INSFORGE_PROJECT_API_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_INSFORGE_TEMPLATE=insforge

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security
CHANNEL_TOKEN_ENCRYPTION_KEY=
CHANNEL_OAUTH_STATE_SECRET=

# OAuth providers (add the ones you plan to use)
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
TWITTER_AUTH_URL=https://x.com/i/oauth2/authorize
TWITTER_TOKEN_URL=https://api.x.com/2/oauth2/token
TWITTER_PROFILE_URL=https://api.x.com/2/users/me
TWITTER_SCOPES=tweet.read,users.read,tweet.write,offline.access

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=

THREADS_CLIENT_ID=
THREADS_CLIENT_SECRET=

TIKTOK_CLIENT_ID=
TIKTOK_CLIENT_SECRET=

YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=

BLUESKY_CLIENT_ID=
BLUESKY_CLIENT_SECRET=
```

> If you use Clerk JWT templates for InsForge, make sure the template named in `CLERK_INSFORGE_TEMPLATE` exists in your Clerk dashboard.

### 3. Run the app

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Project Structure

```text
app/                # Next.js app router pages and API routes
components/         # Reusable UI components
lib/                # Shared utilities and server integrations
hooks/              # Custom React hooks
inngest/            # Scheduled/background workflow definitions
types/              # Shared TypeScript types
public/             # Static assets
```

## Deployment

This project is ready to be deployed to Vercel or any other platform that supports Next.js. Make sure all required environment variables are configured in your hosting environment.

```bash
vercel
```

Add all environment variables in the Vercel dashboard before deployment.

---

## Future Improvements

* Team collaboration
* Advanced analytics
* AI content generation enhancements
* Bulk scheduling
* Social listening
* Engagement tracking
* Custom workflows

---

## Author

Developed by Suguda Thakur Marndi. 

