"use client";

import { Download, FileText } from "lucide-react";
import type { FreeScanResult, PublicScanState } from "@faro/shared";
import { ScoreRing } from "./ScoreRing";
import { LayerBreakdown } from "./LayerBreakdown";
import { TopIssues } from "./TopIssues";
import { AuditCtaCard } from "./AuditCtaCard";
import { OverviewCards } from "./OverviewCards";
import { DetailedFindings } from "./DetailedFindings";

export function ScanResult({
  scanState,
  result,
  variant = "panel"
}: {
  scanState: PublicScanState;
  result: FreeScanResult;
  variant?: "panel" | "overlay";
}) {
  const overlay = variant === "overlay";

  return (
    <div className={overlay ? "mx-auto max-w-none space-y-10" : "mx-auto max-w-[920px] space-y-10"}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-faro-border pb-5">
        <div>
          <p className="text-sm font-medium text-faro-muted">{scanState.normalizedDomain}</p>
          <p className="mt-1 text-sm text-faro-muted">Scan completed just now</p>
        </div>
        <button
          type="button"
          onClick={() => downloadSummaryPdf(scanState, result)}
          className="focus-ring inline-flex items-center gap-2 rounded-lg border border-faro-border bg-white px-3.5 py-2 text-sm font-medium text-faro-ink hover:bg-[#F7F8FA]"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download summary
        </button>
      </div>

      <section className={overlay ? "grid gap-8 pb-10 lg:grid-cols-[310px_1fr]" : "grid gap-8 border-b border-faro-border pb-10 lg:grid-cols-[300px_1fr]"}>
        <div>
          <h2 className="text-xl font-semibold text-faro-ink">FARO Readiness Estimate</h2>
          <p className="mt-2 text-sm leading-6 text-faro-muted">{result.estimate.disclaimer}</p>
        </div>
        <div
          className={
            overlay
              ? "flex flex-col items-center gap-5 p-6"
              : "flex flex-col items-center gap-5 rounded-lg border border-faro-border bg-white p-8 shadow-score"
          }
        >
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
              {getEstimateSummary(result.estimate.score)}
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

function getEstimateSummary(score: number): string {
  if (score >= 85) {
    return "Your site exposes strong machine-readable signals, but the Free Scan cannot verify official FARO readiness without deeper Operator task testing.";
  }

  if (score >= 70) {
    return "Your site exposes useful machine-readable signals, but the Free Scan found gaps that may reduce reliable AI Operator task completion.";
  }

  if (score >= 50) {
    return "Your site has promising public signals, but missing or unverified Operator surfaces may prevent AI Operators from acting reliably.";
  }

  return "Your site has major public-surface gaps that may make it difficult for AI Operators to understand, trust, or act on it.";
}

function downloadSummaryPdf(scanState: PublicScanState, result: FreeScanResult): void {
  const lines = [
    "FARO Readiness Estimate",
    scanState.normalizedDomain,
    "",
    `Estimated FARO Score: ${result.estimate.score}`,
    `Estimated range: ${result.estimate.score_min} - ${result.estimate.score_max}`,
    `Likely band: ${result.estimate.band}`,
    `Confidence: ${result.estimate.confidence}`,
    "",
    result.estimate.disclaimer,
    "",
    "Layer Breakdown",
    ...result.layers.map((layer) => `${layer.label}: ${layer.score}/100 (${layer.status})`),
    "",
    "Top Issues",
    ...result.top_issues.slice(0, 6).map((issue) => `${issue.severity.toUpperCase()}: ${issue.title} - ${issue.description}`),
    "",
    "FARO only scans public website surfaces. A Full FARO Audit verifies Operator task completion and evidence-backed findings."
  ];

  const pdf = createSimplePdf(lines);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `faro-summary-${scanState.normalizedDomain.replace(/[^a-z0-9.-]/gi, "-")}.pdf`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function createSimplePdf(lines: string[]): string {
  const pageHeight = 792;
  const content = [
    "BT",
    "/F1 18 Tf",
    "72 740 Td",
    ...lines.flatMap((line, index) => {
      const font = index === 0 ? "/F1 18 Tf" : "/F1 10 Tf";
      const move = index === 0 ? "" : "0 -18 Td";
      return [font, move, `(${escapePdfText(line).slice(0, 104)}) Tj`].filter(Boolean);
    }),
    "ET"
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 ${pageHeight}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function escapePdfText(input: string): string {
  return input.replace(/[^\x20-\x7E]/g, " ").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
