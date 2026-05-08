"use client";

import Link from "next/link";
import { useState } from "react";
import { roadmap, type FaroUpdate } from "@/content/updates";

export function UpdatesTimeline({ updates }: { updates: FaroUpdate[] }) {
  const [activeTab, setActiveTab] = useState<"updates" | "roadmap">("updates");
  const latestUpdates = updates.slice(0, 3);

  return (
    <section aria-labelledby="updates-heading">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("updates")}
            className={`focus-ring rounded-md text-xs font-semibold uppercase tracking-[0.12em] ${
              activeTab === "updates" ? "text-faro-ink" : "text-faro-muted"
            }`}
            aria-pressed={activeTab === "updates"}
          >
            <span id="updates-heading">Live Updates</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("roadmap")}
            className={`focus-ring rounded-md text-xs font-semibold uppercase tracking-[0.12em] ${
              activeTab === "roadmap" ? "text-faro-ink" : "text-faro-muted"
            }`}
            aria-pressed={activeTab === "roadmap"}
          >
            Roadmap
          </button>
        </div>
        <Link href="/updates" className="focus-ring rounded-md text-sm font-medium text-faro-ink hover:text-faro-blue">
          View all updates →
        </Link>
      </div>
      <div className="space-y-5">
        {activeTab === "updates"
          ? latestUpdates.map((update, index) => (
              <article key={`${update.date}-${update.title}`} className="grid grid-cols-[18px_1fr] gap-3">
                <div className="pt-1.5">
                  <span className="block h-2.5 w-2.5 rounded-full bg-faro-blue/20" aria-hidden="true" />
                  {index < latestUpdates.length - 1 ? <span className="mx-[4px] mt-1 block h-full min-h-10 w-px bg-faro-border" /> : null}
                </div>
                <div>
                  <time className="text-xs font-medium text-faro-muted">{formatDate(update.date)}</time>
                  <h3 className="mt-1 text-sm font-semibold text-faro-ink">{update.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-faro-muted">{update.description}</p>
                </div>
              </article>
            ))
          : roadmap.map((item, index) => (
              <article key={`${item.timeframe}-${item.title}`} className="grid grid-cols-[18px_1fr] gap-3">
                <div className="pt-1.5">
                  <span className="block h-2.5 w-2.5 rounded-full bg-[#94A3B8]/35" aria-hidden="true" />
                  {index < roadmap.length - 1 ? <span className="mx-[4px] mt-1 block h-full min-h-10 w-px bg-faro-border" /> : null}
                </div>
                <div>
                  <p className="text-xs font-medium text-faro-muted">{item.timeframe}</p>
                  <h3 className="mt-1 text-sm font-semibold text-faro-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-faro-muted">{item.description}</p>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00.000Z`)
  );
}
