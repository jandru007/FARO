import {
  FARO_METHODOLOGY_VERSION,
  FREE_SCAN_VERSION,
  clampScore,
  getScoreBand,
  type Confidence,
  type FreeScanIssue,
  type FreeScanLayer,
  type FreeScanResult,
  type OperatorPreview
} from "@faro/shared";

export interface FreeScanCheckInput {
  targetUrl: string;
  domain: string;
  checks: FreeScanChecks;
  operatorPreview: OperatorPreview;
}

export interface FreeScanChecks {
  reachability: {
    reachable: boolean;
    status: number | null;
    https: boolean;
    responseTimeMs: number | null;
  };
  operatorSurfaces: {
    llmsTxt: boolean;
    llmsFullTxt: boolean;
    agentJson: boolean;
    ucpProfile: boolean;
    robotsAiPolicy: boolean;
    sitemapXml: boolean;
  };
  structuredData: {
    jsonLdCount: number;
    schemaTypes: string[];
    openGraph: boolean;
    twitterCard: boolean;
    hasContactSchema: boolean;
  };
  extractability: {
    htmlLang: boolean;
    title: boolean;
    metaDescription: boolean;
    h1Count: number;
    landmarks: string[];
    visibleTextCharacters: number;
    jsOnlyWarning: boolean;
    canonical: boolean;
  };
  actionability: {
    primaryCtaFound: boolean;
    actionLinks: string[];
    formsWithLabels: number;
    formsTotal: number;
    contactLink: boolean;
    emailOrPhone: boolean;
  };
  trustSignals: {
    organizationSchema: boolean;
    contactSignals: boolean;
    policyLinks: boolean;
    freshnessSignals: boolean;
  };
}

export function calculateFreeScanScore(input: FreeScanCheckInput): FreeScanResult {
  const layerScores = {
    operator_surfaces: scoreOperatorSurfaces(input.checks.operatorSurfaces),
    structured_data: scoreStructuredData(input.checks.structuredData),
    actionability: scoreActionability(input.checks.actionability, input.operatorPreview),
    technical_accessibility: scoreTechnicalAccess(input.checks.extractability, input.checks.reachability),
    trust_signals: scoreTrustSignals(input.checks.trustSignals)
  };

  const weighted =
    layerScores.operator_surfaces * 0.3 +
    layerScores.structured_data * 0.25 +
    layerScores.actionability * 0.2 +
    layerScores.technical_accessibility * 0.15 +
    layerScores.trust_signals * 0.1;

  const reachabilityAdjustment = input.checks.reachability.reachable ? 0 : -20;
  const score = applyFreeScanScoreCaps(clampScore(weighted + reachabilityAdjustment), input.checks);
  const band = getScoreBand(score).label;
  const confidence = getConfidence(input.checks, input.operatorPreview);
  const range = getEstimatedRange(score, confidence);
  const layers = buildLayers(layerScores);
  const topIssues = buildTopIssues(input.checks, input.operatorPreview);

  return {
    scan_version: FREE_SCAN_VERSION,
    methodology_version: FARO_METHODOLOGY_VERSION,
    target: {
      url: input.targetUrl,
      domain: input.domain,
      scanned_at: new Date().toISOString()
    },
    estimate: {
      score,
      score_min: range.min,
      score_max: range.max,
      band,
      confidence,
      disclaimer: "This is a Free FARO Scan estimate, not a verified FARO Audit."
    },
    layers,
    top_issues: topIssues,
    checks: input.checks as unknown as Record<string, unknown>,
    operator_preview: input.operatorPreview,
    cost: {
      llm_calls: input.operatorPreview.available ? 2 : 0,
      estimated_tokens_input: 0,
      estimated_tokens_output: 0,
      estimated_eur: input.operatorPreview.available ? 0.12 : 0,
      cost_capped: false
    },
    cta: {
      title: "Get the Full FARO Audit",
      description:
        "Unlock your full score, detailed issue breakdown, replay-backed evidence, and actionable recommendations.",
      payment_url: process.env.STRIPE_PAYMENT_LINK ?? "",
      booking_url: process.env.BOOKING_CALL_URL ?? ""
    }
  };
}

