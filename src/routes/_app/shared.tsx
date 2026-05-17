import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useLiveGoals } from "@/lib/live-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Share2 } from "lucide-react";
export const Route = createFileRoute("/_app/shared")({ component: Shared });
function Shared() {
  const goals = useLiveGoals();
  // We don't currently track 'shared' state in the DB, so we'll leave this empty for now
  // or you could filter based on a future property.
  const shared = goals.filter((g) => (g as any).shared);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shared Goals</h1>
        <p className="text-sm text-muted-foreground mt-1">Synced KPIs with shared ownership across teams.</p>
      </div>
      <div className="grid gap-4">
        {shared.length === 0 ? (
          <p className="text-sm text-muted-foreground">No shared goals at the moment.</p>
        ) : (
          shared.map((g) => (
            <Panel key={g.id} title={g.title} subtitle={g.description} action={<StatusBadge status={g.achStatus} />}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Share2 className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Shared with</span>
                  <div className="flex -space-x-2">
                    {["AM","PS","RV","NI"].map((i) => (
                      <Avatar key={i} className="h-7 w-7 ring-2 ring-background"><AvatarFallback className="bg-gradient-primary text-primary-foreground text-[10px]">{i}</AvatarFallback></Avatar>
                    ))}
                  </div>
                </div>
                <div className="text-sm"><span className="text-muted-foreground">Target:</span> <span className="font-semibold">{g.target} {g.uom}</span></div>
                <div className="text-sm"><span className="text-muted-foreground">Your weightage:</span> <span className="font-semibold">{g.weightage}%</span></div>
              </div>
            </Panel>
          ))
        )}
      </div>
    </div>
  );
}
