import { describe, expect, it } from "vitest";
import { calculateFreeScanScore } from "./scoring";

describe("Free Scan scoring", () => {
  it("creates a conservative estimate with requested top issues when core surfaces are missing", () => {
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

    expect(["Not Operable", "Operator-Hostile"]).toContain(result.estimate.band);
    expect(result.estimate.score).toBeGreaterThanOrEqual(30);
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

  it("keeps rich-schema sites conservative when consistency and Trial Agent tasks are unverified", () => {
    const result = calculateFreeScanScore({
      targetUrl: "https://bravospain.es/",
      domain: "bravospain.es",
      checks: {
        reachability: { reachable: true, status: 200, https: true, responseTimeMs: 1052 },
        operatorSurfaces: {
          llmsTxt: true,
          llmsFullTxt: true,
          agentJson: false,
          ucpProfile: true,
          robotsAiPolicy: false,
          sitemapXml: true
        },
        structuredData: {
          jsonLdCount: 8,
          schemaTypes: [
            "WholesaleStore",
            "OpeningHoursSpecification",
            "GeoCoordinates",
            "PostalAddress",
            "ContactPoint",
            "Organization",
            "BreadcrumbList",
            "ListItem",
            "WebSite",
            "SearchAction",
            "CollectionPage",
            "ItemList"
          ],
          openGraph: true,
          twitterCard: true,
          hasContactSchema: true
        },
        extractability: {
          htmlLang: true,
          title: true,
          metaDescription: true,
          h1Count: 0,
          landmarks: [],
          visibleTextCharacters: 2569,
          jsOnlyWarning: false,
          canonical: true
        },
        actionability: {
          primaryCtaFound: false,
          actionLinks: [],
          formsWithLabels: 0,
          formsTotal: 0,
          contactLink: false,
          emailOrPhone: false
        },
        trustSignals: {
          organizationSchema: true,
          contactSignals: false,
          policyLinks: false,
          freshnessSignals: true
        }
      },
      operatorPreview: {
        available: true,
        business_purpose: "Professional barbering ecommerce.",
        primary_audience: "Professional barbers.",
        primary_action: "Browse and purchase products.",
        primary_action_path_found: true,
        confidence: 0.85,
        blockers: []
      }
    });

    expect(result.estimate.score).toBeGreaterThanOrEqual(60);
    expect(result.estimate.score).toBeLessThanOrEqual(69);
    expect(result.estimate.band).toBe("Operator-Hostile");
    expect(result.layers.find((layer) => layer.key === "structured_data")?.score).toBeLessThanOrEqual(72);
    expect(result.top_issues.map((issue) => issue.title)).toEqual(
      expect.arrayContaining(["No /agent.json found", "Schema/content consistency not verified"])
    );
  });
});
