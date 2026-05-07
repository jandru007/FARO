import { DocsShell } from "@/components/DocsShell";

export default function DocsPage() {
  return (
    <DocsShell title="FARO Docs">
      <p>
        FARO is CAPFICO&apos;s public website-operability standard, scanner, and audit system for AI Operators.
        The core question is simple: can AI Operators use your website?
      </p>
      <h2>What FARO Measures</h2>
      <p>
        FARO looks at whether a website can be understood, trusted, and acted on by autonomous AI Operators. It is not
        SEO, page speed, or a chatbot audit. It focuses on machine-readable surfaces, structured data, action paths,
        trust signals, and controlled Operator Trial evidence.
      </p>
      <h2>Product Ladder</h2>
      <ul>
        <li>Free FARO Scan: automated public-surface estimate.</li>
        <li>Full FARO Audit: founder-run verified audit with evidence and recommendations.</li>
        <li>Ready Kit: implementation service for operator-facing assets and fixes.</li>
        <li>Monitoring: future recurring product.</li>
      </ul>
    </DocsShell>
  );
}
