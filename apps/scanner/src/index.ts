import { createServer } from "node:http";
import { z } from "zod";
import { logger } from "./lib/logger";
import { getSupabase } from "./lib/supabase";
import { pollOnce, runQueuedScan } from "./worker";

const triggerSchema = z.object({ scanId: z.string().uuid() });
const port = Number(process.env.PORT ?? 8787);
const pollIntervalMs = Number(process.env.SCANNER_POLL_INTERVAL_MS ?? 5000);

const server = createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    return json(response, 200, { ok: true });
  }

  if (request.method === "GET" && request.url === "/diagnostics") {
    const auth = requireWorkerAuth(request, response);
    if (!auth) return;

    const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SCANNER_SHARED_SECRET"];
    const optional = ["OPENROUTER_API_KEY", "OPENROUTER_MODEL"];
    const missingRequired = required.filter((key) => !process.env[key]);
    const configuredOptional = optional.filter((key) => Boolean(process.env[key]));
    let supabase: { ok: boolean; error?: string } = { ok: false };

    if (missingRequired.length === 0) {
      try {
        const { error } = await getSupabase().from("scan_runs").select("id", { count: "exact", head: true });
        supabase = error ? { ok: false, error: error.message } : { ok: true };
      } catch (error) {
        supabase = { ok: false, error: error instanceof Error ? error.message : "Supabase check failed." };
      }
    }

    return json(response, missingRequired.length === 0 && supabase.ok ? 200 : 503, {
      ok: missingRequired.length === 0 && supabase.ok,
      missingRequired,
      configuredOptional,
      supabase
    });
  }

  if (request.method === "POST" && request.url === "/run-free-scan") {
    const auth = requireWorkerAuth(request, response);
    if (!auth) return;

    try {
      const body = triggerSchema.parse(JSON.parse(await readBody(request)));
      void runQueuedScan(body.scanId).catch((error) => {
        logger.error("triggered scan failed", { scanId: body.scanId, error: error instanceof Error ? error.message : error });
      });
      return json(response, 202, { status: "queued" });
    } catch (error) {
      return json(response, 400, { error: error instanceof Error ? error.message : "Invalid request" });
    }
  }

  return json(response, 404, { error: "Not found" });
});

server.listen(port, () => {
  logger.info("FARO scanner worker listening", { port });
});

setInterval(() => {
  pollOnce().catch((error) => {
    logger.warn("poll failed", { error: error instanceof Error ? error.message : error });
  });
}, pollIntervalMs);

function readBody(request: import("node:http").IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += String(chunk);
      if (body.length > 100_000) {
        request.destroy();
        reject(new Error("Request body too large."));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function json(response: import("node:http").ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

function requireWorkerAuth(
  request: import("node:http").IncomingMessage,
  response: import("node:http").ServerResponse
): boolean {
  const expectedSecret = process.env.SCANNER_SHARED_SECRET;
  const authorization = request.headers.authorization ?? "";

  if (!expectedSecret) {
    json(response, 503, { error: "SCANNER_SHARED_SECRET is not configured." });
    return false;
  }

  if (authorization !== `Bearer ${expectedSecret}`) {
    json(response, 401, { error: "Unauthorized" });
    return false;
  }

  return true;
}
