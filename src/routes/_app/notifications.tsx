import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { useLiveAuditLogs } from "@/lib/live-data";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/_app/notifications")({ component: NotificationsPage });
function NotificationsPage() {
  const logs = useLiveAuditLogs();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">All your goal activity in one place.</p>
      </div>
      <Panel>
        <div className="divide-y divide-border -mx-5">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground p-5 text-center">No recent notifications.</p>
          ) : (
            logs.map((n) => (
              <div key={n.id} className={cn("flex items-start gap-4 px-5 py-4 hover:bg-accent/30 transition-smooth")}>
                <div className="h-10 w-10 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0"><Bell className="h-4 w-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">{n.action.replace("_", " ")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(n.created_at).toLocaleString()} · System</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}
