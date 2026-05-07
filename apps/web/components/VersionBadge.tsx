export function VersionBadge({ version }: { version: string }) {
  return (
    <span className="rounded-md border border-faro-border bg-faro-surface px-2 py-1 text-xs font-medium text-faro-muted">
      {version}
    </span>
  );
}
