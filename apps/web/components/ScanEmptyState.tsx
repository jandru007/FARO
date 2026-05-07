export function ScanEmptyState() {
  return (
    <div className="mx-auto flex min-h-[520px] max-w-[760px] flex-col justify-center">
      <p className="text-lg font-semibold text-faro-ink">Run a free scan to see your FARO Readiness Estimate.</p>
      <div className="mt-8 space-y-4 rounded-lg border border-dashed border-faro-border bg-white p-6">
        <div className="h-5 w-1/3 rounded bg-[#EDEEF2]" />
        <div className="h-24 rounded-full border-[18px] border-[#ECEEF3]" />
        <div className="space-y-3">
          <div className="h-3 w-4/5 rounded bg-[#ECEEF3]" />
          <div className="h-3 w-2/3 rounded bg-[#ECEEF3]" />
          <div className="h-3 w-3/4 rounded bg-[#ECEEF3]" />
        </div>
      </div>
    </div>
  );
}
