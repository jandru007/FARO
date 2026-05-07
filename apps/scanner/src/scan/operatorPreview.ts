import type { OperatorPreview } from "@faro/shared";
import type { StaticScanContext } from "./staticChecks";
import { callOpenRouterJson } from "../lib/openrouter";

export async function runOperatorPreview(context: StaticScanContext): Promise<OperatorPreview> {
  if (!process.env.OPENROUTER_API_KEY) {
    return { available: false, error: "OPENROUTER_API_KEY is not configured." };
  }

  try {
    const business = await callOpenRouterJson({
      maxTokens: 500,
      prompt: `Using only the extracted homepage text, metadata, structured data, and key page snippets provided below, describe:
- what this business does
- who it serves
- what primary action a user/AI Operator is expected to take
Return strict JSON:
{
  "business_purpose": "...",
  "primary_audience": "...",
  "primary_action": "...",
  "confidence": 0.0,
  "cannot_determine": [],
  "hallucination_self_check": []
}

TEXT:
${context.snippets.homepageText}

STRUCTURED DATA:
${context.snippets.structuredData}`
    });

    const action = await callOpenRouterJson({
      maxTokens: 400,
      prompt: `Using only the provided extracted links/forms/buttons/schema, determine whether an AI Operator can identify a clear primary action path.
Return strict JSON:
{
  "primary_action_path_found": true,
  "action_type": "buy|book|quote|contact|signup|unknown",
  "entry_url": "...",
  "blockers": [],
  "confidence": 0.0,
  "hallucination_self_check": []
}

LINKS/FORMS:
${context.snippets.linksAndForms}`
    });

    const preview: OperatorPreview = {
      available: true,
      primary_action_path_found: Boolean(action.primary_action_path_found),
      blockers: Array.isArray(action.blockers) ? action.blockers.map(String) : []
    };
    const businessPurpose = stringValue(business.business_purpose);
    const primaryAudience = stringValue(business.primary_audience);
    const primaryAction = stringValue(business.primary_action);
    const confidence = numberValue(action.confidence ?? business.confidence);

    if (businessPurpose) preview.business_purpose = businessPurpose;
    if (primaryAudience) preview.primary_audience = primaryAudience;
    if (primaryAction) preview.primary_action = primaryAction;
    if (confidence !== undefined) preview.confidence = confidence;

    return preview;
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : "AI Operator preview unavailable."
    };
  }
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}
