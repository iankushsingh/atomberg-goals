import { useMemo } from "react";
import { Kpi } from "@/components/Kpi";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { useGoalMetrics, useLiveGoals, useLiveAuditLogs } from "@/lib/live-data";
import {
  Target, CheckCircle2, Clock, TrendingUp, Plus, ArrowRight,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import { Link } from "@tanstack/react-router";

const COLORS = ["oklch(0.55 0.21 268)", "oklch(0.68 0.18 230)", "oklch(0.65 0.18 155)", "oklch(0.78 0.15 75)", "oklch(0.65 0.15 320)"];

export function EmployeeDashboard() {
  const { user } = useAuth();
  const goals = useLiveGoals();
  const auditLogs = useLiveAuditLogs();
  const { completion, approved, pending } = useGoalMetrics(goals);

  const distribution = useMemo(() => {
    const counts = goals.reduce((acc, g) => {
      acc[g.thrust] = (acc[g.thrust] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.round((count / goals.length) * 100) || 0
    }));
  }, [goals]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">
            Welcome back, <span className="gradient-text">{user?.name.split(" ")[0]}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here's how your FY26 goals are tracking.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/goals"><Button variant="outline">View all goals</Button></Link>
          <Link to="/goals"><Button className="bg-gradient-primary shadow-elegant gap-2"><Plus className="h-4 w-4" /> New goal</Button></Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Goal Completion" value={`${completion}%`} delta={0} icon={Target} accent="primary" />
        <Kpi label="Quarterly Progress" value={`${completion}%`} delta={0} icon={TrendingUp} accent="info" />
        <Kpi label="Approved Goals" value={`${approved}/${goals.length}`} delta={0} icon={CheckCircle2} accent="success" />
        <Kpi label="Pending Actions" value={String(pending)} delta={0} icon={Clock} accent="warning" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Progress trend" subtitle="Planned vs actual achievement (FY26)">
          <div className="w-full h-[280px] flex items-center justify-center border border-dashed border-border rounded-xl">
            <p className="text-sm text-muted-foreground">Not enough historical check-in data to generate trend.</p>
          </div>
        </Panel>

        <Panel title="Goal distribution" subtitle="By thrust area">
          {distribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {distribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {distribution.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground truncate" title={d.name}>{d.name}</span>
                    <span className="ml-auto font-medium">{d.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-[250px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No goals yet.</p>
            </div>
          )}
        </Panel>
      </div>

      {/* Goals + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="My active goals" subtitle="Current FY26 cycle"
          action={<Link to="/goals" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-1.5 transition-all">View all <ArrowRight className="h-3 w-3" /></Link>}>
          <div className="space-y-3">
            {goals.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">You have no active goals.</p>
            ) : (
              goals.slice(0, 4).map((g) => {
                const pct = Math.round((g.actual / g.target) * 100);
                return (
                  <div key={g.id} className="group rounded-xl border border-border p-4 transition-smooth hover:border-primary/40 hover:bg-accent/30">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-muted-foreground">{g.id.slice(0, 8)}</span>
                          <span className="text-[10px] text-muted-foreground">·</span>
                          <span className="text-[10px] font-medium text-primary">{g.thrust}</span>
                        </div>
                        <p className="font-medium text-sm truncate">{g.title}</p>
                      </div>
                      <StatusBadge status={g.achStatus} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={pct} className="h-1.5 flex-1" />
                      <span className="text-xs font-semibold tabular-nums w-10 text-right">{pct}%</span>
                      <span className="text-xs text-muted-foreground tabular-nums w-16 text-right">{g.actual}/{g.target} {g.uom}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Panel>

        <Panel title="Recent activity">
          <div className="space-y-4">
            {auditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              auditLogs.slice(0, 5).map((n) => (
                <div key={n.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-primary opacity-90 flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                    {n.action[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm leading-tight capitalize">{n.action.replace("_", " ")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}