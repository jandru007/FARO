import { CheckCircle2, CircleDashed } from "lucide-react";
import type { PublicScanState } from "@faro/shared";

const stages = [
  ["crawling_site", "Crawling site"],
  ["checking_operator_surfaces", "Checking operator surfaces"],
  ["extracting_structured_data", "Reading structured data"],
  ["running_operator_preview", "Running AI Operator preview"],
  ["calculating_score", "Calculating score estimate"]
] as const;

export function ScanRunningState({ domain, scanState }: { domain: string; scanState: PublicScanState }) {
  const currentIndex = Math.max(
    0,
    stages.findIndex(([stage]) => stage === scanState.currentStage)
  );

  return (
    <div className="mx-auto max-w-[820px]">
      <div className="border-b border-faro-border pb-6">
        <p className="text-sm font-medium text-faro-muted">{scanState.status}</p>
        <h2 className="mt-2 text-2xl font-semibold text-faro-ink">Scanning {domain}</h2>
      </div>
      <ol className="mt-8 space-y-5">
        {stages.map(([stage, label], index) => {
          const done = index < currentIndex || scanState.currentStage === "completed";
          const active = index === currentIndex;
          return (
            <li key={stage} className="flex items-center gap-3 rounded-lg bg-white px-4 py-4 ring-1 ring-faro-border">
              {done ? (
                <CheckCircle2 className="h-5 w-5 text-[#16A34A]" aria-hidden="true" />
              ) : (
                <CircleDashed className={`h-5 w-5 ${active ? "text-faro-blue" : "text-[#A1A1AA]"}`} aria-hidden="true" />
              )}
              <span className={`text-sm font-medium ${active ? "text-faro-ink" : "text-faro-muted"}`}>{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