function scoreOperatorSurfaces(checks: FreeScanChecks["operatorSurfaces"]): number {
  return clampScore(
    15 +
      (checks.llmsTxt ? 22 : 0) +
      (checks.agentJson ? 20 : 0) +
      (checks.ucpProfile ? 18 : 0) +
      (checks.robotsAiPolicy ? 12 : 0) +
      (checks.sitemapXml ? 8 : 0) +
      (checks.llmsFullTxt ? 5 : 0)
  );
}

function scoreStructuredData(checks: FreeScanChecks["structuredData"]): number {
  const schemaCoverage = Math.min(45, checks.schemaTypes.length * 9);
  const rawScore = clampScore(
    18 +
      schemaCoverage +
      (checks.jsonLdCount > 0 ? 12 : 0) +
      (checks.hasContactSchema ? 10 : 0) +
      (checks.openGraph ? 8 : 0) +
      (checks.twitterCard ? 5 : 0)
  );

  return Math.min(rawScore, 72);
}

function scoreActionability(
  checks: FreeScanChecks["actionability"],
  preview: OperatorPreview
): number {
  const formScore = checks.formsTotal === 0 ? 8 : Math.round((checks.formsWithLabels / checks.formsTotal) * 12);
  return clampScore(
    22 +
      (checks.primaryCtaFound ? 26 : 0) +
      Math.min(18, checks.actionLinks.length * 6) +
      formScore +
      (checks.contactLink ? 10 : 0) +
      (checks.emailOrPhone ? 8 : 0) +
      (preview.primary_action_path_found ? 10 : 0)
  );
}

function scoreTechnicalAccess(
  extractability: FreeScanChecks["extractability"],
  reachability: FreeScanChecks["reachability"]
): number {
  return clampScore(
    (reachability.reachable ? 20 : 0) +
      (reachability.https ? 10 : 0) +
      (extractability.htmlLang ? 8 : 0) +
      (extractability.title ? 10 : 0) +
      (extractability.metaDescription ? 8 : 0) +
      (extractability.h1Count === 1 ? 10 : extractability.h1Count > 1 ? 5 : 0) +
      Math.min(12, extractability.landmarks.length * 4) +
      (extractability.visibleTextCharacters > 800 ? 10 : 0) +
      (extractability.canonical ? 6 : 0) -
      (extractability.jsOnlyWarning ? 15 : 0)
  );
}

function scoreTrustSignals(checks: FreeScanChecks["trustSignals"]): number {
  return clampScore(
    30 +
      (checks.organizationSchema ? 20 : 0) +
      (checks.contactSignals ? 20 : 0) +
      (checks.policyLinks ? 15 : 0) +
      (checks.freshnessSignals ? 15 : 0)
  );
}

function getConfidence(checks: FreeScanChecks, preview: OperatorPreview): Confidence {
  if (!checks.reachability.reachable) return "low";
  if (preview.available && checks.structuredData.jsonLdCount > 0 && checks.extractability.visibleTextCharacters > 1200) {
    return "high";
  }
  if (checks.extractability.visibleTextCharacters > 700) return "medium";
  return "low";
}

function getEstimatedRange(score: number, confidence: Confidence): { min: number; max: number } {
  const spread = confidence === "high" ? 6 : confidence === "medium" ? 10 : 15;
  return {
    min: clampScore(score - spread),
    max: clampScore(score + spread)
  };
}

function buildLayers(scores: Record<FreeScanLayer["key"], number>): FreeScanLayer[] {
  return [
    {
      key: "operator_surfaces",
      label: "Operator Surfaces",
      score: scores.operator_surfaces,
      status: statusFor(scores.operator_surfaces),
      summary:
        scores.operator_surfaces >= 70
          ? "Deliberate AI/operator-facing files were found."
          : "No deliberate AI/operator-facing files were found or coverage is incomplete."
    },
    {
      key: "structured_data",
      label: "Structured Data",
      score: scores.structured_data,
      status: statusFor(scores.structured_data),
      summary:
        scores.structured_data >= 70
          ? "Structured data gives Operators a useful machine-readable base."
          : "Schema coverage is incomplete for reliable Operator interpretation."
    },
    {
      key: "actionability",
      label: "Actionability",
      score: scores.actionability,
      status: statusFor(scores.actionability),
      summary:
        scores.actionability >= 70
          ? "A primary action path is visible enough for a lightweight scan."
          : "Primary action path is unclear or not machine-readable."
    },
    {
      key: "trust_signals",
      label: "Trust Signals",
      score: scores.trust_signals,
      status: statusFor(scores.trust_signals),
      summary:
        scores.trust_signals >= 70
          ? "Basic identity/contact signals were detected."
          : "Trust and contact signals need stronger machine-readable support."
    },
    {
      key: "technical_accessibility",
      label: "Technical Accessibility",
      score: scores.technical_accessibility,
      status: statusFor(scores.technical_accessibility),
      summary:
        scores.technical_accessibility >= 70
          ? "Extraction is efficient enough for a Free Scan preview."
          : "Extraction is possible but not efficient."
    }
  ];
}

