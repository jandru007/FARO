import type { LayerStatus } from "@faro/shared";

const styles: Record<LayerStatus, string> = {
  good: "bg-[#F0FDF4] text-[#166534]",
  fair: "bg-[#FFFBEB] text-[#92400E]",
  poor: "bg-[#FEF3F2] text-[#B42318]"
};

export function StatusBadge({ status }: { status: LayerStatus }) {
  const label = status === "good" ? "Good" : status === "fair" ? "Fair" : "Poor";
  return <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{label}</span>;
}
