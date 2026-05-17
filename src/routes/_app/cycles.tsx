import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Calendar } from "lucide-react";
import { useLiveCycles } from "@/lib/live-data";

export const Route = createFileRoute("/_app/cycles")({ component: Cycles });

function Cycles() {
  const cycles = useLiveCycles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Goal Cycles</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure cycle windows, deadlines and locks.</p>
      </div>
      <div className="grid gap-4">
        {cycles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No cycles found. Add cycles in the database to see them here.</p>
        ) : (
          cycles.map((c) => (
            <Panel key={c.id}>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-elegant">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.is_active ? "Active Phase" : "Closed Phase"} · {new Date(c.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} → {new Date(c.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <StatusBadge status={c.is_active ? "Approved" : "Locked"} />
              </div>
            </Panel>
          ))
        )}
      </div>
    </div>
  );
}
