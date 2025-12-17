/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
};

const jsonResponse = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch (_error) {
    payload = {};
  }

  const authHeader = req.headers.get("Authorization");
  const headerToken = authHeader?.split(" ")[1]?.trim();
  const bodyToken =
    typeof payload.accessToken === "string" && payload.accessToken.trim().length > 0
      ? payload.accessToken.trim()
      : undefined;

  const accessToken = bodyToken ?? headerToken;
  if (!accessToken) {
    return jsonResponse(401, { error: "Missing access token" });
  }

  const effectiveAuthHeader = authHeader ?? `Bearer ${accessToken}`;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return jsonResponse(500, { error: "Missing Supabase credentials" });
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: effectiveAuthHeader,
      },
    },
  });

  const {
    data: { user },
    error: getUserError,
  } = await userClient.auth.getUser(accessToken);

  if (getUserError || !user) {
    return jsonResponse(401, { error: "Unauthorized" });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  const cleanupTargets = [
    { table: "workout_logs", column: "user_id" },
    { table: "coach_plans", column: "user_id" },
  ];

  const cleanupErrors: string[] = [];

  for (const target of cleanupTargets) {
    const { error } = await adminClient
      .from(target.table)
      .delete()
      .eq(target.column, user.id);

    if (error && !["42P01", "42703"].includes(error.code ?? "")) {
      cleanupErrors.push(`${target.table}: ${error.message}`);
    }
  }

  const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(
    user.id,
  );

  if (deleteUserError) {
    cleanupErrors.push(`auth: ${deleteUserError.message}`);
  }

  if (cleanupErrors.length > 0) {
    console.error("delete-account warnings", cleanupErrors);
    return jsonResponse(200, {
      success: true,
      deletedUserId: user.id,
      warnings: cleanupErrors,
    });
  }

  return jsonResponse(200, {
    success: true,
    deletedUserId: user.id,
  });
});
