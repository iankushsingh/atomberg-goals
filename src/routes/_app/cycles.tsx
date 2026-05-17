import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Calendar, Plus, Sparkles } from "lucide-react";
import { useLiveCycles } from "@/lib/live-data";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/cycles")({ component: Cycles });

function Cycles() {
  const cycles = useLiveCycles();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", start_date: "", end_date: "", is_active: false });

  const submit = async () => {
    if (!form.name || !form.start_date || !form.end_date) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const { error } = await supabase.from("cycles").insert([form]);
      if (error) throw error;
      toast.success("Cycle created successfully");
      setOpen(false);
      setForm({ name: "", start_date: "", end_date: "", is_active: false });
    } catch (err: any) {
      toast.error(err?.message || "Failed to create cycle");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goal Cycles</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure cycle windows, deadlines and locks.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary shadow-elegant gap-2"><Plus className="h-4 w-4" /> New cycle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Create a new cycle</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Cycle Name</Label>
                <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g. FY26 H1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={form.start_date} onChange={(e) => setForm({...form, start_date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={form.end_date} onChange={(e) => setForm({...form, end_date: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} className="rounded border-input text-primary focus:ring-primary" />
                <Label htmlFor="is_active" className="cursor-pointer">Set as Active Phase</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-gradient-primary" onClick={submit}>Create Cycle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
