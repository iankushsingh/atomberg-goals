import { Kpi } from "@/components/Kpi";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useGoalMetrics, useLiveGoals, useLiveProfiles } from "@/lib/live-data";
import { Users2, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ManagerDashboard() {
  const goals = useLiveGoals();
  const profiles = useLiveProfiles();
  const metrics = useGoalMetrics(goals);
  
  const teamGoals = profiles.length
    ? profiles.slice(0, 8).map((profile) => {
        const userGoals = goals.filter(g => g.owner === profile.id);
        const completed = userGoals.filter(g => g.achStatus === "Completed").length;
        const completion = userGoals.length ? Math.round((completed / userGoals.length) * 100) : 0;
        return {
          id: profile.id,
          name: profile.full_name,
          dept: profile.departments?.name ?? "Unassigned",
          goals: userGoals.length,
          completion: completion,
          status: "On Track",
        };
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Manager view · FY26 Q2</p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">Team performance</h1>
          <p className="text-sm text-muted-foreground mt-1">Track goals, approvals and check-ins across your team.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Schedule check-in</Button>
          <Button className="bg-gradient-primary shadow-elegant">Review approvals</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Team completion" value={`${metrics.completion}%`} delta={0} icon={CheckCircle2} accent="primary" />
        <Kpi label="Pending approvals" value={String(metrics.pending)} delta={0} icon={ShieldCheck} accent="warning" />
        <Kpi label="Delayed goals" value={String(metrics.delayed)} delta={0} icon={AlertTriangle} accent="info" />
        <Kpi label="Check-in completion" value="100%" delta={0} icon={Users2} accent="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Team performance trend" subtitle="Aggregate planned vs actual">
          <div className="w-full h-[280px] flex items-center justify-center border border-dashed border-border rounded-xl">
            <p className="text-sm text-muted-foreground">Not enough historical data to generate trend.</p>
          </div>
        </Panel>

        <Panel title="Quarterly analytics" subtitle="By department">
          <div className="w-full h-[280px] flex items-center justify-center border border-dashed border-border rounded-xl">
            <p className="text-sm text-muted-foreground">Not enough data.</p>
          </div>
        </Panel>
      </div>

      <Panel title="Team members" subtitle="Current cycle progress">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-3">Employee</th>
                <th className="text-left font-medium">Department</th>
                <th className="text-left font-medium">Goals</th>
                <th className="text-left font-medium">Completion</th>
                <th className="text-left font-medium">Status</th>
                <th className="text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {teamGoals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No team members found.</td>
                </tr>
              ) : (
                teamGoals.map((m) => (
                  <tr key={m.id} className="border-b border-border/60 last:border-0 hover:bg-accent/30 transition-smooth">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">{m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                        <span className="font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{m.dept}</td>
                    <td className="tabular-nums">{m.goals}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-gradient-primary" style={{ width: `${m.completion}%` }} />
                        </div>
                        <span className="text-xs tabular-nums font-medium">{m.completion}%</span>
                      </div>
                    </td>
                    <td><StatusBadge status={m.status} /></td>
                    <td className="text-right"><Button variant="ghost" size="sm">Review</Button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}