import { Suspense } from "react";
import { Header } from "@/components/Header";
import { FaroDashboard } from "@/components/FaroDashboard";
import { updates } from "@/content/updates";

export default function HomePage() {
  return (
    <>
      <Header />
      <Suspense fallback={<main className="min-h-[calc(100svh-var(--header-height))] bg-white" />}>
        <FaroDashboard updates={updates.slice(0, 4)} />
      </Suspense>
    </>
  );
}
