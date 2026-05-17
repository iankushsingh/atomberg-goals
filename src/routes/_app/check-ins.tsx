import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useLiveGoals } from "@/lib/live-data";
import { Progress } from "@/components/ui/progress";
export const Route = createFileRoute("/_app/check-ins")({ component: CheckIns });
function CheckIns() {
  const goals = useLiveGoals();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quarterly Updates</h1>
        <p className="text-sm text-muted-foreground mt-1">Track planned vs actual achievement across your goals.</p>
      </div>
      {goals.length === 0 ? (
        <p className="text-sm text-muted-foreground">No goals found to check-in on.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {goals.map((g) => {
            const pct = Math.round((g.actual / g.target) * 100);
            return (
              <Panel key={g.id} title={g.title} subtitle={`${g.thrust} · ${g.id.slice(0, 8)}`} action={<StatusBadge status={g.achStatus} />}>
                <div className="grid grid-cols-3 gap-3 text-center mb-3">
                  <div><p className="text-xs text-muted-foreground">Planned</p><p className="text-xl font-semibold tabular-nums">{g.target}</p></div>
                  <div><p className="text-xs text-muted-foreground">Actual</p><p className="text-xl font-semibold tabular-nums gradient-text">{g.actual}</p></div>
                  <div><p className="text-xs text-muted-foreground">UoM</p><p className="text-xl font-semibold">{g.uom}</p></div>
                </div>
                <Progress value={pct} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">{pct}% achieved · due {g.due ? new Date(g.due).toLocaleDateString() : "No Date"}</p>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
