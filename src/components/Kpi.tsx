import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Kpi({
  label, value, delta, icon: Icon, accent = "primary",
}: {
  label: string; value: string; delta?: number;
  icon: LucideIcon; accent?: "primary" | "success" | "warning" | "info";
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-elegant transition-smooth hover:shadow-lift hover:-translate-y-0.5 overflow-hidden">
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-10 blur-2xl transition-smooth" />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center",
          accent === "primary" && "bg-gradient-primary text-primary-foreground shadow-elegant",
          accent === "success" && "bg-[oklch(0.95_0.07_155)] dark:bg-[oklch(0.28_0.08_155)] text-[oklch(0.45_0.18_155)] dark:text-[oklch(0.8_0.17_155)]",
          accent === "warning" && "bg-[oklch(0.95_0.06_75)] dark:bg-[oklch(0.3_0.08_75)] text-[oklch(0.5_0.18_75)] dark:text-[oklch(0.85_0.15_75)]",
          accent === "info" && "bg-[oklch(0.95_0.05_230)] dark:bg-[oklch(0.3_0.08_230)] text-[oklch(0.45_0.18_230)] dark:text-[oklch(0.8_0.15_230)]",
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {typeof delta === "number" && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span className={cn("inline-flex items-center gap-0.5 font-medium", up ? "text-[oklch(0.55_0.18_155)] dark:text-[oklch(0.75_0.17_155)]" : "text-destructive")}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {up ? "+" : ""}{delta}%
          </span>
          <span className="text-muted-foreground">vs last quarter</span>
        </div>
      )}
    </div>
  );
}