import { useMemo, useState } from "react";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useLiveGoals, type Goal } from "@/lib/live-data";
import { Plus, Search, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function GoalsPage() {
  const goals = useLiveGoals();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    thrust: "Revenue Growth", title: "", description: "",
    uom: "%", target: 100, weightage: 10, due: "", priority: "Medium" as Goal["priority"],
  });

  const totalWeight = useMemo(() => goals.reduce((a, g) => a + g.weightage, 0), [goals]);
  const filtered = goals.filter((g) => g.title.toLowerCase().includes(q.toLowerCase()) || g.id.toLowerCase().includes(q.toLowerCase()));
  const remaining = 100 - totalWeight;

  const submit = async (status: Goal["status"]) => {
    if (!form.title) { toast.error("Goal title is required"); return; }
    if (form.weightage < 10) { toast.error("Minimum weightage is 10%"); return; }
    if (goals.length >= 8) { toast.error("Maximum 8 goals per cycle"); return; }
    if (status === "Submitted" && totalWeight + form.weightage !== 100) {
      toast.error(`Total weightage must equal 100% (currently ${totalWeight + form.weightage}%)`);
      return;
    }
    
    try {
      const { error } = await supabase.from("goals").insert({
        title: form.title,
        description: form.description,
        category: form.thrust,
        weightage: Number(form.weightage),
        due_date: form.due || "2026-12-31",
        status: status === "Draft" ? "draft" : "submitted",
        progress: 0,
        owner_id: user?.id || ""
      });

      if (error) throw error;

      toast.success(status === "Draft" ? "Saved as draft" : "Goal submitted for approval");
      setOpen(false);
      setForm({ ...form, title: "", description: "", weightage: 10 });
      setTimeout(() => window.location.reload(), 1000); // Reload to fetch fresh goals
    } catch (err: any) {
      toast.error(err?.message || "Failed to create goal");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Goals</h1>
          <p className="text-sm text-muted-foreground mt-1">Goal sheet for FY26 · {goals.length}/8 goals</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search goals…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 w-64" />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-elegant gap-2"><Plus className="h-4 w-4" /> New goal</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Create a new goal</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Goal title</Label>
                  <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Launch GoalSphere AI Coach" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} placeholder="What does success look like?" />
                </div>
                <div className="space-y-2">
                  <Label>Thrust Area</Label>
                  <select value={form.thrust} onChange={(e) => setForm({...form, thrust: e.target.value})} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    {["Revenue Growth","Product Innovation","Operational Excellence","Customer Success","People","Quality"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value as Goal["priority"]})} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>UoM</Label>
                  <select value={form.uom} onChange={(e) => setForm({...form, uom: e.target.value})} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    {["%","Number","INR Cr","Score","Hires","Release"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Target</Label>
                  <Input type="number" value={form.target} onChange={(e) => setForm({...form, target: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Weightage (%)</Label>
                  <Input type="number" min={10} max={100} value={form.weightage} onChange={(e) => setForm({...form, weightage: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Due date</Label>
                  <Input type="date" value={form.due} onChange={(e) => setForm({...form, due: e.target.value})} />
                </div>

                <div className="col-span-2 rounded-xl border border-border p-3 bg-secondary/50">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Total weightage (incl. this goal)</span>
                    <span className={cn("font-semibold tabular-nums", totalWeight + form.weightage === 100 ? "text-[oklch(0.55_0.18_155)]" : "text-foreground")}>
                      {totalWeight + form.weightage}% / 100%
                    </span>
                  </div>
                  <Progress value={Math.min(100, totalWeight + form.weightage)} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                    {totalWeight + form.weightage === 100 ? <CheckCircle2 className="h-3 w-3 text-[oklch(0.55_0.18_155)]" /> : <AlertCircle className="h-3 w-3" />}
                    {remaining > 0 ? `${remaining - form.weightage}% remaining after this goal` : "Sheet is balanced"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => submit("Draft")}>Save draft</Button>
                <Button className="bg-gradient-primary" onClick={() => submit("Submitted")}>Submit for approval</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel title="Total weightage" subtitle="Must equal 100% to submit">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold tabular-nums">{totalWeight}<span className="text-xl text-muted-foreground">%</span></span>
            <span className={cn("text-xs font-medium", totalWeight === 100 ? "text-[oklch(0.55_0.18_155)]" : "text-[oklch(0.65_0.18_75)]")}>
              {totalWeight === 100 ? "Balanced" : `${100 - totalWeight}% remaining`}
            </span>
          </div>
          <Progress value={totalWeight} className="h-2" />
        </Panel>
        <Panel title="Goals count" subtitle="Max 8 per cycle">
          <div className="text-4xl font-bold tabular-nums">{goals.length}<span className="text-xl text-muted-foreground">/8</span></div>
          <div className="flex gap-1 mt-3">{Array.from({length:8}).map((_,i) => <div key={i} className={cn("h-1.5 flex-1 rounded-full", i < goals.length ? "bg-gradient-primary" : "bg-border")} />)}</div>
        </Panel>
        <Panel title="Cycle status" subtitle="FY26 Annual">
          <div className="flex items-center gap-3"><StatusBadge status="Approved" /><span className="text-sm text-muted-foreground">Open until Dec 31, 2026</span></div>
          <p className="text-xs text-muted-foreground mt-3">Next check-in: Apr 30 · Manager: Rahul Verma</p>
        </Panel>
      </div>

      <Panel title="Goal sheet" subtitle={`${filtered.length} goals`}>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-3">ID</th>
                <th className="text-left font-medium">Thrust · Title</th>
                <th className="text-left font-medium">Target</th>
                <th className="text-left font-medium">Wt.</th>
                <th className="text-left font-medium">Progress</th>
                <th className="text-left font-medium">Status</th>
                <th className="text-left font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => {
                const pct = Math.round((g.actual / g.target) * 100);
                return (
                  <tr key={g.id} className="border-b border-border/60 last:border-0 hover:bg-accent/30 transition-smooth cursor-pointer">
                    <td className="py-3 font-mono text-xs text-muted-foreground">{g.id}</td>
                    <td className="py-3 max-w-md">
                      <p className="text-[11px] text-primary font-medium">{g.thrust}</p>
                      <p className="font-medium truncate">{g.title}</p>
                    </td>
                    <td className="tabular-nums whitespace-nowrap">{g.target} {g.uom}</td>
                    <td className="tabular-nums">{g.weightage}%</td>
                    <td className="min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs tabular-nums font-medium w-9">{pct}%</span>
                      </div>
                    </td>
                    <td><StatusBadge status={g.status} /></td>
                    <td><StatusBadge status={g.priority} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}