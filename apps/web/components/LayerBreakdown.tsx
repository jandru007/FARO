import { ChevronRight, Database, Fingerprint, MousePointerClick, ShieldCheck, TerminalSquare } from "lucide-react";
import type { FreeScanLayer } from "@faro/shared";
import { StatusBadge } from "./StatusBadge";

const icons = {
  operator_surfaces: TerminalSquare,
  structured_data: Database,
  actionability: MousePointerClick,
  trust_signals: ShieldCheck,
  technical_accessibility: Fingerprint
};

export function LayerBreakdown({ layers }: { layers: FreeScanLayer[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-faro-ink">Layer Breakdown</h2>
      <div className="mt-4 divide-y divide-faro-border rounded-lg border border-faro-border bg-white">
        {layers.map((layer) => {
          const Icon = icons[layer.key];
          return (
            <div key={layer.key} className="grid gap-4 px-4 py-4 sm:grid-cols-[24px_1fr_80px_86px_20px] sm:items-center">
              <Icon className="h-5 w-5 text-[#71717A]" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-faro-ink">{layer.label}</p>
                <div className="mt-2 h-2 rounded-full bg-[#ECEEF3]">
                  <div className="h-2 rounded-full bg-[#27272A]" style={{ width: `${layer.score}%` }} />
                </div>
              </div>
              <span className="text-sm font-semibold text-faro-ink">{layer.score}/100</span>
              <StatusBadge status={layer.status} />
              <ChevronRight className="hidden h-4 w-4 text-faro-muted sm:block" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
