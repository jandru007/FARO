import type { SCAN_STAGES, SCAN_STATUSES } from "./constants";

export type ScanStatus = (typeof SCAN_STATUSES)[number];
export type ScanStage = (typeof SCAN_STAGES)[number];

export type ScoreBandLabel =
  | "FARO Certified"
  | "FARO Ready"
  | "Operator-Compatible With Gaps"
  | "Operator-Hostile"
  | "Not Operable"
  | "Invisible to Operators";

export type Confidence = "low" | "medium" | "high";
export type Severity = "high" | "medium" | "low";
export type LayerStatus = "good" | "fair" | "poor";

export interface ScoreBand {
  min: number;
  max: number;
  label: ScoreBandLabel;
}

export interface ScoreTone {
  name: "red" | "orange" | "amber" | "green";
  ring: string;
  text: string;
  background: string;
}

export interface ScanRunRow {
  id: string;
  url: string;
  normalized_url: string;
  normalized_domain: string;
  scan_type: "free" | string;
  status: ScanStatus;
  current_stage: ScanStage | null;
  score_min: number | null;
  score_max: number | null;
  score_final: number | null;
  score_band: ScoreBandLabel | string | null;
  confidence: Confidence | string | null;
  cost_estimate_eur: number | null;
  error_message: string | null;
  requested_ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

export interface ScanEventPublic {
  stage: ScanStage | string | null;
  message: string | null;
}

export interface PublicScanState {
  id: string;
  url: string;
  normalizedDomain: string;
  status: ScanStatus;
  currentStage: ScanStage | string | null;
  score: number | null;
  scoreMin: number | null;
  scoreMax: number | null;
  band: string | null;
  confidence: string | null;
  errorMessage: string | null;
  events: ScanEventPublic[];
  result: FreeScanResult | Record<string, unknown> | null;
}

export interface FreeScanIssue {
  severity: Severity;
  title: string;
  description: string;
  evidence: string;
  recommended_fix: string;
  category:
    | "operator_surfaces"
    | "structured_data"
    | "actionability"
    | "technical_accessibility"
    | "trust_signals";
}

export interface FreeScanLayer {
  key:
    | "operator_surfaces"
    | "structured_data"
    | "actionability"
    | "trust_signals"
    | "technical_accessibility";
  label: string;
  score: number;
  status: LayerStatus;
  summary: string;
}

export interface OperatorPreview {
  available: boolean;
  business_purpose?: string;
  primary_audience?: string;
  primary_action?: string;
  primary_action_path_found?: boolean;
  confidence?: number;
  blockers?: string[];
  error?: string;
}

export interface FreeScanResult {
  scan_version: "free-scan-v1.0";
  methodology_version: "faro-score-v0.6.1";
  target: {
    url: string;
    domain: string;
    scanned_at: string;
  };
  estimate: {
    score: number;
    score_min: number;
    score_max: number;
    band: ScoreBandLabel;
    confidence: Confidence;
    disclaimer: string;
  };
  layers: FreeScanLayer[];
  top_issues: FreeScanIssue[];
  checks: Record<string, unknown>;
  operator_preview: OperatorPreview;
  cost: {
    llm_calls: number;
    estimated_tokens_input: number;
    estimated_tokens_output: number;
    estimated_eur: number;
    cost_capped: boolean;
  };
  cta: {
    title: string;
    description: string;
    payment_url: string;
    booking_url: string;
  };
}
