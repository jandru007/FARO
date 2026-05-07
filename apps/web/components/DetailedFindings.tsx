"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FreeScanIssue } from "@faro/shared";
import { SeverityBadge } from "./SeverityBadge";

export function DetailedFindings({ issues }: { issues: FreeScanIssue[] }) {
  const [open, setOpen] = useState<string | null>(issues[0]?.title ?? null);

  return (
    <section>
      <h2 className="text-lg font-semibold text-faro-ink">Detailed Findings</h2>
      <div className="mt-4 divide-y divide-faro-border rounded-lg border border-faro-border bg-white">
        {issues.map((issue) => {
          const expanded = open === issue.title;
          return (
            <article key={issue.title}>
              <button
                className="focus-ring flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                type="button"
                onClick={() => setOpen(expanded ? null : issue.title)}
              >
                <span className="flex items-center gap-3">
                  <SeverityBadge severity={issue.severity} />
                  <span className="text-sm font-semibold text-faro-ink">{issue.title}</span>
                </span>
                <ChevronDown className={`h-4 w-4 text-faro-muted transition ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {expanded ? (
                <div className="px-4 pb-5 text-sm leading-6 text-faro-muted">
                  <p>{issue.description}</p>
                  <p className="mt-3">
                    <span className="font-semibold text-faro-ink">Evidence:</span> {issue.evidence}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold text-faro-ink">Recommended fix:</span> {issue.recommended_fix}
                  </p>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
