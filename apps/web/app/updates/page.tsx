import { Header } from "@/components/Header";
import { updates, type FaroUpdate } from "@/content/updates";

export default function UpdatesPage() {
  const grouped = updates.reduce((groups, update) => {
    const items = groups.get(update.date) ?? [];
    items.push(update);
    groups.set(update.date, items);
    return groups;
  }, new Map<string, FaroUpdate[]>());

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <h1 className="text-4xl font-semibold tracking-[0px] text-faro-ink">Build-in-public Updates</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-faro-muted">
          Public notes on FARO standard, scanner, docs, and product development.
        </p>
        <div className="mt-10 space-y-10">
          {[...grouped.entries()].map(([date, items]) => (
            <section key={date}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-faro-muted">{formatDate(date)}</h2>
              <div className="mt-4 divide-y divide-faro-border rounded-lg border border-faro-border bg-white">
                {items.map((update) => (
                  <article key={update.title} className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-faro-blue">{update.type}</p>
                    <h3 className="mt-2 text-lg font-semibold text-faro-ink">{update.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-faro-muted">{update.description}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00.000Z`)
  );
}
