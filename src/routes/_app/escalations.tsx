import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useLiveGoals } from "@/lib/live-data";
import { useMemo } from "react";

export const Route = createFileRoute("/_app/escalations")({ component: Escalations });

function Escalations() {
  const goals = useLiveGoals();

  const items = useMemo(() => {
    return goals
      .filter((g) => g.achStatus === "At Risk" || g.achStatus === "Delayed")
      .map((g, i) => {
        // Calculate a fake "days" open just for the escalation visualization, 
        // since we don't track escalation tickets directly in a table yet.
        const days = Math.max(1, Math.floor((new Date().getTime() - new Date(g.due).getTime()) / (1000 * 3600 * 24)) + i * 3);
        const level = days > 10 ? "HR" : "Manager";
        return {
          id: `ESC-${g.id.slice(0, 5).toUpperCase()}`,
          title: `Goal "${g.title}" is ${g.achStatus.toLowerCase()}`,
          owner: g.owner || "Unassigned",
          days,
          level,
          severity: g.achStatus,
        };
      })
      .sort((a, b) => b.days - a.days);
  }, [goals]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Escalations</h1>
        <p className="text-sm text-muted-foreground mt-1">Rule-based escalations across Employee → Manager → HR.</p>
      </div>
      <div className="grid gap-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active escalations. Everything is on track!</p>
        ) : (
          items.map((e) => (
            <Panel key={e.id}>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="h-10 w-10 rounded-xl bg-[oklch(0.95_0.08_25)] dark:bg-[oklch(0.3_0.1_25)] text-[oklch(0.55_0.2_25)] dark:text-[oklch(0.85_0.2_25)] flex items-center justify-center"><AlertTriangle className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.id} · Owner: {e.owner} · {e.days}d open</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">Employee <ArrowRight className="h-3 w-3" /> <span className="font-medium text-foreground">{e.level}</span></div>
                <StatusBadge status={e.severity as any} />
              </div>
            </Panel>
          ))
        )}
      </div>
    </div>
  );
}
