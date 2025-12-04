// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

interface GeneratePlanRequest {
  profile: Record<string, unknown>;
  locale?: "tr" | "en";
  notes?: string;
}

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
  };
}

const extractJson = (raw: string): string => {
  const startFence = raw.indexOf("```");
  if (startFence !== -1) {
    const endFence = raw.indexOf("```", startFence + 3);
    if (endFence !== -1) {
      return raw.slice(startFence + 3, endFence).replace(/^json\n/, "").trim();
    }
  }
  return raw.trim();
};

const buildPrompt = (payload: GeneratePlanRequest): string => {
  const { profile, notes, locale = "tr" } = payload;
  const localeHint =
    locale === "tr"
      ? "Yanıtı Türkçe ve İngilizce iki dilde üret."
      : "Respond in both English and Turkish.";

  return `You are an experienced fitness and nutrition coach working for PureForm app.
Create a structured 4-week plan tailored to the provided member profile.
Return strictly valid JSON with this schema:
{
  "metadata": {
    "generatedAt": "ISO timestamp",
    "locale": "${locale}"
  },
  "summary": {
    "tr": "Kısa özet",
    "en": "Short summary"
  },
  "weeklyPlan": [
    {
      "week": 1,
      "focus": {
        "tr": "Haftanın odağı",
        "en": "Focus of the week"
      },
      "workouts": [
        {
          "day": "monday",
          "title": {
            "tr": "Seans başlığı",
            "en": "Session title"
          },
          "details": {
            "tr": "Egzersiz açıklaması",
            "en": "Workout details"
          },
          "intensity": "low|medium|high"
        }
      ],
      "nutrition": {
        "dailyCalories": 0,
        "tips": {
          "tr": "Beslenme ipuçları",
          "en": "Nutrition tips"
        },
        "sampleMeals": {
          "tr": ["Örnek öğün"],
          "en": ["Sample meal"]
        }
      }
    }
  ],
  "habitFocus": {
    "tr": ["Alışkanlık hedefleri"],
    "en": ["Habit goals"]
  }
}
Ensure the JSON is valid and do not include markdown fences or extra commentary.
${localeHint}
Consider these member details: ${JSON.stringify(profile)}
Optional notes from the coach: ${notes ?? "(none)"}`;
};

const callGemini = async (
  apiKey: string,
  prompt: string,
): Promise<string> => {
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const candidates: GeminiCandidate[] = data?.candidates ?? [];
  const parts = candidates[0]?.content?.parts ?? [];
  const text = parts.map((part) => part.text ?? "").join("").trim();

  if (!text) {
    throw new Error("Gemini returned no content");
  }

  return extractJson(text);
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  let payload: GeneratePlanRequest;
  try {
    payload = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const prompt = buildPrompt(payload);
    const resultText = await callGemini(apiKey, prompt);
    const json = JSON.parse(resultText);

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
