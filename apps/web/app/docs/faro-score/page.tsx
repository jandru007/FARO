import { DocsShell } from "@/components/DocsShell";

export default function FaroScorePage() {
  return (
    <DocsShell title="FARO Score v0.6.1">
      <p>
        FARO Score v0.6.1 is a calibrated methodology maintained by CAPFICO. It is versioned as a public standard.
      </p>
      <h2>Score Bands</h2>
      <table>
        <tbody>
          <tr><td>92-100</td><td>FARO Certified</td></tr>
          <tr><td>85-91</td><td>FARO Ready</td></tr>
          <tr><td>70-84</td><td>Operator-Compatible With Gaps</td></tr>
          <tr><td>50-69</td><td>Operator-Hostile</td></tr>
          <tr><td>30-49</td><td>Not Operable</td></tr>
          <tr><td>0-29</td><td>Invisible to Operators</td></tr>
        </tbody>
      </table>
      <h2>Full Audit Layers</h2>
      <p>
        The full methodology weights Static Audits at 30%, Operator Trials at 40%, Trust Probes at 20%, and Manual
        Review at 10%. The Free FARO Scan does not run all four layers; it produces a lightweight readiness estimate.
      </p>
    </DocsShell>
  );
}
