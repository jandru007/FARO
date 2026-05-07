import { getNormalizedDomain, validatePublicUrl, type FreeScanResult } from "@faro/shared";
import { calculateFreeScanScore } from "./scoring";
import { runOperatorPreview } from "./operatorPreview";
import { runStaticChecks } from "./staticChecks";

export async function runFreeScan(url: string): Promise<FreeScanResult> {
  const normalizedUrl = await validatePublicUrl(url);
  const staticContext = await runStaticChecks(normalizedUrl);
  const operatorPreview = await runOperatorPreview(staticContext);

  return calculateFreeScanScore({
    targetUrl: normalizedUrl,
    domain: getNormalizedDomain(normalizedUrl),
    checks: staticContext.checks,
    operatorPreview
  });
}
