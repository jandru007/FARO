import Link from "next/link";
import type { FreeScanResult } from "@faro/shared";

export function AuditCtaCard({ cta }: { cta: FreeScanResult["cta"] }) {
  return (
    <section className="rounded-lg bg-[#05070D] p-6 text-white">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-xl font-semibold">{cta.title || "Get the Full FARO Audit"}</h2>
          <p className="mt-2 max-w-[620px] text-sm leading-6 text-white/72">
            {cta.description ||
              "Unlock your full score, detailed issue breakdown, replay-backed evidence, and actionable recommendations."}
          </p>
        </div>
        <Link className="focus-ring inline-flex h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-[#05070D]" href="/audit">
          Get Full Audit →
        </Link>
      </div>
    </section>
  );
}
