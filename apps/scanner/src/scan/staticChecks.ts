import { DEFAULT_FREE_SCAN_LIMITS, FARO_TRIAL_AGENT_UA, getNormalizedDomain } from "@faro/shared";
import type { FreeScanChecks } from "./scoring";
import { extractPageSignals, type ExtractedPageSignals } from "./extractors";

export interface StaticScanContext {
  targetUrl: string;
  finalUrl: string;
  domain: string;
  pages: Array<{ url: string; status: number | null; html: string; signals: ExtractedPageSignals }>;
  checks: FreeScanChecks;
  snippets: {
    homepageText: string;
    linksAndForms: string;
    structuredData: string;
  };
}

interface FetchRecord {
  url: string;
  finalUrl: string;
  status: number | null;
  contentType: string;
  body: string;
  responseTimeMs: number | null;
  error: string | null;
}

export async function runStaticChecks(targetUrl: string): Promise<StaticScanContext> {
  const origin = new URL(targetUrl).origin;
  const homepage = await safeFetch(targetUrl);
  const homepageSignals = extractPageSignals(homepage.body, homepage.finalUrl);
  const robots = await safeFetch(`${origin}/robots.txt`);
  const sitemap = await safeFetch(`${origin}/sitemap.xml`);
  const llms = await safeFetch(`${origin}/llms.txt`);
  const llmsFull = await safeFetch(`${origin}/llms-full.txt`);
  const agentJson = await safeFetch(`${origin}/agent.json`);
  const ucp = await safeFetch(`${origin}/.well-known/ucp`);
  const pageUrls = discoverImportantPages(homepageSignals.links, origin, Number(process.env.FREE_SCAN_MAX_PAGES ?? DEFAULT_FREE_SCAN_LIMITS.maxPages));
  const pageFetches = await Promise.all(pageUrls.map((url) => safeFetch(url)));
  const pages = [homepage, ...pageFetches].map((record) => ({
    url: record.finalUrl,
    status: record.status,
    html: record.body,
    signals: extractPageSignals(record.body, record.finalUrl)
  }));
  const allSignals = pages.map((page) => page.signals);
  const allLinks = allSignals.flatMap((signals) => signals.links);
  const schemaTypes = [...new Set(allSignals.flatMap((signals) => signals.schemaTypes))];
  const actionLinks = allLinks
    .filter((link) => /(buy|book|quote|contact|cart|checkout|pricing|demo|signup|sign-up|get-started)/i.test(`${link.text} ${link.href}`))
    .map((link) => link.href);
  const policyLinks = allLinks.some((link) => /(privacy|returns?|shipping|terms|refund|policy)/i.test(`${link.text} ${link.href}`));
  const contactLink = allLinks.some((link) => /(contact|support|help|sales)/i.test(`${link.text} ${link.href}`));

  const checks: FreeScanChecks = {
    reachability: {
      reachable: homepage.status !== null && homepage.status >= 200 && homepage.status < 400,
      status: homepage.status,
      https: new URL(homepage.finalUrl).protocol === "https:",
      responseTimeMs: homepage.responseTimeMs
    },
    operatorSurfaces: {
      llmsTxt: isOk(llms),
      llmsFullTxt: isOk(llmsFull),
      agentJson: isOk(agentJson),
      ucpProfile: isOk(ucp),
      robotsAiPolicy: /GPTBot|ChatGPT-User|ClaudeBot|PerplexityBot|Google-Extended|Applebot-Extended|CCBot/i.test(robots.body),
      sitemapXml: isOk(sitemap)
    },
    structuredData: {
      jsonLdCount: allSignals.reduce((count, signals) => count + signals.jsonLdBlocks.length, 0),
      schemaTypes,
      openGraph: allSignals.some((signals) => signals.openGraph),
      twitterCard: allSignals.some((signals) => signals.twitterCard),
      hasContactSchema: schemaTypes.includes("ContactPoint")
    },
    extractability: {
      htmlLang: allSignals.some((signals) => Boolean(signals.htmlLang)),
      title: allSignals.some((signals) => Boolean(signals.title)),
      metaDescription: allSignals.some((signals) => Boolean(signals.metaDescription)),
      h1Count: homepageSignals.h1Count,
      landmarks: [...new Set(allSignals.flatMap((signals) => signals.landmarks))],
      visibleTextCharacters: allSignals.reduce((count, signals) => count + signals.visibleText.length, 0),
      jsOnlyWarning: homepageSignals.visibleText.length < 300 && homepage.body.length > 20_000,
      canonical: allSignals.some((signals) => signals.canonical)
    },
    actionability: {
      primaryCtaFound: actionLinks.length > 0,
      actionLinks: [...new Set(actionLinks)].slice(0, 12),
      formsWithLabels: allSignals.reduce((count, signals) => count + signals.formsWithLabels, 0),
      formsTotal: allSignals.reduce((count, signals) => count + signals.formsTotal, 0),
      contactLink,
      emailOrPhone: allSignals.some((signals) => signals.emailOrPhone)
    },
    trustSignals: {
      organizationSchema: schemaTypes.includes("Organization") || schemaTypes.includes("LocalBusiness"),
      contactSignals: contactLink || allSignals.some((signals) => signals.emailOrPhone),
      policyLinks,
      freshnessSignals: allSignals.some((signals) => signals.freshnessSignals)
    }
  };

  return {
    targetUrl,
    finalUrl: homepage.finalUrl,
    domain: getNormalizedDomain(homepage.finalUrl),
    pages,
    checks,
    snippets: {
      homepageText: homepageSignals.visibleText.slice(0, 6000),
      linksAndForms: allLinks.map((link) => `${link.text} -> ${link.href}`).join("\n").slice(0, 6000),
      structuredData: JSON.stringify(
        {
          schemaTypes,
          jsonLdCount: checks.structuredData.jsonLdCount,
          openGraph: checks.structuredData.openGraph,
          twitterCard: checks.structuredData.twitterCard
        },
        null,
        2
      )
    }
  };
}

async function safeFetch(url: string): Promise<FetchRecord> {
  const started = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_FREE_SCAN_LIMITS.requestTimeoutMs);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": process.env.FARO_TRIAL_AGENT_UA || FARO_TRIAL_AGENT_UA,
        Accept: "text/html,application/xhtml+xml,application/xml,text/plain,application/json;q=0.9,*/*;q=0.5"
      }
    });
    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();
    return {
      url,
      finalUrl: response.url,
      status: response.status,
      contentType,
      body: text.slice(0, DEFAULT_FREE_SCAN_LIMITS.maxContentBytes),
      responseTimeMs: Math.round(performance.now() - started),
      error: null
    };
  } catch (error) {
    return {
      url,
      finalUrl: url,
      status: null,
      contentType: "",
      body: "",
      responseTimeMs: Math.round(performance.now() - started),
      error: error instanceof Error ? error.message : "Fetch failed"
    };
  } finally {
    clearTimeout(timeout);
  }
}

function discoverImportantPages(
  links: Array<{ href: string; text: string }>,
  origin: string,
  maxPages: number
): string[] {
  const important = links.filter((link) => {
    try {
      return (
        new URL(link.href).origin === origin &&
        /(product|pricing|contact|returns?|shipping|privacy|docs|api|demo|book|quote|checkout|cart)/i.test(`${link.text} ${link.href}`)
      );
    } catch {
      return false;
    }
  });

  return [...new Set(important.map((link) => link.href))].slice(0, Math.max(0, maxPages - 1));
}

function isOk(record: FetchRecord): boolean {
  return record.status !== null && record.status >= 200 && record.status < 300 && record.body.trim().length > 0;
}
