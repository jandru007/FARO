import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const leadSchema = z.object({
  scanId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  company: z.string().max(160).optional(),
  websiteUrl: z.string().max(2048).optional()
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Lead storage is not configured yet." }, { status: 503 });
  }

  try {
    const body = leadSchema.parse(await request.json());
    const { error } = await getSupabaseServiceClient().from("leads").insert({
      scan_run_id: body.scanId ?? null,
      email: body.email ?? null,
      company: body.company ?? null,
      website_url: body.websiteUrl ?? null,
      source: "free_scan"
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
