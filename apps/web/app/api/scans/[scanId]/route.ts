import { NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeScanResponse } from "@/lib/scans";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import type { ScanEventPublic, ScanRunRow } from "@faro/shared";

export const runtime = "nodejs";

const scanIdSchema = z.string().uuid();

export async function GET(_request: Request, context: { params: Promise<{ scanId: string }> }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "FARO scan storage is not configured yet." }, { status: 503 });
  }

  try {
    const { scanId } = await context.params;
    const id = scanIdSchema.parse(scanId);
    const supabase = getSupabaseServiceClient();

    const { data: run, error: runError } = await supabase.from("scan_runs").select("*").eq("id", id).single<ScanRunRow>();
    if (runError) throw runError;

    const { data: events, error: eventsError } = await supabase
      .from("scan_events")
      .select("stage, message")
      .eq("scan_run_id", id)
      .order("created_at", { ascending: true })
      .limit(12)
      .returns<ScanEventPublic[]>();
    if (eventsError) throw eventsError;

    const { data: resultRows, error: resultError } = await supabase
      .from("scan_results")
      .select("result_json")
      .eq("scan_run_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .returns<Array<{ result_json: Record<string, unknown> }>>();
    if (resultError) throw resultError;

    return NextResponse.json(
      sanitizeScanResponse({
        run,
        events: events ?? [],
        result: resultRows?.[0]?.result_json ?? null
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load scan.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
