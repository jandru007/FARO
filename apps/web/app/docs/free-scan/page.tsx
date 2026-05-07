import { DocsShell } from "@/components/DocsShell";

export default function FreeScanPage() {
  return (
    <DocsShell title="Free FARO Scan">
      <p>
        The Free FARO Scan is an automated estimate. It is not certification, not a verified FARO Score, and not a Full
        FARO Audit.
      </p>
      <h2>What It Checks</h2>
      <ul>
        <li>Reachability, redirects, HTTPS, robots.txt, and sitemap.xml.</li>
        <li>/llms.txt, /llms-full.txt, /agent.json, and /.well-known/ucp.</li>
        <li>JSON-LD, schema.org types, Open Graph, and Twitter Card metadata.</li>
        <li>Extractability, headings, landmarks, forms, contact paths, and action links.</li>
      </ul>
      <h2>What The Full Audit Adds</h2>
      <p>
        The Full FARO Audit adds deeper evidence, Trial Agent replay excerpts, verified scoring, critical blocker
        adjudication, and a prioritized implementation roadmap.
      </p>
    </DocsShell>
  );
}
