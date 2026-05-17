import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  Submitted: "bg-[oklch(0.95_0.05_230)] dark:bg-[oklch(0.3_0.08_230)] text-[oklch(0.45_0.18_230)] dark:text-[oklch(0.8_0.15_230)] border-transparent",
  Returned: "bg-[oklch(0.95_0.06_75)] dark:bg-[oklch(0.3_0.08_75)] text-[oklch(0.5_0.18_75)] dark:text-[oklch(0.85_0.15_75)] border-transparent",
  Approved: "bg-[oklch(0.95_0.07_155)] dark:bg-[oklch(0.28_0.08_155)] text-[oklch(0.45_0.18_155)] dark:text-[oklch(0.8_0.17_155)] border-transparent",
  Locked: "bg-[oklch(0.92_0.02_265)] dark:bg-[oklch(0.3_0.04_265)] text-[oklch(0.4_0.05_265)] dark:text-[oklch(0.85_0.03_265)] border-transparent",
  "On Track": "bg-[oklch(0.95_0.07_155)] dark:bg-[oklch(0.28_0.08_155)] text-[oklch(0.45_0.18_155)] dark:text-[oklch(0.8_0.17_155)] border-transparent",
  Completed: "bg-[oklch(0.95_0.07_155)] dark:bg-[oklch(0.28_0.08_155)] text-[oklch(0.45_0.18_155)] dark:text-[oklch(0.8_0.17_155)] border-transparent",
  Delayed: "bg-[oklch(0.95_0.06_45)] dark:bg-[oklch(0.3_0.1_45)] text-[oklch(0.5_0.2_45)] dark:text-[oklch(0.85_0.18_45)] border-transparent",
  "At Risk": "bg-[oklch(0.95_0.08_25)] dark:bg-[oklch(0.3_0.1_25)] text-[oklch(0.5_0.22_25)] dark:text-[oklch(0.85_0.2_25)] border-transparent",
  "Not Started": "bg-muted text-muted-foreground border-border",
  Active: "bg-[oklch(0.95_0.07_155)] dark:bg-[oklch(0.28_0.08_155)] text-[oklch(0.45_0.18_155)] dark:text-[oklch(0.8_0.17_155)] border-transparent",
  Inactive: "bg-muted text-muted-foreground border-border",
  High: "bg-[oklch(0.95_0.08_25)] dark:bg-[oklch(0.3_0.1_25)] text-[oklch(0.5_0.22_25)] dark:text-[oklch(0.85_0.2_25)] border-transparent",
  Medium: "bg-[oklch(0.95_0.06_75)] dark:bg-[oklch(0.3_0.08_75)] text-[oklch(0.5_0.18_75)] dark:text-[oklch(0.85_0.15_75)] border-transparent",
  Low: "bg-[oklch(0.95_0.05_230)] dark:bg-[oklch(0.3_0.08_230)] text-[oklch(0.45_0.18_230)] dark:text-[oklch(0.8_0.15_230)] border-transparent",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-smooth",
        map[status] || "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}