import type { FreeScanResult, PublicScanState } from "@faro/shared";
import { ScanResult } from "./ScanResult";
import { ScanRunningState } from "./ScanRunningState";

export function ReportPanel({
  domain,
  scanState
}: {
  domain: string | null;
  scanState: PublicScanState | null;
}) {
  const result = scanState?.result as FreeScanResult | null | undefined;
  if (!scanState) return null;

  return (
    <section
      className="min-h-[420px] overflow-y-auto bg-[#FAFAFA] px-6 py-8 sm:px-10 lg:h-full lg:px-12"
      aria-live="polite"
    >
      {scanState && !["completed", "cost_capped"].includes(scanState.status) ? (
        <ScanRunningState domain={domain ?? scanState.normalizedDomain} scanState={scanState} />
      ) : null}
      {scanState && ["completed", "cost_capped"].includes(scanState.status) && result ? (
        <ScanResult scanState={scanState} result={result} />
      ) : null}
    </section>
  );
}
