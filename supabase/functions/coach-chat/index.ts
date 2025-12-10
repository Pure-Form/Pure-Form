// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Hugging Face Inference API
const HF_API_URL = "https://api-inference.huggingface.co/models/";
const DEFAULT_MODEL = "mistralai/Mistral-7B-Instruct-v0.2"; // Güçlü ve hızlı model

interface CoachChatRequest {
  question: string;
  profile?: Record<string, unknown> | null;
  locale?: "tr" | "en";
}

const buildPrompt = ({
  question,
  profile,
  locale = "tr",
}: CoachChatRequest) => {
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

const callHuggingFace = async (
  apiKey: string,
  prompt: string,
): Promise<string> => {
  const model = Deno.env.get("HF_MODEL") || DEFAULT_MODEL;
  const url = `${HF_API_URL}${model}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error ${response.status}: ${error}`);
  }

  const data = await response.json();

  // Farklı model response formatları için kontrol
  if (Array.isArray(data) && data.length > 0) {
    return data[0].generated_text || data[0].text || "";
  }

  if (data.generated_text) {
    return data.generated_text;
  }

  throw new Error("Unexpected response format from Hugging Face");
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

  const apiKey = Deno.env.get("HF_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing HF_API_KEY" }), {
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
    const answer = await callHuggingFace(apiKey, prompt);
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
