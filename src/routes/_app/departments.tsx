import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { Building2 } from "lucide-react";
import { useLiveDepartments, useLiveProfiles } from "@/lib/live-data";

export const Route = createFileRoute("/_app/departments")({ component: Departments });
function Departments() {
  const depts = useLiveDepartments();
  const profiles = useLiveProfiles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <p className="text-sm text-muted-foreground mt-1">{depts.length} active departments across the organization.</p>
      </div>
      {depts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No departments found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {depts.map((d) => {
            const members = profiles.filter(p => p.department_id === d.id).length;
            return (
              <Panel key={d.id}>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground shadow-elegant"><Building2 className="h-5 w-5" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{members} members</p>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
