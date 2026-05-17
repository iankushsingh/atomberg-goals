import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useLiveGoals } from "@/lib/live-data";
import { Check, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/approvals")({ component: Approvals });
function Approvals() {
  const goals = useLiveGoals();
  const pending = goals.filter((g) => g.status === "Submitted" || g.status === "Draft");

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const dbId = id.startsWith("G-") ? goals.find(g => g.id === id)?.id : id; // Hack for mapped IDs if any, actually live-data uses real UUIDs so id is UUID.
      const { error } = await supabase.from("goals").update({ status: newStatus as any }).eq("id", id);
      if (error) throw error;
      toast.success(`Goal ${newStatus === "approved" ? "approved" : "returned"}`);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      toast.error(err?.message || "Action failed");
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Goal Approvals</h1>
        <p className="text-sm text-muted-foreground mt-1">{pending.length} goals awaiting your review.</p>
      </div>
      <div className="grid gap-4">
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No goals pending approval.</p>
        ) : (
          pending.map((g) => (
            <Panel key={g.id} title={g.title} subtitle={`${g.thrust} · Submitted by ${g.owner}`} action={<StatusBadge status={g.status} />}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><p className="text-xs text-muted-foreground">Target</p><p className="font-semibold">{g.target} {g.uom}</p></div>
                <div><p className="text-xs text-muted-foreground">Weightage</p><p className="font-semibold">{g.weightage}%</p></div>
                <div><p className="text-xs text-muted-foreground">Priority</p><StatusBadge status={g.priority} /></div>
                <div><p className="text-xs text-muted-foreground">Due</p><p className="font-semibold">{g.due}</p></div>
              </div>
              <p className="text-sm text-muted-foreground">{g.description}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="bg-gradient-primary gap-1.5" onClick={() => handleStatusChange(g.id, "approved")}><Check className="h-3.5 w-3.5" /> Approve</Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleStatusChange(g.id, "rejected")}><X className="h-3.5 w-3.5" /> Return</Button>
                <Button size="sm" variant="ghost" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Comment</Button>
              </div>
            </Panel>
          ))
        )}
      </div>
    </div>
  );
}
