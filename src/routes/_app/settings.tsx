import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });
function SettingsPage() {
  const settings: [string, string][] = [
    ["Email notifications", "Receive goal updates and approvals by email"],
    ["Microsoft Teams", "Sync notifications to Teams channels"],
    ["Slack", "Get alerts in your Slack workspace"],
    ["Weekly digest", "Friday summary of your goal progress"],
    ["AI nudges", "Smart suggestions for your goals (beta)"],
  ];
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Preferences and integrations.</p>
      </div>
      <Panel title="Notifications & integrations">
        <div className="divide-y divide-border -mx-5">
          {settings.map(([t, d], i) => (
            <div key={t} className="flex items-center justify-between px-5 py-4">
              <div>
                <Label className="text-sm font-medium">{t}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{d}</p>
              </div>
              <Switch defaultChecked={i < 3} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
