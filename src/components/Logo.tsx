import logo from "@/assets/logo-atomberg.png";

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 blur-xl transition-smooth group-hover:opacity-60" />
        <div className="relative h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant transition-smooth group-hover:scale-105">
          <span className="text-primary-foreground font-bold text-lg">G</span>
          <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[oklch(0.85_0.18_85)] ring-2 ring-background" />
        </div>
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold tracking-tight text-foreground">
            AtomQuest <span className="gradient-text">GoalSphere</span>
          </span>
          <span className="text-[10px] text-muted-foreground">by atomberg</span>
        </div>
      )}
    </div>
  );
}

export function BrandLogo({ className = "h-10" }: { className?: string }) {
  return <img src={logo} alt="Atomberg" className={`${className} w-auto object-contain dark:invert dark:brightness-200`} />;
}