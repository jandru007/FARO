import { DocsShell } from "@/components/DocsShell";

export default function TrialAgentPage() {
  return (
    <DocsShell title="FARO Trial Agent">
      <p>
        The FARO Trial Agent is the controlled AI Operator used in paid audits. It runs a defined task suite against a
        target site, records replay-backed evidence, and supports reproducible scoring.
      </p>
      <h2>Free Scan Scope</h2>
      <p>
        The Free FARO Scan does not run the full 31-task Trial Agent library. It may run a small AI Operator preview
        using extracted public text, metadata, links, forms, and structured data.
      </p>
      <h2>Safety</h2>
      <p>
        FARO does not create accounts, submit payments, or perform irreversible actions during the Free Scan.
      </p>
    </DocsShell>
  );
}
