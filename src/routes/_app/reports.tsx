import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, FileBarChart, Download } from "lucide-react";
export const Route = createFileRoute("/_app/reports")({ component: Reports });
function Reports() {
  const reports = [
    { name: "Achievement report", desc: "Detailed actual vs planned by goal", icon: FileBarChart },
    { name: "Completion report", desc: "Org-wide completion percentages", icon: FileText },
    { name: "Goal analytics", desc: "Distribution, trends, status mix", icon: FileSpreadsheet },
    { name: "Department analytics", desc: "Heatmaps and QoQ comparisons", icon: FileBarChart },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Export org-wide reports as CSV, Excel or PDF.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <Panel key={r.name}>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-elegant"><r.icon className="h-5 w-5" /></div>
              <div className="flex-1">
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{r.desc}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-3.5 w-3.5" /> CSV</Button>
                  <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Excel</Button>
                  <Button size="sm" className="bg-gradient-primary gap-1.5"><Download className="h-3.5 w-3.5" /> PDF</Button>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
