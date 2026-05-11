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
  const completed = ["completed", "cost_capped"].includes(scanState.status);

  return (
    <section
      className={
        completed
          ? "no-scrollbar relative z-20 mx-6 mb-20 mt-8 max-h-none overflow-y-auto rounded-[24px] border border-white/60 bg-[rgba(243,247,249,0.68)] px-6 py-8 shadow-[0_24px_100px_rgba(15,23,42,0.14)] backdrop-blur-[18px] sm:mx-10 sm:px-8 lg:absolute lg:bottom-[30px] lg:right-[4.2vw] lg:top-[110px] lg:mx-0 lg:mb-0 lg:mt-0 lg:w-[52vw] lg:max-w-[1020px] lg:px-12 lg:py-10"
          : "pointer-events-none absolute inset-x-0 bottom-[30px] top-[var(--header-height)] z-20 grid place-items-center px-6 lg:left-1/2 lg:right-0"
      }
      aria-live="polite"
    >
      {scanState && !["completed", "cost_capped"].includes(scanState.status) ? (
        <ScanRunningState domain={domain ?? scanState.normalizedDomain} scanState={scanState} />
      ) : null}
      {scanState && ["completed", "cost_capped"].includes(scanState.status) && result ? (
        <ScanResult scanState={scanState} result={result} variant="overlay" />
      ) : null}
    </section>
  );
}
