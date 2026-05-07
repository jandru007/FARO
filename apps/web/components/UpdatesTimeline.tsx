import Link from "next/link";
import type { FaroUpdate } from "@/content/updates";

export function UpdatesTimeline({ updates }: { updates: FaroUpdate[] }) {
  return (
    <section aria-labelledby="updates-heading">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id="updates-heading" className="text-xs font-semibold uppercase tracking-[0.12em] text-faro-muted">
          LIVE UPDATES
        </h2>
        <Link href="/updates" className="focus-ring rounded-md text-sm font-medium text-faro-ink hover:text-faro-blue">
          View all updates →
        </Link>
      </div>
      <div className="space-y-5">
        {updates.map((update, index) => (
          <article key={`${update.date}-${update.title}`} className="grid grid-cols-[18px_1fr] gap-3">
            <div className="pt-1.5">
              <span className="block h-2.5 w-2.5 rounded-full bg-faro-blue/20" aria-hidden="true" />
              {index < updates.length - 1 ? <span className="mx-[4px] mt-1 block h-full min-h-10 w-px bg-faro-border" /> : null}
            </div>
            <div>
              <time className="text-xs font-medium text-faro-muted">{formatDate(update.date)}</time>
              <h3 className="mt-1 text-sm font-semibold text-faro-ink">{update.title}</h3>
              <p className="mt-1 text-sm leading-6 text-faro-muted">{update.description}</p>
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
