import { auth } from '@clerk/nextjs/server';
import { createClient, type InsForgeClient } from '@insforge/sdk';

const BASE_URL = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY
const PROJECT_API_KEY = process.env.INSFORGE_PROJECT_API_KEY
const TEMPLATE = process.env.CLERK_INSFORGE_TEMPLATE;

const SERVER_TOKEN_TEMPLATE = TEMPLATE || 'insforge';

const TOKEN_REFRESH_MS = 50_000;

let cachedClient: InsForgeClient | null = null;
let cachedUserId: string | null = null;
let refreshInterval: NodeJS.Timeout | null = null;

type ClerkTokenError = {
  errors?: Array<{ code?: string }>;
};

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
      console.warn(`[InsForge Auth] Clerk JWT Template '${SERVER_TOKEN_TEMPLATE}' not found. Please create it in your Clerk Dashboard to enable backend requests.`);
    } else {
      console.error('Failed to refresh Clerk token for InsForge client', err);
    }
    client.getHttpClient().setAuthToken(null);
  }
}

export async function getInsforgeServerClient(): Promise<{ insforge: InsForgeClient; userId: string | null }> {
  if (!BASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_INSFORGE_BASE_URL or INSFORGE_BASE_URL environment variable');
  }
  if (!ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_INSFORGE_ANON_KEY or INSFORGE_ANON_KEY environment variable');
  }

  const { userId } = await auth();

  if (userId !== cachedUserId || !cachedClient) {

    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }

    cachedClient = createClient({
      baseUrl: BASE_URL,
      anonKey: ANON_KEY,
    });
    cachedUserId = userId;

    if (userId) {
      await refreshAuthToken(cachedClient);

      refreshInterval = setInterval(async () => {
        if (cachedClient && cachedUserId) {
          await refreshAuthToken(cachedClient);
        }
      }, TOKEN_REFRESH_MS);
    }
  } else if (userId) {
    await refreshAuthToken(cachedClient);
  }

  return { insforge: cachedClient, userId };
}

export function getInsforgeAdminClient(): InsForgeClient {

  if (!BASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_INSFORGE_BASE_URL or INSFORGE_BASE_URL environment variable');
  }
  if (!ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_INSFORGE_ANON_KEY or INSFORGE_ANON_KEY environment variable');
  }
  if (!PROJECT_API_KEY) {
    throw new Error('Missing INSFORGE_PROJECT_API_KEY or INSFORGE_API_KEY environment variable');
  }

  return createClient({
    baseUrl: BASE_URL,
    anonKey: PROJECT_API_KEY,
    isServerMode: true,
  });
}

export const getInsforgeUploadClient = getInsforgeAdminClient;
