import { NextResponse } from "next/server";
import { z } from "zod";
import { createScanRunPayload, hashIp } from "@/lib/scans";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const createScanSchema = z.object({
  url: z.string().min(1).max(2048)
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "FARO scan storage is not configured yet. Add Supabase env vars to enable live scans." },
      { status: 503 }
    );
  }

  try {
    const body = createScanSchema.parse(await request.json());
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
    const payload = await createScanRunPayload(body.url, {
      ipHash: hashIp(ip),
      userAgent: request.headers.get("user-agent") ?? null
    });

    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase.from("scan_runs").insert(payload).select("id, status").single<{ id: string; status: string }>();
    if (error) throw error;

    await triggerScanner(data.id);

    return NextResponse.json({ scanId: data.id, status: data.status });
  } catch (error) {
    const { message, status } = getScanErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}

function getScanErrorResponse(error: unknown): { message: string; status: number } {
  if (error instanceof z.ZodError) {
    return { message: "Enter a valid public website URL.", status: 400 };
  }

  const message = error instanceof Error ? error.message : "";
  if (
    message.includes("public websites") ||
    message.includes("valid public") ||
    message.includes("could not resolve this public website")
  ) {
    return { message, status: 400 };
  }

  return { message: "We could not start this scan. Check the URL or try again later.", status: 500 };
}

async function triggerScanner(scanId: string): Promise<void> {
  const workerUrl = process.env.SCANNER_WORKER_URL;
  if (!workerUrl) return;

  try {
    await fetch(`${workerUrl.replace(/\/$/, "")}/run-free-scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SCANNER_SHARED_SECRET ?? ""}`
      },
      body: JSON.stringify({ scanId })
    });
  } catch {
    // Scan row exists; polling worker can still pick it up.
  }
}
