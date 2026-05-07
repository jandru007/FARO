import Link from "next/link";
import { Header } from "./Header";

const docsNav = [
  ["Overview", "/docs"],
  ["FARO Score", "/docs/faro-score"],
  ["Trial Agent", "/docs/trial-agent"],
  ["Methodology", "/docs/methodology"],
  ["Free Scan", "/docs/free-scan"]
] as const;

export function DocsShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[220px_1fr] lg:px-10">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <nav className="space-y-1 text-sm font-medium text-faro-muted">
            {docsNav.map(([label, href]) => (
              <Link key={href} href={href} className="focus-ring block rounded-lg px-3 py-2 hover:bg-faro-surface hover:text-faro-ink">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <article className="prose prose-zinc max-w-none">
          <h1>{title}</h1>
          {children}
        </article>
      </main>
    </>
  );
}
