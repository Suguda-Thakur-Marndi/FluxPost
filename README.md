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
npm run docker:build      # Build the Docker image
npm run docker:run        # Run container with .env.local
npm run docker:up         # Start containers with Docker Compose
npm run docker:down       # Stop containers
```

## Running with Docker

### Using Docker Compose (Recommended)

1. Make sure your `.env.local` or `.env` file is created with required variables.
2. Start the application:
   ```bash
   docker compose up --build -d
   ```
3. To include the Inngest Dev Server for background scheduling workflows:
   ```bash
   docker compose --profile with-inngest up --build -d
   ```
4. Access the application at [http://localhost:3000](http://localhost:3000) (and Inngest dashboard at [http://localhost:8288](http://localhost:8288)).
5. Stop the containers:
   ```bash
   docker compose down
   ```

### Using Docker CLI Directly

1. Build the Docker image:
   ```bash
   docker build -t media-scheduler .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env.local media-scheduler
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
Dockerfile          # Multi-stage optimized container image
docker-compose.yml  # Container orchestration setup
.dockerignore       # Docker build context exclusions
```

## Deployment

This project is ready to be deployed via Docker (AWS ECS, Google Cloud Run, Azure Container Apps, DigitalOcean, Railway, Render) or to Vercel. Make sure all required environment variables are configured in your hosting environment.

```bash
vercel
```

Add all environment variables in your hosting dashboard before deployment.

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

