import type { FreeScanLayer } from "@faro/shared";

const labels = ["Performance", "Operator Surfaces", "Structured Data", "Actionability", "Trust Signals"];

export function OverviewCards({ layers }: { layers: FreeScanLayer[] }) {
  const byLabel = new Map(layers.map((layer) => [layer.label, layer]));
  return (
    <section>
      <h2 className="text-lg font-semibold text-faro-ink">Overview</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {labels.map((label) => {
          const layer = byLabel.get(label);
          const score = layer?.score ?? (label === "Performance" ? 64 : 0);
          return (
            <article key={label} className="rounded-lg border border-faro-border bg-white p-4">
              <p className="text-sm font-medium text-faro-muted">{label}</p>
              <p className="mt-3 text-2xl font-semibold text-faro-ink">{score}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
