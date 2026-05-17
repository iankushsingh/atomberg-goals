import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { useLiveAuditLogs } from "@/lib/live-data";
export const Route = createFileRoute("/_app/audit")({ component: Audit });
function Audit() {
  const auditLogs = useLiveAuditLogs();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Immutable trail of all changes across the platform.</p>
      </div>
      <Panel>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-left font-medium py-3">Log ID</th>
              <th className="text-left font-medium">Actor</th>
              <th className="text-left font-medium">Action</th>
              <th className="text-left font-medium">Target</th>
              <th className="text-left font-medium">Before → After</th>
              <th className="text-left font-medium">Timestamp</th>
            </tr></thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr><td colSpan={6} className="py-4 text-center text-sm text-muted-foreground">No audit logs found.</td></tr>
              ) : (
                auditLogs.map((l) => (
                  <tr key={l.id} className="border-b border-border/60 last:border-0 hover:bg-accent/30 transition-smooth">
                    <td className="py-3 font-mono text-xs text-muted-foreground">{l.id.slice(0, 8)}</td>
                    <td className="font-medium">System</td>
                    <td className="text-muted-foreground capitalize">{l.action.replace("_", " ")}</td>
                    <td className="font-mono text-xs text-primary">{l.entity}</td>
                    <td className="text-xs"><span className="text-muted-foreground line-through">—</span> → <span className="font-medium">Recorded</span></td>
                    <td className="text-xs text-muted-foreground tabular-nums">{new Date(l.created_at).toLocaleString()}</td>
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
