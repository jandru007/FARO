import { AlertTriangle } from "lucide-react";
import type { FreeScanIssue } from "@faro/shared";
import { SeverityBadge } from "./SeverityBadge";

export function TopIssues({ issues }: { issues: FreeScanIssue[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-faro-ink">Top Issues</h2>
      <div className="mt-4 divide-y divide-faro-border rounded-lg border border-faro-border bg-white">
        {issues.slice(0, 4).map((issue) => (
          <article key={issue.title} className="grid gap-3 px-4 py-4 sm:grid-cols-[24px_1fr_auto]">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-[#F97316]" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-faro-ink">{issue.title}</h3>
              <p className="mt-1 text-sm leading-6 text-faro-muted">{issue.description}</p>
            </div>
            <SeverityBadge severity={issue.severity} />
          </article>
        ))}
      </div>
    </section>
  );
}
