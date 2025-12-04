import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { GoalProfile } from "@/types/coach";

type AskCoachPayload = {
  question: string;
  profile?: GoalProfile | null;
  locale?: "tr" | "en";
};

type AskCoachResponse = {
  answer: string;
  error?: string;
};

export const askCoachQuestion = async (
  payload: AskCoachPayload,
): Promise<string> => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase configuration missing");
  }

  const { data, error } = await supabase.functions.invoke<AskCoachResponse>(
    "coach-chat",
    {
      body: {
        question: payload.question,
        profile: payload.profile ?? undefined,
        locale: payload.locale ?? "tr",
      },
    },
  );

  if (error) {
    throw new Error(error.message ?? "AI coach request failed");
  }

  if (!data?.answer) {
    throw new Error("AI coach response empty");
  }

  return data.answer;
};
