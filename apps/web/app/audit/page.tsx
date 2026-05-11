import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FARO Full Audit Report — by CAPFICO",
  description:
    "The FARO Full Audit measures whether AI Agents can understand, trust, and act on your website. Score, evidence, blockers, fixes."
};

export default function AuditPage() {
  return (
    <main className="h-[100svh] w-full overflow-hidden bg-white">
      <iframe
        title="FARO Full Audit Report"
        src="/full-audit-landing.html"
        className="h-full w-full border-0"
      />
    </main>
  );
}
