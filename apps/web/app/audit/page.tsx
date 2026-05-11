import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "FARO Full Audit Report — by CAPFICO",
  description:
    "The FARO Full Audit measures whether AI Agents can understand, trust, and act on your website. Score, evidence, blockers, fixes."
};

const deliverables = [
  "Verified FARO Score and layer breakdown",
  "Operator Trial evidence and replay-backed findings",
  "Critical blockers that cap your AI-readiness",
  "Priority fixes and Ready Kit recommendation"
];

const auditLayers = [
  ["Static Audits", "Crawlability, schema, action paths, policies, and operator-facing files."],
  ["Operator Trials", "Task-based checks for whether an AI Agent can understand, trust, and act."],
  ["Trust Probes", "Evidence around claims, policies, support paths, and commercial risk."],
  ["Manual Review", "Founder-led judgment on ambiguous blockers and business context."]
];

export default function AuditPage() {
  const paymentUrl = process.env.STRIPE_PAYMENT_LINK || "#";
  const bookingUrl = process.env.BOOKING_CALL_URL || "https://calendly.com/ruiz-jandru/30min";

  return (
    <>
      <Header overlay />
      <main className="relative min-h-[100svh] overflow-hidden bg-white">
        <div className="faro-landing-art" aria-hidden="true" />
        <section className="relative z-10 px-5 pb-20 pt-[118px] sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[calc(100vw-80px)]">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,0.72fr)] lg:items-center">
              <div className="max-w-[760px]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(102,112,133,0.46)]">
                  FARO Full Audit Report
                </p>
                <h1 className="mt-5 max-w-[740px] text-[58px] font-semibold leading-[0.96] tracking-[-0.055em] text-faro-ink">
                  Your website may look fine to humans. Now find out if{" "}
                  <span className="faro-title-fade">AI Agents can actually use it.</span>
                </h1>
                <p className="mt-6 max-w-[620px] text-base leading-7 text-faro-muted">
                  The Free Scan shows surface signals. The FARO Full Audit shows the real operating truth:
                  whether AI Agents can understand your business, verify trust, complete key actions, and
                  recommend you with confidence.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    className="focus-ring faro-blue-button inline-flex h-12 items-center justify-center rounded-[10px] px-5 text-sm font-semibold text-white"
                    href={paymentUrl}
                  >
                    <span className="relative z-10">Get the full audit report · €299</span>
                  </a>
                  <a
                    className="focus-ring faro-black-button inline-flex h-12 items-center justify-center rounded-[10px] px-5 text-sm font-semibold text-white"
                    href={bookingUrl}
                  >
                    Get a demo call
                  </a>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/60 bg-[rgba(243,247,249,0.62)] p-7 shadow-[0_24px_100px_rgba(15,23,42,0.14)] backdrop-blur-[18px]">
                <div className="flex items-center justify-between border-b border-faro-border pb-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-faro-muted">
                    FARO Full Audit · v0.6.1
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-faro-muted ring-1 ring-faro-border">
                    PDF
                  </span>
                </div>
                <div className="py-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faro-muted">FARO Score</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-6xl font-semibold tracking-[-0.04em] text-faro-ink">62</span>
                    <span className="pb-2 text-lg font-semibold text-faro-muted">/ 100</span>
                    <span className="mb-2 rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#C2410C]">
                      Partially Ready
                    </span>
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-white">
                    <div className="h-full w-[62%] rounded-full bg-faro-blue" />
                  </div>
                </div>
                <div className="space-y-4 border-t border-faro-border pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faro-muted">Killer Finding</p>
                  <p className="text-sm leading-6 text-faro-muted">
                    An AI buyer can reach the product, but cannot trust the store enough to complete the purchase.
                  </p>
                </div>
                <div className="mt-6 grid gap-3">
                  {deliverables.map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg bg-white/72 px-4 py-3 text-sm font-medium text-faro-ink ring-1 ring-faro-border">
                      <span className="text-xs font-semibold text-faro-muted">{String(index + 1).padStart(2, "0")}</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <section className="mt-24 max-w-[1100px]">
              <h2 className="max-w-[780px] text-[40px] font-semibold leading-tight tracking-[-0.04em] text-faro-ink">
                The Free Scan gives you a signal. The Full Audit gives you the evidence.
              </h2>
              <p className="mt-5 max-w-[720px] text-base leading-7 text-faro-muted">
                AI Agents do not just read websites. They compare products, check policies, verify claims,
                find support paths, and decide whether your business is safe to recommend.
              </p>
              <div className="mt-9 grid gap-4 md:grid-cols-2">
                {auditLayers.map(([title, description]) => (
                  <article key={title} className="rounded-[18px] border border-white/60 bg-white/55 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.07)] backdrop-blur-[14px]">
                    <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-faro-ink">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-faro-muted">{description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-20 rounded-[24px] bg-[#070A12] p-8 text-white shadow-[0_24px_100px_rgba(15,23,42,0.18)] lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <h2 className="text-[40px] font-semibold leading-tight tracking-[-0.04em]">
                    Your scan showed the signal. Now get the evidence.
                  </h2>
                  <p className="mt-4 max-w-[680px] text-base leading-7 text-white/68">
                    Includes score breakdown, Operator Trial evidence, critical blockers, priority fixes, and Ready Kit recommendation.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    className="focus-ring faro-blue-button inline-flex h-12 items-center justify-center rounded-[10px] px-5 text-sm font-semibold text-white"
                    href={paymentUrl}
                  >
                    <span className="relative z-10">Get the full audit report · €299</span>
                  </a>
                  <Link
                    className="focus-ring inline-flex h-12 items-center justify-center rounded-[10px] border border-white/16 px-5 text-sm font-semibold text-white"
                    href="/"
                  >
                    Run Free Scan
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
