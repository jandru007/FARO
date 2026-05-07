export interface ExtractedPageSignals {
  title: string | null;
  metaDescription: string | null;
  htmlLang: string | null;
  h1Count: number;
  landmarks: string[];
  visibleText: string;
  links: Array<{ href: string; text: string }>;
  formsTotal: number;
  formsWithLabels: number;
  jsonLdBlocks: Record<string, unknown>[];
  schemaTypes: string[];
  openGraph: boolean;
  twitterCard: boolean;
  canonical: boolean;
  freshnessSignals: boolean;
  emailOrPhone: boolean;
}

export function extractPageSignals(html: string, baseUrl: string): ExtractedPageSignals {
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDescription = firstMeta(html, "description");
  const htmlLang = firstMatch(html, /<html[^>]*\slang=["']?([^"'\s>]+)/i);
  const h1Count = matchCount(html, /<h1\b/gi);
  const landmarks = ["main", "nav", "footer"].filter((tag) => new RegExp(`<${tag}\\b`, "i").test(html));
  const links = extractLinks(html, baseUrl);
  const formsTotal = matchCount(html, /<form\b/gi);
  const labels = matchCount(html, /<label\b/gi);
  const inputs = matchCount(html, /<(input|select|textarea)\b/gi);
  const formsWithLabels = formsTotal === 0 ? 0 : Math.min(formsTotal, labels > 0 || labels >= inputs ? formsTotal : labels);
  const jsonLdBlocks = extractJsonLd(html);
  const schemaTypes = [...new Set(jsonLdBlocks.flatMap((block) => extractSchemaTypes(block)))];
  const visibleText = htmlToVisibleText(html);

  return {
    title,
    metaDescription,
    htmlLang,
    h1Count,
    landmarks,
    visibleText,
    links,
    formsTotal,
    formsWithLabels,
    jsonLdBlocks,
    schemaTypes,
    openGraph: /<meta[^>]+property=["']og:/i.test(html),
    twitterCard: /<meta[^>]+name=["']twitter:/i.test(html),
    canonical: /<link[^>]+rel=["']canonical["']/i.test(html),
    freshnessSignals: /dateModified|lastmod|updated|published|202[0-9]/i.test(html),
    emailOrPhone: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d\s().-]{7,}\d/i.test(visibleText)
  };
}

export function htmlToVisibleText(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

export function extractLinks(html: string, baseUrl: string): Array<{ href: string; text: string }> {
  const links: Array<{ href: string; text: string }> = [];
  const regex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    const rawHref = match[1];
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
      continue;
    }

    try {
      links.push({
        href: new URL(rawHref, baseUrl).toString(),
        text: htmlToVisibleText(match[2] ?? "").slice(0, 140)
      });
    } catch {
      // Ignore malformed hrefs.
    }
  }

  return links;
}

function extractJsonLd(html: string): Record<string, unknown>[] {
  const blocks: Record<string, unknown>[] = [];
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    try {
      const parsed = JSON.parse((match[1] ?? "").trim()) as unknown;
      if (Array.isArray(parsed)) {
        blocks.push(...parsed.filter(isRecord));
      } else if (isRecord(parsed)) {
        blocks.push(parsed);
      }
    } catch {
      // Invalid JSON-LD should not fail the scan.
    }
  }

  return blocks;
}

function extractSchemaTypes(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(extractSchemaTypes);
  if (!isRecord(value)) return [];

  const type = value["@type"];
  const ownTypes = Array.isArray(type) ? type.map(String) : type ? [String(type)] : [];
  return [
    ...ownTypes,
    ...Object.values(value).flatMap((child) => (typeof child === "object" && child !== null ? extractSchemaTypes(child) : []))
  ];
}

function firstMeta(html: string, name: string): string | null {
  const regex = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
  return firstMatch(html, regex);
}

function firstMatch(html: string, regex: RegExp): string | null {
  const match = regex.exec(html);
  return match?.[1] ? decodeEntities(match[1].trim()) : null;
}

function matchCount(input: string, regex: RegExp): number {
  return input.match(regex)?.length ?? 0;
}

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
