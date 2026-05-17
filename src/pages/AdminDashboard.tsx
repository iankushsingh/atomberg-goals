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

const COLORS = ["oklch(0.55 0.21 268)", "oklch(0.68 0.18 230)", "oklch(0.65 0.18 155)", "oklch(0.78 0.15 75)", "oklch(0.65 0.15 320)"];

export function AdminDashboard() {
  const goals = useLiveGoals();
  const profiles = useLiveProfiles();
  const liveAuditLogs = useLiveAuditLogs();
  const metrics = useGoalMetrics(goals);
  
  // Fake heatmap data since we don't have enough history
  const heatmap = Array.from({ length: 7 }, (_, r) => Array.from({ length: 12 }, (_, c) => 42 + ((r * 17 + c * 9) % 56)));
  
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
      value: Math.round((count / goals.length) * 100) || 0
    }));
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
        <Panel className="lg:col-span-2" title="QoQ performance" subtitle="Department comparison">
          <div className="w-full h-[280px] flex items-center justify-center border border-dashed border-border rounded-xl">
            <p className="text-sm text-muted-foreground">Not enough data.</p>
          </div>
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
        <Panel className="lg:col-span-2" title="Organization heatmap" subtitle="Goal completion intensity by week">
          <div className="space-y-1">
            {["Eng","Sales","Mkt","Ops","Prod","HR","Fin"].map((dept, r) => (
              <div key={dept} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-10 shrink-0">{dept}</span>
                <div className="flex gap-1 flex-1">
                  {heatmap[r].map((v, c) => (
                    <div key={c}
                      className="h-6 flex-1 rounded transition-smooth hover:scale-110"
                      style={{ background: `oklch(0.55 0.21 268 / ${0.1 + v / 130})` }}
                      title={`${dept} · W${c+1}: ${v}%`}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-3 text-[10px] text-muted-foreground">
              <span>Less</span>
              {[0.15,0.3,0.5,0.7,0.9].map((o,i) => <span key={i} className="h-3 w-6 rounded" style={{ background: `oklch(0.55 0.21 268 / ${o})` }} />)}
              <span>More</span>
            </div>
          </div>
        </Panel>

        <Panel title="Org trend" subtitle="Quarterly progress">
          <div className="w-full h-[260px] flex items-center justify-center border border-dashed border-border rounded-xl">
            <p className="text-sm text-muted-foreground">Not enough historical data.</p>
          </div>
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