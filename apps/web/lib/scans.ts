import { createHash } from "node:crypto";
import {
  getNormalizedDomain,
  normalizeUrl,
  validatePublicUrl,
  type HostnameResolver,
  type PublicScanState,
  type ScanEventPublic,
  type ScanRunRow
} from "@faro/shared";

interface CreateScanRunOptions {
  ipHash?: string | null;
  userAgent?: string | null;
  resolver?: HostnameResolver;
}

export async function createScanRunPayload(inputUrl: string, options: CreateScanRunOptions = {}) {
  const normalizedUrl = await validatePublicUrl(inputUrl, options.resolver);
  const normalizedDomain = getNormalizedDomain(normalizedUrl);

  return {
    url: normalizeUrl(inputUrl),
    normalized_url: normalizedUrl,
    normalized_domain: normalizedDomain,
    scan_type: "free",
    status: "queued",
    current_stage: "queued",
    requested_ip_hash: options.ipHash ?? null,
    user_agent: options.userAgent ?? null
  } as const;
}

export function hashIp(value: string | null): string | null {
  if (!value) return null;
  const salt = process.env.SCANNER_SHARED_SECRET ?? "faro-dev-salt";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

export function sanitizeScanResponse(input: {
  run: ScanRunRow;
  events: ScanEventPublic[];
  result: Record<string, unknown> | null;
}): PublicScanState {
  return {
    id: input.run.id,
    url: input.run.normalized_url,
    normalizedDomain: input.run.normalized_domain,
    status: input.run.status,
    currentStage: input.run.current_stage,
    score: input.run.score_final,
    scoreMin: input.run.score_min,
    scoreMax: input.run.score_max,
    band: input.run.score_band,
    confidence: input.run.confidence,
    errorMessage: input.run.error_message,
    events: input.events.map((event) => ({
      stage: event.stage,
      message: event.message
    })),
    result: input.result
  };
}
