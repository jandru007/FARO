import { DocsShell } from "@/components/DocsShell";

export default function MethodologyPage() {
  return (
    <DocsShell title="Methodology">
      <p>
        FARO is deterministic first. Subjective interpretation is gradually moved into explicit checks, repeatable
        prompts, replay-backed evidence, and versioned scoring rules.
      </p>
      <h2>Operator Surfaces</h2>
      <p>
        FARO checks public surfaces such as /llms.txt, /agent.json, /.well-known/ucp, robots.txt, API/docs links, and
        machine-readable policy or action information.
      </p>
      <h2>Layer Model</h2>
      <p>
        Full FARO Audits combine static website properties, live Operator Trial outcomes, external trust probes, and a
        capped human review layer.
      </p>
    </DocsShell>
  );
}
