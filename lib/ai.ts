import { getInsforgeServerClient } from "@/lib/insforge-server";

export const POST_ACTIONS = ["generate", "rephrase", "shorten", "expand"] as const;
export type ActionType = (typeof POST_ACTIONS)[number];

// Input length limits to prevent prompt injection and runaway API costs
export const AI_LIMITS = {
  MAX_PROMPT_CHARS: 2_000,
  MAX_CONTENT_CHARS: 5_000,
  MAX_BUSINESS_TYPE_CHARS: 200,
  MAX_TARGET_AUDIENCE_CHARS: 200,
} as const;

/**
 * Validate and truncate AI input strings to prevent oversized payloads.
 * Throws an error if inputs exceed allowed limits.
 */
export function validateAiInputs(inputs: Record<string, { value: string; limit: number; label: string }>) {
  for (const [, { value, limit, label }] of Object.entries(inputs)) {
    if (typeof value === "string" && value.length > limit) {
      throw new Error(`${label} exceeds the maximum length of ${limit} characters.`);
    }
  }
}

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

/**
 * Direct call to Google Gemini API using native fetch.
 * Uses GEMINI_API_KEY (supports new AQ... and legacy AIza... keys).
 */
async function callGeminiApi({
  apiKey,
  systemInstruction,
  userPrompt,
  jsonMode = false,
  model = process.env.GEMINI_MODEL || "gemini-2.5-flash",
}: {
  apiKey: string;
  systemInstruction: string;
  userPrompt: string;
  jsonMode?: boolean;
  model?: string;
}): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    generationConfig: {
      temperature: 0.7,
      ...(jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as GeminiGenerateResponse | null;
    const msg = errorBody?.error?.message || `Gemini API returned status ${response.status}`;
    throw new Error(`Gemini API error: ${msg}`);
  }

  const data = (await response.json()) as GeminiGenerateResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof text !== "string") {
    throw new Error("No response content received from Gemini");
  }

  return text;
}

/**
 * Fallback to InsForge AI completions if GEMINI_API_KEY is not configured
 * and the InsForge organization has AI enabled.
 */
async function callInsforgeAi({
  systemInstruction,
  userPrompt,
  model = "google/gemini-2.5-flash",
}: {
  systemInstruction: string;
  userPrompt: string;
  model?: string;
}): Promise<string> {
  const { insforge } = await getInsforgeServerClient();
  const result = await insforge.ai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt },
    ],
  });

  return result.choices[0]?.message?.content ?? "";
}

/**
 * Unified completion function prioritizing GEMINI_API_KEY, with fallback to InsForge BaaS.
 */
export async function generateAiCompletion({
  systemInstruction,
  userPrompt,
  jsonMode = false,
}: {
  systemInstruction: string;
  userPrompt: string;
  jsonMode?: boolean;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    return callGeminiApi({
      apiKey,
      systemInstruction,
      userPrompt,
      jsonMode,
    });
  }

  return callInsforgeAi({
    systemInstruction,
    userPrompt,
  });
}

export interface GeneratedIdea {
  title: string;
  description: string;
}

/**
 * Generate 3 content ideas based on business type and target audience.
 */
export async function generateIdeas({
  businessType,
  targetAudience,
}: {
  businessType: string;
  targetAudience: string;
}): Promise<GeneratedIdea[]> {
  validateAiInputs({
    businessType: { value: businessType, limit: AI_LIMITS.MAX_BUSINESS_TYPE_CHARS, label: "Business type" },
    targetAudience: { value: targetAudience, limit: AI_LIMITS.MAX_TARGET_AUDIENCE_CHARS, label: "Target audience" },
  });

  const systemPrompt = `You are a social media content ideation assistant.
Return only valid JSON.
The response must be an object with an "ideas" array.
Each item must have: "title" and "description".
Generate 3 ideas.
Keep titles catchy.
Keep descriptions practical and specific.
Do not use markdown formatting like **, *, #, or backticks.
Return plain text only inside the JSON strings.`;

  const userPrompt = `Business type: ${businessType}. Target audience: ${targetAudience}.`;

  const rawText = await generateAiCompletion({
    systemInstruction: systemPrompt,
    userPrompt,
    jsonMode: true,
  });

  // Strip possible markdown fences
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as { ideas?: GeneratedIdea[] };
  return Array.isArray(parsed.ideas) ? parsed.ideas.slice(0, 3) : [];
}

export function buildPostSystemPrompt(channelType?: string, characterLimit?: number): string {
  const promptParts = [
    "You are a social media writing assistant.",
    "Return only the final post text.",
    "Do not add quotes, labels, bullet points, or explanations.",
    "Do not use markdown formatting like **, *, #, or backticks.",
    "Return plain text only.",
  ];

  if (channelType) {
    promptParts.push(
      `Write for ${channelType}. Match the platform's tone, style, and expected length, with relevant hashtags.`
    );
  }

  if (characterLimit) {
    promptParts.push(`Must be less than the maximum character limit: ${characterLimit}.`);
  }

  return promptParts.join("\n");
}

export function buildPostPrompt(action: ActionType, content: string, prompt: string): string {
  if (action === "generate") {
    return `Write one clean social media post based on this request:\n${prompt}`;
  }
  if (!content.trim()) {
    throw new Error("Content is required for this action");
  }
  if (action === "rephrase") {
    return `Rephrase this social media post while keeping the meaning:\n${content}`;
  }
  if (action === "shorten") {
    return `Shorten this social media post while keeping the key message:\n${content}`;
  }
  return `Expand this social media post with more helpful detail while keeping the same tone:\n${content}`;
}

/**
 * Generate or transform post copy using AI.
 */
export async function generatePostContent({
  action,
  content = "",
  prompt = "",
  channelType,
  characterLimit,
}: {
  action: ActionType;
  content?: string;
  prompt?: string;
  channelType?: string;
  characterLimit?: number;
}): Promise<string> {
  validateAiInputs({
    content: { value: content, limit: AI_LIMITS.MAX_CONTENT_CHARS, label: "Content" },
    prompt: { value: prompt, limit: AI_LIMITS.MAX_PROMPT_CHARS, label: "Prompt" },
  });

  const systemInstruction = buildPostSystemPrompt(channelType, characterLimit);
  const userPrompt = buildPostPrompt(action, content, prompt);

  const rawText = await generateAiCompletion({
    systemInstruction,
    userPrompt,
    jsonMode: false,
  });

  return rawText.trim();
}
