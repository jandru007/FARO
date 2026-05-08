"use client";

import Image from "next/image";
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
  const reportActive = Boolean(visibleScanState);

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
    <main
      className={`min-h-[calc(100svh-var(--header-height))] bg-white ${
        reportActive ? "grid lg:h-[calc(100svh-var(--header-height))] lg:grid-cols-[42%_58%] lg:overflow-hidden" : ""
      }`}
    >
      <section
        className={`flex min-h-[calc(100svh-var(--header-height))] flex-col border-faro-border px-6 py-10 sm:px-10 ${
          reportActive ? "lg:border-r lg:px-16 lg:py-16" : "lg:px-[9vw] lg:py-14"
        }`}
      >
        <div className={reportActive ? "max-w-[700px]" : "max-w-[760px]"}>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-faro-muted">
            Framework for AI Readiness and Operability
          </p>
          <h1 className={`font-semibold leading-[1.02] tracking-[0px] text-faro-ink ${reportActive ? "max-w-[660px] text-[48px] sm:text-[58px]" : "max-w-[760px] text-[48px] sm:text-[60px]"}`}>
            Can AI Agents use your website?
          </h1>
          <p className="mt-5 max-w-[620px] text-lg leading-8 text-faro-muted sm:text-xl">
            FARO scans your site to estimate whether AI Operators can understand, trust, and act on it.
          </p>

          <div className="mt-8">
            <UrlScanForm isSubmitting={isPending} onSubmit={handleSubmit} />
            {error ? <p className="mt-3 text-sm font-medium text-[#B42318]">{error}</p> : null}
          </div>

          <TrustRow />

          <div className="my-8 h-px w-full bg-faro-border" />

          <UpdatesTimeline updates={updates} />
        </div>
        <footer className="mt-auto flex h-[var(--footer-height)] items-center gap-1.5 pt-3 text-[11px] text-faro-muted">
          <span>© 2026</span>
          <span aria-hidden="true">·</span>
          <span>Project by</span>
          <Image src="/capfico-wordmark-bk.png" alt="CAPFICO" width={54} height={14} className="h-[11px] w-auto opacity-70" />
        </footer>
      </section>

      <ReportPanel domain={domain} scanState={visibleScanState} />
    </main>
  );
}
