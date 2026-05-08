export type UpdateType = "feature" | "fix" | "docs" | "infra" | "scan" | "open-source";

export interface FaroUpdate {
  date: string;
  type: UpdateType;
  title: string;
  description: string;
}

export interface FaroRoadmapItem {
  timeframe: string;
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

export const roadmap: FaroRoadmapItem[] = [
  {
    timeframe: "Next",
    title: "Vertical scan profiles",
    description: "Tailored Free Scan checks for ecommerce, SaaS, hotels, agencies, and B2B sites."
  },
  {
    timeframe: "Next",
    title: "Full Audit evidence packs",
    description: "Replay-backed findings that connect Free Scan gaps to verified Operator task outcomes."
  },
  {
    timeframe: "Later",
    title: "Ready Kit implementation path",
    description: "A guided service layer for adding /llms.txt, /agent.json, schema fixes, and policy alignment."
  }
];
