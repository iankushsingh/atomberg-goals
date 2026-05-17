import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertTriangle, ArrowRight } from "lucide-react";
export const Route = createFileRoute("/_app/escalations")({ component: Escalations });
function Escalations() {
  const items = [
    { id: "ESC-001", title: "Goal G-106 not submitted", owner: "Arjun Mehta", days: 5, level: "Manager", severity: "At Risk" },
    { id: "ESC-002", title: "Q2 check-in pending", owner: "Neha Iyer", days: 3, level: "Manager", severity: "Delayed" },
    { id: "ESC-003", title: "Manager approval delayed", owner: "Rahul Verma", days: 7, level: "HR", severity: "At Risk" },
    { id: "ESC-004", title: "Cycle deadline missed", owner: "Vikram Joshi", days: 12, level: "HR", severity: "Delayed" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Escalations</h1>
        <p className="text-sm text-muted-foreground mt-1">Rule-based escalations across Employee → Manager → HR.</p>
      </div>
      <div className="grid gap-3">
        {items.map((e) => (
          <Panel key={e.id}>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="h-10 w-10 rounded-xl bg-[oklch(0.95_0.08_25)] dark:bg-[oklch(0.3_0.1_25)] text-[oklch(0.55_0.2_25)] dark:text-[oklch(0.85_0.2_25)] flex items-center justify-center"><AlertTriangle className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.id} · Owner: {e.owner} · {e.days}d open</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">Employee <ArrowRight className="h-3 w-3" /> <span className="font-medium text-foreground">{e.level}</span></div>
              <StatusBadge status={e.severity} />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
