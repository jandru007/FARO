import { Clock3, LockKeyhole, UserRoundX } from "lucide-react";

export function TrustRow() {
  const items = [
    { icon: Clock3, label: "Fast results" },
    { icon: UserRoundX, label: "No signup" },
    { icon: LockKeyhole, label: "Privacy focused" }
  ];

  return (
    <div className="mt-5 flex max-w-[590px] flex-wrap items-center justify-between gap-4 text-sm font-medium text-faro-muted">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <item.icon className="h-4 w-4 text-[#71717A]" aria-hidden="true" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
