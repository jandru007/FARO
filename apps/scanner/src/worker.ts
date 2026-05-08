import type { ScanStage, ScanStatus } from "@faro/shared";
import { validatePublicUrl } from "@faro/shared";
import { getSupabase } from "./lib/supabase";
import { logger } from "./lib/logger";
import { runFreeScan } from "./scan/freeScan";

interface ScanRunRecord {
  id: string;
  normalized_url: string;
  status: ScanStatus;
}

const staleRunningMs = Number(process.env.SCANNER_STALE_RUNNING_MS ?? 10 * 60 * 1000);

export async function runQueuedScan(scanId: string): Promise<void> {
  const supabase = getSupabase();
  const claimed = await supabase
    .from("scan_runs")
    .update({
      status: "running",
      started_at: new Date().toISOString(),
      current_stage: "validating_url"
    })
    .eq("id", scanId)
    .eq("status", "queued")
    .select("id, normalized_url, status")
    .maybeSingle<ScanRunRecord>();

  if (claimed.error) throw claimed.error;
  if (!claimed.data) return;

  await scanAndPersist(claimed.data);
}

export async function pollOnce(): Promise<boolean> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("scan_runs")
    .select("id")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (error) throw error;
  if (!data) return recoverStaleRunningScan();

  await runQueuedScan(data.id);
  return true;
}

async function recoverStaleRunningScan(): Promise<boolean> {
  const supabase = getSupabase();
  const cutoff = new Date(Date.now() - staleRunningMs).toISOString();
  const stale = await supabase
    .from("scan_runs")
    .select("id, updated_at")
    .eq("status", "running")
    .lt("updated_at", cutoff)
    .order("updated_at", { ascending: true })
    .limit(1)
    .maybeSingle<{ id: string; updated_at: string | null }>();

  if (stale.error) throw stale.error;
  if (!stale.data) return false;

  const reset = await supabase
    .from("scan_runs")
    .update({
      status: "queued",
      current_stage: "queued",
      started_at: null,
      error_message: null
    })
    .eq("id", stale.data.id)
    .eq("status", "running")
    .lt("updated_at", cutoff);

  if (reset.error) throw reset.error;

  logger.warn("recovered stale running scan", { scanId: stale.data.id, updatedAt: stale.data.updated_at });
  await event(stale.data.id, "requeued", "queued", "Recovered stale running scan after worker restart.");
  await runQueuedScan(stale.data.id);
  return true;
}

async function scanAndPersist(run: ScanRunRecord): Promise<void> {
  const supabase = getSupabase();

  try {
    await event(run.id, "stage", "validating_url", "Validated public URL safety.");
    await validatePublicUrl(run.normalized_url);

    await stage(run.id, "crawling_site");
    await event(run.id, "stage", "crawling_site", "Fetching homepage and public operator surfaces.");

    const result = await runFreeScan(run.normalized_url);

    await stage(run.id, "calculating_score");
    await supabase.from("scan_results").insert({
      scan_run_id: run.id,
      result_json: result,
      layer_scores_json: result.layers,
      top_issues_json: result.top_issues,
      evidence_json: result.checks
    });

    await supabase
      .from("scan_runs")
      .update({
        status: "completed",
        current_stage: "completed",
        score_min: result.estimate.score_min,
        score_max: result.estimate.score_max,
        score_final: result.estimate.score,
        score_band: result.estimate.band,
        confidence: result.estimate.confidence,
        cost_estimate_eur: result.cost.estimated_eur,
        completed_at: new Date().toISOString()
      })
      .eq("id", run.id);

    await event(run.id, "completed", "completed", "Free FARO Scan estimate completed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scan failed.";
    logger.error("scan failed", { scanId: run.id, message });
    await supabase
      .from("scan_runs")
      .update({
        status: message.includes("public websites") ? "blocked" : "failed",
        current_stage: "failed",
        error_message: message,
        completed_at: new Date().toISOString()
      })
      .eq("id", run.id);
    await event(run.id, "failed", "failed", message);
  }
}

async function stage(scanRunId: string, stageName: ScanStage): Promise<void> {
  await getSupabase().from("scan_runs").update({ current_stage: stageName }).eq("id", scanRunId);
}

async function event(scanRunId: string, eventType: string, stageName: ScanStage, message: string): Promise<void> {
  await getSupabase().from("scan_events").insert({
    scan_run_id: scanRunId,
    event_type: eventType,
    stage: stageName,
    message
  });
}
