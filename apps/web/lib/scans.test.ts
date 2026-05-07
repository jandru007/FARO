import { describe, expect, it, vi } from "vitest";
import { createScanRunPayload, sanitizeScanResponse } from "./scans";

describe("web scan helpers", () => {
  it("creates a queued scan payload from a safe public URL", async () => {
    const payload = await createScanRunPayload("example.com", {
      ipHash: "hash",
      userAgent: "Vitest",
      resolver: async () => ["93.184.216.34"]
    });

    expect(payload.status).toBe("queued");
    expect(payload.normalized_url).toBe("https://example.com/");
    expect(payload.normalized_domain).toBe("example.com");
    expect(payload.current_stage).toBe("queued");
  });

  it("sanitizes database rows without exposing private metadata", () => {
    const response = sanitizeScanResponse({
      run: {
        id: "scan-id",
        url: "https://example.com/",
        normalized_url: "https://example.com/",
        normalized_domain: "example.com",
        scan_type: "free",
        status: "completed",
        current_stage: "completed",
        score_final: 56,
        score_min: 45,
        score_max: 65,
        score_band: "Operator-Hostile",
        confidence: "medium",
        cost_estimate_eur: 0.12,
        error_message: null,
        requested_ip_hash: "secret",
        user_agent: "secret",
        created_at: "2026-05-07T00:00:00.000Z",
        started_at: null,
        completed_at: null,
        updated_at: "2026-05-07T00:00:00.000Z"
      },
      events: [{ stage: "completed", message: "Done" }],
      result: { estimate: { score: 56 } }
    });

    expect(response).not.toHaveProperty("requested_ip_hash");
    expect(response).not.toHaveProperty("user_agent");
    expect(response.score).toBe(56);
    expect(response.result).toEqual({ estimate: { score: 56 } });
  });
});
