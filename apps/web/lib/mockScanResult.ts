import type { FreeScanResult } from "@faro/shared";

export const mockScanResult: FreeScanResult = {
  scan_version: "free-scan-v1.0",
  methodology_version: "faro-score-v0.6.1",
  target: {
    url: "https://example.com",
    domain: "example.com",
    scanned_at: "2026-05-07T12:00:00.000Z"
  },
  estimate: {
    score: 56,
    score_min: 45,
    score_max: 65,
    band: "Operator-Hostile",
    confidence: "medium",
    disclaimer: "This is a Free FARO Scan estimate, not a verified FARO Audit."
  },
  layers: [
    {
      key: "operator_surfaces",
      label: "Operator Surfaces",
      score: 25,
      status: "poor",
      summary: "No deliberate AI/operator-facing files were found."
    },
    {
      key: "structured_data",
      label: "Structured Data",
      score: 54,
      status: "fair",
      summary: "Some schema found, but key types are missing."
    },
    {
      key: "actionability",
      label: "Actionability",
      score: 38,
      status: "poor",
      summary: "Primary action path is unclear or not machine-readable."
    },
    {
      key: "trust_signals",
      label: "Trust Signals",
      score: 62,
      status: "fair",
      summary: "Basic identity/contact signals detected."
    },
    {
      key: "technical_accessibility",
      label: "Technical Accessibility",
      score: 44,
      status: "poor",
      summary: "Extraction is possible but not efficient."
    }
  ],
  top_issues: [
    {
      severity: "high",
      title: "No /llms.txt found",
      description: "FARO could not find a public /llms.txt file for AI Operators.",
      evidence: "/llms.txt returned no usable public surface.",
      recommended_fix: "Add a concise /llms.txt file with business, product, policy, and key action-path context.",
      category: "operator_surfaces"
    },
    {
      severity: "high",
      title: "No /agent.json found",
      description: "FARO could not find an agent-readable website profile.",
      evidence: "/agent.json returned no usable public surface.",
      recommended_fix: "Publish /agent.json with allowed actions, rate limits, contact paths, and supported protocols.",
      category: "operator_surfaces"
    },
    {
      severity: "medium",
      title: "Schema coverage incomplete",
      description: "Structured data is present but does not cover the core identity, offer, and contact model.",
      evidence: "Detected Organization schema only.",
      recommended_fix: "Add Organization, WebSite, Product/Offer, BreadcrumbList, FAQPage, and ContactPoint schema.",
      category: "structured_data"
    },
    {
      severity: "high",
      title: "Primary action path unclear",
      description: "The Free Scan could not identify a reliable buy, book, quote, signup, or contact path.",
      evidence: "No strong primary CTA or operator preview action path was detected.",
      recommended_fix: "Expose a clear primary action path in visible HTML, links, schema, and operator-facing files.",
      category: "actionability"
    }
  ],
  checks: {},
  operator_preview: {
    available: true,
    business_purpose: "Example business summary.",
    primary_audience: "Prospective customers.",
    primary_action: "Contact sales.",
    primary_action_path_found: false,
    confidence: 0.72,
    blockers: ["Primary CTA is ambiguous."]
  },
  cost: {
    llm_calls: 2,
    estimated_tokens_input: 0,
    estimated_tokens_output: 0,
    estimated_eur: 0.12,
    cost_capped: false
  },
  cta: {
    title: "Get the Full FARO Audit",
    description: "Unlock your full score, detailed issue breakdown, replay-backed evidence, and actionable recommendations.",
    payment_url: "",
    booking_url: ""
  }
};
