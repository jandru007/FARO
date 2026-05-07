export type UpdateType = "feature" | "fix" | "docs" | "infra" | "scan" | "open-source";

export interface FaroUpdate {
  date: string;
  type: UpdateType;
  title: string;
  description: string;
}

export const updates: FaroUpdate[] = [
  {
    date: "2026-05-07",
    type: "feature",
    title: "Added background scan queue",
    description: "Free scans are now processed in the background for better reliability."
  },
  {
    date: "2026-05-07",
    type: "scan",
    title: "Improved Operator Surface detection",
    description: "Better detection for /llms.txt, /agent.json and UCP endpoints."
  },
  {
    date: "2026-05-06",
    type: "docs",
    title: "Published FARO Score v0.6.1",
    description: "Latest methodology with UCP, account-aware pricing and more."
  },
  {
    date: "2026-05-06",
    type: "infra",
    title: "Connected live status to dashboard",
    description: "You can now see real-time progress for your scan."
  }
];
