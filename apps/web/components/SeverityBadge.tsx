import type { Severity } from "@faro/shared";

const styles: Record<Severity, string> = {
  high: "bg-[#FEF3F2] text-[#B42318]",
  medium: "bg-[#FFF7ED] text-[#C2410C]",
  low: "bg-[#F4F4F5] text-[#52525B]"
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[severity]}`}>{severity}</span>;
}
