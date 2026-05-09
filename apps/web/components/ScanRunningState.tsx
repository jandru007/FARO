import type { PublicScanState } from "@faro/shared";

const stageLabels: Record<string, string> = {
  queued: "Queued for the scanner",
  validating_url: "Validating public website safety",
  crawling_site: "Reading public website surfaces",
  checking_operator_surfaces: "Checking Operator surfaces",
  extracting_structured_data: "Reading structured data",
  mapping_action_paths: "Mapping action paths",
  running_operator_preview: "Running AI Operator preview",
  calculating_score: "Calculating score estimate"
};

export function ScanRunningState({ domain, scanState }: { domain: string; scanState: PublicScanState }) {
  const stage = scanState.currentStage ? stageLabels[String(scanState.currentStage)] : null;

  return (
    <div className="mx-auto flex max-w-[760px] flex-col justify-center">
      <div className="flex items-center gap-3">
        <span className="faro-spinner h-5 w-5 rounded-full" aria-hidden="true" />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-faro-muted">Free FARO Scan</p>
      </div>
      <h2 className="mt-5 text-3xl font-semibold tracking-[0px] text-faro-ink">Scanning {domain}</h2>
      <p className="mt-3 max-w-[520px] text-base leading-7 text-faro-muted">
        {stage ?? "The scanner is collecting public signals and preparing your FARO Readiness Estimate."}
      </p>
    </div>
  );
}
