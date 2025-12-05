// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const GEMINI_API_VERSION = "v1beta";
const GEMINI_MODELS = (() => {
  const models = (Deno.env.get("GEMINI_MODELS")
    ?? "models/gemini-1.5-flash-latest")
    .split(",")
    .map((model) => model.trim())
    .filter((model) => model.length > 0);
  return models.length > 0 ? models : ["models/gemini-pro"];
})();
const buildGeminiUrl = (model: string) =>
  `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/${model}:generateContent`;

interface CoachChatRequest {
  question: string;
  profile?: Record<string, unknown> | null;
  locale?: "tr" | "en";
}

const buildPrompt = ({ question, profile, locale = "tr" }: CoachChatRequest) => {
  const localeHint =
    locale === "tr"
      ? "Yanıtı Türkçe ver ve gerekiyorsa sonunda kısa İngilizce özet ekle."
      : "Respond in English and add a short Turkish summary when useful.";

  const profileSnippet = profile
    ? `Here is the member profile JSON: ${JSON.stringify(profile)}.`
    : "No additional profile data was provided.";

  return `You are PureForm's certified fitness & nutrition coach assistant.
Answer questions with actionable, evidence-based advice. Keep responses concise and structured.
${localeHint}
${profileSnippet}
Question: ${question}`;
};

const createGeminiPayload = (prompt: string) => ({
  contents: [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ],
  generationConfig: {
    temperature: 0.4,
    topP: 0.9,
  },
});

const callGemini = async (apiKey: string, prompt: string): Promise<string> => {
  const errors: string[] = [];

  for (const model of GEMINI_MODELS) {
    const response = await fetch(buildGeminiUrl(model), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(createGeminiPayload(prompt)),
    });

    if (!response.ok) {
      const message = await response.text();
      errors.push(`Gemini error ${response.status} (${model}): ${message}`);
      if (response.status !== 404) {
        break;
      }
      continue;
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part?.text ?? "").join("") ??
      "";

    if (!text) {
      errors.push(`Gemini returned empty response for ${model}`);
      continue;
    }

    return text.trim();
  }

  throw new Error(errors.join(" | "));
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  let payload: CoachChatRequest;
  try {
    payload = await req.json();
  } catch (_error) {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  if (!payload.question || typeof payload.question !== "string") {
    return new Response(JSON.stringify({ error: "Question is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  try {
    const prompt = buildPrompt(payload);
    const answer = await callGemini(apiKey, prompt);
    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
});
