"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "./ui";

export function UrlScanForm({
  isSubmitting,
  onSubmit
}: {
  isSubmitting: boolean;
  onSubmit: (url: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = url.trim();
    if (!value) {
      setError("Enter a valid public website URL.");
      return;
    }
    setError(null);
    onSubmit(value);
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <label className="sr-only" htmlFor="website-url">
        Website URL
      </label>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Input
          id="website-url"
          type="url"
          inputMode="url"
          placeholder="https://yourwebsite.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          aria-invalid={Boolean(error)}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Starting..." : "Scan my site"}
        </Button>
      </div>
      {error ? <p className="text-sm font-medium text-[#B42318]">{error}</p> : null}
    </form>
  );
}
