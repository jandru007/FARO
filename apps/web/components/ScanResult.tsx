import { Download, FileText } from "lucide-react";
import type { FreeScanResult, PublicScanState } from "@faro/shared";
import { ScoreRing } from "./ScoreRing";
import { LayerBreakdown } from "./LayerBreakdown";
import { TopIssues } from "./TopIssues";
import { AuditCtaCard } from "./AuditCtaCard";
import { OverviewCards } from "./OverviewCards";
import { DetailedFindings } from "./DetailedFindings";

export function ScanResult({ scanState, result }: { scanState: PublicScanState; result: FreeScanResult }) {
  return (
    <div className="mx-auto max-w-[920px] space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-faro-border pb-5">
        <div>
          <p className="text-sm font-medium text-faro-muted">{scanState.normalizedDomain}</p>
          <p className="mt-1 text-sm text-faro-muted">Scan completed just now</p>
        </div>
        <button className="focus-ring inline-flex items-center gap-2 rounded-lg border border-faro-border bg-white px-3.5 py-2 text-sm font-medium text-faro-ink">
          <Download className="h-4 w-4" aria-hidden="true" />
          Download summary
        </button>
      </div>

      <section className="grid gap-8 border-b border-faro-border pb-10 lg:grid-cols-[300px_1fr]">
        <div>
          <h2 className="text-xl font-semibold text-faro-ink">FARO Readiness Estimate</h2>
          <p className="mt-2 text-sm leading-6 text-faro-muted">{result.estimate.disclaimer}</p>
        </div>
        <div className="flex flex-col items-center gap-5 rounded-lg border border-faro-border bg-white p-8 shadow-score">
          <ScoreRing score={result.estimate.score} label={result.estimate.band} />
          <div className="text-center">
            <p className="text-sm font-semibold text-faro-muted">Estimated FARO Score</p>
            <p className="mt-1 text-3xl font-semibold text-faro-ink">
              {result.estimate.score_min} – {result.estimate.score_max}
            </p>
            <span className="mt-3 inline-flex rounded-full bg-[#FFF7ED] px-3 py-1 text-sm font-semibold text-[#C2410C]">
              {result.estimate.band}
            </span>
            <p className="mx-auto mt-4 max-w-[460px] text-sm leading-6 text-faro-muted">
              Your site has significant barriers that may prevent AI Operators from understanding or acting on it reliably.
            </p>
          </div>
        </div>
      </section>

      <LayerBreakdown layers={result.layers} />
      <TopIssues issues={result.top_issues} />
      <AuditCtaCard cta={result.cta} />
      <OverviewCards layers={result.layers} />
      <DetailedFindings issues={result.top_issues} />

      <div className="flex items-start gap-3 rounded-lg bg-white p-4 text-sm leading-6 text-faro-muted ring-1 ring-faro-border">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-faro-muted" aria-hidden="true" />
        <p>
          FARO only scans public website surfaces. We do not submit payments or create accounts during the Free Scan.
        </p>
      </div>
    </div>
  );
}
