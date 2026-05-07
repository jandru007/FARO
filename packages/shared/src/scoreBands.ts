import type { ScoreBand, ScoreTone } from "./types";

export const scoreBands: ScoreBand[] = [
  { min: 92, max: 100, label: "FARO Certified" },
  { min: 85, max: 91, label: "FARO Ready" },
  { min: 70, max: 84, label: "Operator-Compatible With Gaps" },
  { min: 50, max: 69, label: "Operator-Hostile" },
  { min: 30, max: 49, label: "Not Operable" },
  { min: 0, max: 29, label: "Invisible to Operators" }
];

export function getScoreBand(score: number): ScoreBand {
  const normalized = clampScore(score);
  return scoreBands.find((band) => normalized >= band.min && normalized <= band.max) ?? scoreBands[5]!;
}

export function getScoreTone(score: number): ScoreTone {
  const normalized = clampScore(score);

  if (normalized < 50) {
    return { name: "red", ring: "#D92D20", text: "#B42318", background: "#FEF3F2" };
  }

  if (normalized < 70) {
    return { name: "orange", ring: "#F97316", text: "#C2410C", background: "#FFF7ED" };
  }

  if (normalized < 85) {
    return { name: "amber", ring: "#D97706", text: "#92400E", background: "#FFFBEB" };
  }

  return { name: "green", ring: "#16A34A", text: "#166534", background: "#F0FDF4" };
}

export function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}
