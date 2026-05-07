import Image from "next/image";
import Link from "next/link";
import { VersionBadge } from "./VersionBadge";

export function Header() {
  const version = process.env.NEXT_PUBLIC_FARO_VERSION || "v0.6.1";
  const githubUrl = process.env.GITHUB_REPO_URL || "https://github.com/jandru007/FARO";

  return (
    <header className="flex h-[var(--header-height)] w-full items-center justify-between border-b border-faro-border bg-white px-5 sm:px-8 lg:px-10">
      <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 rounded-lg">
        <span className="block h-7 w-12 overflow-hidden" aria-hidden="true">
          <Image
            src="/faro-logo-colour.png"
            alt=""
            width={112}
            height={28}
            priority
            className="h-7 w-[112px] max-w-none object-contain"
          />
        </span>
        <span className="sr-only">FARO logo</span>
        <span className="text-[18px] font-semibold tracking-[0px] text-faro-ink">FARO</span>
        <VersionBadge version={version} />
      </Link>

      <nav className="hidden items-center gap-7 text-sm font-medium text-faro-muted md:flex">
        <Link className="focus-ring rounded-md hover:text-faro-ink" href="/docs">
          Docs
        </Link>
        <a className="focus-ring rounded-md hover:text-faro-ink" href={githubUrl}>
          GitHub
        </a>
        <Link className="focus-ring rounded-md hover:text-faro-ink" href="/updates">
          Updates
        </Link>
        <Link
          className="focus-ring rounded-lg bg-[#05070D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
          href="/audit"
        >
          Get Full Audit
        </Link>
      </nav>

      <Link
        className="focus-ring rounded-lg bg-[#05070D] px-3.5 py-2 text-sm font-semibold text-white md:hidden"
        href="/audit"
      >
        Audit
      </Link>
    </header>
  );
}
