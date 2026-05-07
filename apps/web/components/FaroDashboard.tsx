"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FaroUpdate } from "@/content/updates";
import type { PublicScanState } from "@faro/shared";
import { UrlScanForm } from "./UrlScanForm";
import { TrustRow } from "./TrustRow";
import { UpdatesTimeline } from "./UpdatesTimeline";
import { ReportPanel } from "./ReportPanel";
import { mockScanResult } from "@/lib/mockScanResult";

const terminalStatuses = new Set(["completed", "failed", "cost_capped", "blocked"]);

export function FaroDashboard({ updates }: { updates: FaroUpdate[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialScanId = searchParams.get("scan");
  const [scanId, setScanId] = useState<string | null>(initialScanId);
  const [scanState, setScanState] = useState<PublicScanState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const mockMode = searchParams.get("mock") === "completed";

  const visibleScanState = useMemo<PublicScanState | null>(() => {
    if (mockMode) {
      return {
        id: "mock-scan",
        url: mockScanResult.target.url,
        normalizedDomain: mockScanResult.target.domain,
        status: "completed",
        currentStage: "completed",
        score: mockScanResult.estimate.score,
        scoreMin: mockScanResult.estimate.score_min,
        scoreMax: mockScanResult.estimate.score_max,
        band: mockScanResult.estimate.band,
        confidence: mockScanResult.estimate.confidence,
        errorMessage: null,
        events: [{ stage: "completed", message: "Mock Free FARO Scan estimate completed." }],
        result: mockScanResult
      };
    }
    return scanState;
  }, [mockMode, scanState]);

  const domain = useMemo(() => visibleScanState?.normalizedDomain ?? null, [visibleScanState]);

  useEffect(() => {
    if (!scanId) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    async function poll() {
      try {
        const response = await fetch(`/api/scans/${scanId}`, { cache: "no-store" });
        const payload = (await response.json()) as PublicScanState & { error?: string };
        if (!response.ok) throw new Error(payload.error || "Could not load scan.");
        if (cancelled) return;
        setScanState(payload);
        setError(null);
        if (!terminalStatuses.has(payload.status)) {
          timeout = setTimeout(poll, 2000);
        }
      } catch (pollError) {
        if (!cancelled) setError(pollError instanceof Error ? pollError.message : "Could not load scan.");
      }
    }

    void poll();

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [scanId]);

  async function handleSubmit(url: string) {
    setError(null);
    setScanState(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/scans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        });
        const payload = (await response.json()) as { scanId?: string; error?: string };
        if (!response.ok || !payload.scanId) {
          throw new Error(payload.error || "Could not start scan.");
        }
        setScanId(payload.scanId);
        router.replace(`/?scan=${payload.scanId}`, { scroll: false });
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Could not start scan.");
      }
    });
  }

  return (
    <main className="grid min-h-[calc(100svh-var(--header-height))] bg-white lg:h-[calc(100svh-var(--header-height))] lg:grid-cols-[42%_58%] lg:overflow-hidden">
      <section className="flex flex-col border-faro-border px-6 py-10 sm:px-10 lg:border-r lg:px-12 lg:py-12">
        <div className="max-w-[680px]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-faro-border bg-white px-3 py-1.5 text-sm font-medium text-faro-muted">
            <span className="h-2 w-2 rounded-full bg-faro-blue" aria-hidden="true" />
            Free Scan · No signup required
          </div>
          <h1 className="max-w-[640px] text-[48px] font-semibold leading-[1.02] tracking-[0px] text-faro-ink sm:text-[60px]">
            Can AI Operators use your website?
          </h1>
          <p className="mt-5 max-w-[620px] text-lg leading-8 text-faro-muted sm:text-xl">
            FARO scans your site to estimate whether AI Operators can understand, trust, and act on it.
          </p>

          <div className="mt-8">
            <UrlScanForm isSubmitting={isPending} onSubmit={handleSubmit} />
            {error ? <p className="mt-3 text-sm font-medium text-[#B42318]">{error}</p> : null}
          </div>

          <TrustRow />

          <div className="my-9 h-px w-full bg-faro-border" />

          <UpdatesTimeline updates={updates} />
        </div>
      </section>

      <ReportPanel domain={domain} scanState={visibleScanState} />
    </main>
  );
}
