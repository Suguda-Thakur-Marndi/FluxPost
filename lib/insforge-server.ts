import { auth } from '@clerk/nextjs/server';
import { createClient, type InsForgeClient } from '@insforge/sdk';

const BASE_URL = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;
const PROJECT_API_KEY = process.env.INSFORGE_PROJECT_API_KEY;
const TEMPLATE = process.env.CLERK_INSFORGE_TEMPLATE;

const SERVER_TOKEN_TEMPLATE = TEMPLATE || 'insforge';

type ClerkTokenError = {
  errors?: Array<{ code?: string }>;
};

/**
 * Refreshes the Clerk JWT token on the InsForge client.
 * Falls back to PROJECT_API_KEY when the Clerk JWT template is not found.
 * Called per-request — no background intervals (not safe in serverless).
 */
async function refreshAuthToken(client: InsForgeClient): Promise<void> {
  try {
    const session = await auth();
    const token = await session?.getToken({ template: SERVER_TOKEN_TEMPLATE });
    if (token) {
      client.getHttpClient().setAuthToken(token);
    } else {
      throw new Error('No token received from Clerk');
    }
  } catch (err: unknown) {
    const error = err as ClerkTokenError;

    if (error?.errors?.[0]?.code === 'resource_not_found') {
      console.warn(
        `[InsForge Auth] Clerk JWT Template '${SERVER_TOKEN_TEMPLATE}' not found. ` +
        `Please create it in your Clerk Dashboard to enable backend requests. ` +
        `Falling back to PROJECT_API_KEY.`
      );
    } else {
      console.error('[InsForge Auth] Failed to refresh Clerk token, falling back to PROJECT_API_KEY:', (err as Error).message);
    }

    if (PROJECT_API_KEY) {
      client.getHttpClient().setAuthToken(PROJECT_API_KEY);
    } else {
      client.getHttpClient().setAuthToken(null);
    }
  }
}

/**
 * Returns an InsForge client authenticated with the current Clerk user's JWT.
 * The token is refreshed on every call — safe for serverless/edge environments.
 * No background intervals are used.
 */
export async function getInsforgeServerClient(): Promise<{ insforge: InsForgeClient; userId: string | null }> {
  if (!BASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_INSFORGE_BASE_URL environment variable');
  }
  if (!ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_INSFORGE_ANON_KEY environment variable');
  }

  const { userId } = await auth();

  const client = createClient({
    baseUrl: BASE_URL,
    anonKey: ANON_KEY,
  });

  if (userId) {
    await refreshAuthToken(client);
  }

  return { insforge: client, userId };
}

/**
 * Returns an InsForge admin client authenticated with the PROJECT_API_KEY.
 * Use only in server-side Inngest functions and background jobs — never in user-facing routes.
 */
export function getInsforgeAdminClient(): InsForgeClient {
  if (!BASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_INSFORGE_BASE_URL environment variable');
  }
  if (!ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_INSFORGE_ANON_KEY environment variable');
  }
  if (!PROJECT_API_KEY) {
    throw new Error('Missing INSFORGE_PROJECT_API_KEY environment variable');
  }

  return createClient({
    baseUrl: BASE_URL,
    anonKey: PROJECT_API_KEY,
    isServerMode: true,
  });
}

export const getInsforgeUploadClient = getInsforgeAdminClient;
