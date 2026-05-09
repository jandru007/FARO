import Image from "next/image";
import Link from "next/link";
import { VersionBadge } from "./VersionBadge";

export function Header({ overlay = false }: { overlay?: boolean }) {
  const version = process.env.NEXT_PUBLIC_FARO_VERSION || "v0.6.1";
  const githubUrl = process.env.GITHUB_REPO_URL || "https://github.com/jandru007/FARO";
  const docsUrl = "https://docs.farostandard.org";

  return (
    <header
      className={`z-30 flex h-[var(--header-height)] w-full items-center justify-between bg-transparent px-5 sm:px-8 lg:px-10 ${
        overlay ? "absolute inset-x-0 top-0" : "relative"
      }`}
    >
      <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 rounded-lg">
        <Image
          src="/faro-logo-colour.png"
          alt="FARO"
          width={124}
          height={31}
          priority
          className="h-7 w-auto object-contain"
        />
        <VersionBadge version={version} />
      </Link>

      <nav className="hidden items-center gap-7 text-sm font-medium text-faro-muted md:flex">
        <a className="focus-ring rounded-md hover:text-faro-ink" href={docsUrl}>
          Docs
        </a>
        <a className="focus-ring rounded-md hover:text-faro-ink" href={githubUrl}>
          GitHub
        </a>
        <Link className="focus-ring rounded-md hover:text-faro-ink" href="/updates">
          Updates
        </Link>
        <Link
          className="focus-ring faro-blue-button inline-flex items-center rounded-[10px] px-5 py-2.5 text-sm font-semibold text-white"
          href="/audit"
        >
          <span className="relative z-10">Get Full Audit</span>
        </Link>
      </nav>

      <Link
        className="focus-ring faro-blue-button rounded-[10px] px-3.5 py-2 text-sm font-semibold text-white md:hidden"
        href="/audit"
      >
        <span className="relative z-10">Audit</span>
      </Link>
    </header>
  );
}
