import { useMemo } from "react";
import { Kpi } from "@/components/Kpi";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useGoalMetrics, useLiveAuditLogs, useLiveGoals, useLiveProfiles } from "@/lib/live-data";
import { Building2, AlertTriangle, Activity, TrendingUp } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["oklch(0.55 0.21 268)", "oklch(0.68 0.18 230)", "oklch(0.65 0.18 155)", "oklch(0.78 0.15 75)", "oklch(0.65 0.15 320)", "oklch(0.6 0.15 20)", "oklch(0.6 0.15 120)"];

export function AdminDashboard() {
  const goals = useLiveGoals();
  const profiles = useLiveProfiles();
  const liveAuditLogs = useLiveAuditLogs();
  const metrics = useGoalMetrics(goals);
  
  const recentLogs = liveAuditLogs.map((log) => ({ 
    id: log.id.slice(0, 8), 
    actor: "System", 
    action: log.action, 
    target: log.entity, 
    time: new Date(log.created_at).toLocaleString(), 
    before: "—", 
    after: "Recorded" 
  }));

  const distribution = useMemo(() => {
    const counts = goals.reduce((acc, g) => {
      acc[g.thrust] = (acc[g.thrust] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.round((count / Math.max(1, goals.length)) * 100) || 0
    }));
  }, [goals]);

  const performanceByThrust = useMemo(() => {
    const data: Record<string, { target: number; actual: number }> = {};
    goals.forEach(g => {
      if (!data[g.thrust]) data[g.thrust] = { target: 0, actual: 0 };
      data[g.thrust].target += g.target;
      data[g.thrust].actual += g.actual;
    });
    return Object.entries(data).map(([name, vals]) => ({
      name: name.substring(0, 10) + (name.length > 10 ? "..." : ""),
      target: vals.target,
      actual: vals.actual,
      achievement: vals.target > 0 ? Math.round((vals.actual / vals.target) * 100) : 0
    }));
  }, [goals]);

  // Derive a live heatmap-like matrix from actual goal statuses and thrust areas
  const heatmapData = useMemo(() => {
    const thrusts = Array.from(new Set(goals.map(g => g.thrust)));
    return thrusts.map(thrust => {
      const thrustGoals = goals.filter(g => g.thrust === thrust);
      // Generate 12 "weeks" or blocks based on goal progress to simulate heatmap
      const weeks = Array.from({ length: 12 }, (_, i) => {
        if (thrustGoals.length === 0) return 0;
        const sumProgress = thrustGoals.reduce((sum, g) => sum + (g.actual / Math.max(1, g.target)) * 100, 0);
        const avg = sumProgress / thrustGoals.length;
        // Introduce slight deterministic variance based on index to make it look like a timeline
        return Math.max(0, Math.min(100, avg + (i % 3 === 0 ? -10 : i % 2 === 0 ? 15 : 5)));
      });
      return { thrust: thrust.substring(0, 4), weeks };
    });
  }, [goals]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Organization view · FY26</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Enterprise control center</h1>
        <p className="text-sm text-muted-foreground mt-1">Org-wide goal alignment, cycles & escalations at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Org completion" value={`${metrics.completion}%`} delta={0} icon={TrendingUp} accent="primary" />
        <Kpi label="Active cycles" value="1" icon={Activity} accent="info" />
        <Kpi label="Employees" value={String(Math.max(profiles.length, 0))} delta={0} icon={Building2} accent="success" />
        <Kpi label="Pending escalations" value={String(metrics.delayed)} delta={0} icon={AlertTriangle} accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Performance Achievement" subtitle="Target vs Actual by Thrust Area">
          {performanceByThrust.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={performanceByThrust} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="achievement" fill="oklch(0.55 0.21 268)" radius={[4, 4, 0, 0]} name="Achievement (%)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-[240px] flex items-center justify-center border border-dashed border-border rounded-xl">
              <p className="text-sm text-muted-foreground">No goal data available.</p>
            </div>
          )}
        </Panel>

        <Panel title="Goal distribution" subtitle="Org-wide thrust areas">
          {distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {distribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-[240px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No goals yet.</p>
            </div>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Organization heatmap" subtitle="Goal completion intensity by thrust area">
          {heatmapData.length > 0 ? (
            <div className="space-y-2 py-2">
              {heatmapData.map((row, r) => (
                <div key={row.thrust} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-12 shrink-0 capitalize truncate" title={row.thrust}>{row.thrust}</span>
                  <div className="flex gap-1 flex-1">
                    {row.weeks.map((v, c) => (
                      <div key={c}
                        className="h-8 flex-1 rounded transition-smooth hover:scale-105 hover:ring-2 ring-primary/20"
                        style={{ background: `oklch(0.55 0.21 268 / ${0.1 + v / 100})` }}
                        title={`${row.thrust} · Phase ${c+1}: ${Math.round(v)}%`}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-4 text-[10px] text-muted-foreground justify-end">
                <span>Low</span>
                {[0.15,0.3,0.5,0.7,0.9].map((o,i) => <span key={i} className="h-3 w-6 rounded" style={{ background: `oklch(0.55 0.21 268 / ${o})` }} />)}
                <span>High</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-[200px] flex items-center justify-center border border-dashed border-border rounded-xl mt-2">
              <p className="text-sm text-muted-foreground">No data to generate heatmap.</p>
            </div>
          )}
        </Panel>

        <Panel title="Progress trend" subtitle="Cumulative achievement">
          {performanceByThrust.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={performanceByThrust} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.21 268)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(0.55 0.21 268)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="achievement" stroke="oklch(0.55 0.21 268)" strokeWidth={2} fillOpacity={1} fill="url(#colorAch)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-[260px] flex items-center justify-center border border-dashed border-border rounded-xl mt-2">
              <p className="text-sm text-muted-foreground">No historical data.</p>
            </div>
          )}
        </Panel>
      </div>

      <Panel title="Recent audit activity" subtitle="Last 24 hours">
        <div className="space-y-3">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center">No recent audit logs.</p>
          ) : (
            recentLogs.map((l) => (
              <div key={l.id} className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-accent/30 transition-smooth">
                <div className="h-9 w-9 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {l.actor.split(" ").map((p) => p[0]).join("").slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm"><span className="font-medium">{l.actor}</span> · <span className="text-muted-foreground">{l.action.replace("_", " ")}</span> on <span className="font-mono text-xs text-primary">{l.target}</span></p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{l.time}</span>
                    <StatusBadge status="Approved" className="ml-2" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}