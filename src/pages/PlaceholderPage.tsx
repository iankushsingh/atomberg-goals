import { Panel } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

export function PlaceholderPage({
  title, subtitle, icon: Icon = Sparkles, ctaLabel = "Get notified",
}: { title: string; subtitle: string; icon?: LucideIcon; ctaLabel?: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <Panel>
        <div className="py-16 flex flex-col items-center text-center max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-2xl opacity-30 rounded-full" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-elegant">
              <Icon className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h3 className="mt-6 text-lg font-semibold">{title} is taking shape</h3>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle} We're polishing this surface to feel as premium as the rest of GoalSphere.</p>
          <div className="mt-6 flex gap-2">
            <Button variant="outline">Learn more</Button>
            <Button className="bg-gradient-primary shadow-elegant">{ctaLabel}</Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}