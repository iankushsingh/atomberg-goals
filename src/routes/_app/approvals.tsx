import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useLiveGoals } from "@/lib/live-data";
import { Check, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/approvals")({ component: Approvals });
function Approvals() {
  const goals = useLiveGoals();
  const pending = goals.filter((g) => g.status === "Submitted" || g.status === "Draft");

  const [returningId, setReturningId] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const handleApprove = async (dbId: string) => {
    try {
      const { error } = await supabase.from("goals").update({ status: "approved" as any, manager_comment: null }).eq("id", dbId);
      if (error) throw error;
      toast.success("Goal approved");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      toast.error(err?.message || "Action failed");
    }
  };

  const submitReturn = async () => {
    if (!returningId) return;
    if (!comment.trim()) { toast.error("Please provide a reason for returning"); return; }
    try {
      const { error } = await supabase.from("goals").update({ 
        status: "draft" as any, 
        manager_comment: comment 
      }).eq("id", returningId);
      if (error) throw error;
      toast.success("Goal returned to draft");
      setReturningId(null);
      setComment("");
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
                <Button size="sm" className="bg-gradient-primary gap-1.5" onClick={() => handleApprove(g.dbId)}><Check className="h-3.5 w-3.5" /> Approve</Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setReturningId(g.dbId); setComment(""); }}><X className="h-3.5 w-3.5" /> Return</Button>
              </div>
            </Panel>
          ))
        )}
      </div>
      <Dialog open={!!returningId} onOpenChange={(o) => !o && setReturningId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Return goal to draft</DialogTitle></DialogHeader>
          <div className="space-y-2 py-4">
            <Label>Reason for returning</Label>
            <Textarea placeholder="Explain what needs to be changed..." value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturningId(null)}>Cancel</Button>
            <Button className="bg-gradient-primary" onClick={submitReturn}>Return goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
