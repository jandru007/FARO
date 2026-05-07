import { describe, expect, it } from "vitest";
import { calculateFreeScanScore } from "./scoring";

describe("Free Scan scoring", () => {
  it("creates an Operator-Hostile estimate with requested top issues when core surfaces are missing", () => {
    const result = calculateFreeScanScore({
      targetUrl: "https://example.com",
      domain: "example.com",
      checks: {
        reachability: { reachable: true, status: 200, https: true, responseTimeMs: 640 },
        operatorSurfaces: {
          llmsTxt: false,
          llmsFullTxt: false,
          agentJson: false,
          ucpProfile: false,
          robotsAiPolicy: false,
          sitemapXml: false
        },
        structuredData: {
          jsonLdCount: 1,
          schemaTypes: ["Organization"],
          openGraph: true,
          twitterCard: false,
          hasContactSchema: false
        },
        extractability: {
          htmlLang: true,
          title: true,
          metaDescription: false,
          h1Count: 1,
          landmarks: ["main"],
          visibleTextCharacters: 1100,
          jsOnlyWarning: false,
          canonical: false
        },
        actionability: {
          primaryCtaFound: false,
          actionLinks: [],
          formsWithLabels: 0,
          formsTotal: 1,
          contactLink: true,
          emailOrPhone: false
        },
        trustSignals: {
          organizationSchema: true,
          contactSignals: false,
          policyLinks: false,
          freshnessSignals: false
        }
      },
      operatorPreview: { available: false }
    });

    expect(result.estimate.band).toBe("Operator-Hostile");
    expect(result.estimate.score).toBeGreaterThanOrEqual(50);
    expect(result.estimate.score).toBeLessThanOrEqual(69);
    expect(result.top_issues.map((issue) => issue.title)).toEqual(
      expect.arrayContaining([
        "No /llms.txt found",
        "No /agent.json found",
        "Schema coverage incomplete",
        "Primary action path unclear"
      ])
    );
    expect(result.estimate.disclaimer).toContain("not a verified FARO Audit");
  });
});
