import { getScoreTone } from "@faro/shared/scoreBands";

export function ScoreRing({ score, label }: { score: number; label: string }) {
  const tone = getScoreTone(score);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative grid h-[190px] w-[190px] place-items-center" aria-label={`Estimated FARO score ${score}, ${label}`}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 190 190" aria-hidden="true">
        <circle cx="95" cy="95" r={radius} fill="none" stroke="#ECEEF3" strokeWidth="16" />
        <circle
          cx="95"
          cy="95"
          r={radius}
          fill="none"
          stroke={tone.ring}
          strokeLinecap="round"
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-6xl font-semibold leading-none text-faro-ink">{score}</div>
        <div className="mt-2 text-sm font-semibold" style={{ color: tone.text }}>
          {label}
        </div>
      </div>
    </div>
  );
}
