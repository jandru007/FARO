export const FARO_VERSION = "v0.6.1";
export const FARO_METHODOLOGY_VERSION = "faro-score-v0.6.1";
export const FREE_SCAN_VERSION = "free-scan-v1.0";
export const FARO_TRIAL_AGENT_UA = "FARO-TrialAgent/0.6.1";

export const SCAN_STATUSES = [
  "queued",
  "running",
  "completed",
  "failed",
  "cost_capped",
  "blocked"
] as const;

export const SCAN_STAGES = [
  "queued",
  "validating_url",
  "crawling_site",
  "checking_operator_surfaces",
  "extracting_structured_data",
  "mapping_action_paths",
  "running_operator_preview",
  "calculating_score",
  "completed",
  "failed"
] as const;

export const DEFAULT_FREE_SCAN_LIMITS = {
  maxPages: 12,
  maxRuntimeSeconds: 240,
  maxLlmCalls: 3,
  maxContentBytes: 250_000,
  maxRedirects: 5,
  requestTimeoutMs: 15_000,
  costCapEur: 1
} as const;