function statusFor(score: number): FreeScanLayer["status"] {
  if (score >= 70) return "good";
  if (score >= 45) return "fair";
  return "poor";
}

function buildTopIssues(checks: FreeScanChecks, preview: OperatorPreview): FreeScanIssue[] {
  const issues: FreeScanIssue[] = [];

  if (!checks.operatorSurfaces.llmsTxt) {
    issues.push(issue("high", "No /llms.txt found", "FARO could not find a public /llms.txt file for AI Operators.", "/llms.txt returned no usable public surface.", "Add a concise /llms.txt file with business, product, policy, and key action-path context.", "operator_surfaces"));
  }
  if (!checks.operatorSurfaces.agentJson) {
    issues.push(issue("high", "No /agent.json found", "FARO could not find an agent-readable website profile.", "/agent.json returned no usable public surface.", "Publish /agent.json with allowed actions, rate limits, contact paths, and supported protocols.", "operator_surfaces"));
  }
  if (checks.structuredData.schemaTypes.length < 3 || !checks.structuredData.hasContactSchema) {
    issues.push(issue("medium", "Schema coverage incomplete", "Structured data is present but does not cover the core identity, offer, and contact model.", `Detected schema types: ${checks.structuredData.schemaTypes.join(", ") || "none"}.`, "Add Organization, WebSite, Product/Offer where relevant, BreadcrumbList, FAQPage, and ContactPoint schema.", "structured_data"));
  }
  if (checks.structuredData.jsonLdCount > 0) {
    issues.push(issue("medium", "Schema/content consistency not verified", "The Free Scan found machine-readable schema, but it does not verify whether schema agrees with FAQ, policy, shipping, returns, contact, and product-page content.", `Detected ${checks.structuredData.jsonLdCount} JSON-LD block(s). Consistency requires a Full FARO Audit or deeper Trial Agent checks.`, "Run the Full FARO Audit to compare schema claims against visible content, policy pages, and Operator task outcomes.", "structured_data"));
  }
  if (!checks.actionability.primaryCtaFound && !preview.primary_action_path_found) {
    issues.push(issue("high", "Primary action path unclear", "The Free Scan could not identify a reliable buy, book, quote, signup, or contact path.", "No strong primary CTA or operator preview action path was detected.", "Expose a clear primary action path in visible HTML, links, schema, and operator-facing files.", "actionability"));
  }
  if (!checks.operatorSurfaces.ucpProfile) {
    issues.push(issue("medium", "No /.well-known/ucp found", "No UCP profile was detected for protocol-aware commerce or action negotiation.", "/.well-known/ucp returned no usable profile.", "Add a UCP profile when transaction or catalog capabilities are ready for Operators.", "operator_surfaces"));
  }
  if (!checks.operatorSurfaces.sitemapXml) {
    issues.push(issue("low", "sitemap.xml missing", "FARO could not use a sitemap to discover important public pages efficiently.", "sitemap.xml was missing or unreachable.", "Publish sitemap.xml and include product, pricing, contact, docs, and policy pages.", "technical_accessibility"));
  }

  return issues;
}

function applyFreeScanScoreCaps(score: number, checks: FreeScanChecks): number {
  let capped = score;

  if (!checks.operatorSurfaces.agentJson) {
    capped = Math.min(capped, 74);
  }

  if (!checks.actionability.primaryCtaFound) {
    capped = Math.min(capped, 69);
  }

  return clampScore(capped);
}

function issue(
  severity: FreeScanIssue["severity"],
  title: string,
  description: string,
  evidence: string,
  recommended_fix: string,
  category: FreeScanIssue["category"]
): FreeScanIssue {
  return { severity, title, description, evidence, recommended_fix, category };
}
