import Link from "next/link";
import { Header } from "@/components/Header";

export default function AuditPage() {
  const paymentUrl = process.env.STRIPE_PAYMENT_LINK || "#";
  const bookingUrl = process.env.BOOKING_CALL_URL || "#";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-faro-muted">Full FARO Audit</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-[0px] text-faro-ink">
              Evidence for where your site fails AI Operators.
            </h1>
            <p className="mt-5 text-lg leading-8 text-faro-muted">
              The Free Scan shows where your site may be failing AI Operators. The Full FARO Audit gives you the
              evidence, verified score, blockers, and implementation roadmap.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="focus-ring rounded-lg bg-[#05070D] px-5 py-3 text-sm font-semibold text-white" href={paymentUrl}>
                Get Full Audit →
              </a>
              <a className="focus-ring rounded-lg border border-faro-border px-5 py-3 text-sm font-semibold text-faro-ink" href={bookingUrl}>
                Book a call
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-faro-border bg-white p-6 shadow-score">
            <h2 className="text-lg font-semibold text-faro-ink">Delivered by email</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-faro-muted">
              <li>Verified FARO Score and layer breakdown.</li>
              <li>Top blockers and critical score caps.</li>
              <li>Evidence-backed findings and replay excerpts where applicable.</li>
              <li>Priority fixes and Ready Kit recommendation.</li>
              <li>Founder review and implementation roadmap.</li>
            </ul>
          </div>
        </section>

        <section className="mt-14 rounded-lg bg-faro-surface p-6">
          <h2 className="text-xl font-semibold text-faro-ink">Founder workflow for v1.0</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-faro-muted">
            Payment Links and booking calls are enough for the MVP. Full audit delivery remains founder-run and manual:
            pay or book, FARO runs the audit, and the report is emailed with a path into Ready Kit.
          </p>
          <Link className="mt-5 inline-flex text-sm font-semibold text-faro-blue" href="/docs/free-scan">
            Read how Free Scan differs from Full Audit →
          </Link>
        </section>
      </main>
    </>
  );
}
