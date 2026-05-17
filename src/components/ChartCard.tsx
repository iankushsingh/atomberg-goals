import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title, subtitle, action, children, className,
}: { title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-elegant overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div>
            {title && <h3 className="font-semibold tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}