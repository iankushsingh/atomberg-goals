import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Target, CalendarCheck2, Users2, Bell, Settings, User,
  Share2, ShieldCheck, ClipboardList, BarChart3, Building2, Workflow,
  ScrollText, AlertTriangle, Menu, Search, LogOut, ChevronDown, Sparkles,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { useLiveAuditLogs } from "@/lib/live-data";
import type { Role } from "@/lib/auth";

type Item = { to: string; label: string; icon: ReactNode };

const NAV: Record<Role, Item[]> = {
  employee: [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { to: "/goals", label: "My Goals", icon: <Target className="h-4 w-4" /> },
    { to: "/check-ins", label: "Quarterly Updates", icon: <CalendarCheck2 className="h-4 w-4" /> },
    { to: "/shared", label: "Shared Goals", icon: <Share2 className="h-4 w-4" /> },
    { to: "/notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { to: "/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { to: "/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ],
  manager: [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { to: "/team", label: "Team Goals", icon: <Users2 className="h-4 w-4" /> },
    { to: "/approvals", label: "Goal Approvals", icon: <ShieldCheck className="h-4 w-4" /> },
    { to: "/check-ins", label: "Check-ins", icon: <CalendarCheck2 className="h-4 w-4" /> },
    { to: "/analytics", label: "Team Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { to: "/notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { to: "/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { to: "/users", label: "Users", icon: <Users2 className="h-4 w-4" /> },
    { to: "/departments", label: "Departments", icon: <Building2 className="h-4 w-4" /> },
    { to: "/cycles", label: "Goal Cycles", icon: <Workflow className="h-4 w-4" /> },
    { to: "/analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { to: "/audit", label: "Audit Logs", icon: <ScrollText className="h-4 w-4" /> },
    { to: "/escalations", label: "Escalations", icon: <AlertTriangle className="h-4 w-4" /> },
    { to: "/reports", label: "Reports", icon: <ClipboardList className="h-4 w-4" /> },
    { to: "/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ],
};

export function AppLayout() {
  const { user, isAuthed, signOut, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const logs = useLiveAuditLogs();
  const unread = logs.length;

  useEffect(() => {
    if (!loading && (!isAuthed || !user)) {
      nav({ to: "/login", replace: true });
    }
  }, [isAuthed, loading, nav, user]);

  if (loading) return null;
  if (!isAuthed || !user) {
    return null;
  }

  const items = NAV[user.role];

  return (
    <div className="min-h-screen bg-gradient-subtle text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar transition-smooth",
          collapsed ? "w-[72px]" : "w-[248px]",
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Logo collapsed={collapsed} />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {items.map((it) => {
            const active = loc.pathname === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-smooth relative",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-gradient-primary" />
                )}
                <span className={cn("transition-smooth", active && "text-primary")}>{it.icon}</span>
                {!collapsed && <span className="truncate">{it.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          {!collapsed ? (
            <div className="rounded-xl p-3 bg-gradient-primary text-primary-foreground relative overflow-hidden">
              <Sparkles className="h-4 w-4 mb-1.5" />
              <p className="text-xs font-semibold">AI Coach</p>
              <p className="text-[11px] opacity-90 leading-tight mt-0.5">Smart nudges for your goals</p>
            </div>
          ) : (
            <div className="h-9 w-9 mx-auto rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed((c) => !c)}
            className="w-full mt-3 justify-center text-xs text-muted-foreground"
          >
            {collapsed ? "→" : "← Collapse"}
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border animate-slide-up flex flex-col">
            <div className="h-16 flex items-center px-4 border-b border-sidebar-border"><Logo /></div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              {items.map((it) => (
                <Link key={it.to} to={it.to} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent">
                  {it.icon}<span>{it.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className={cn("transition-smooth", "lg:pl-[248px]", collapsed && "lg:pl-[72px]")}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="h-full px-4 lg:px-8 flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search goals, employees, departments…"
                className="pl-9 bg-secondary/60 border-transparent focus-visible:bg-background"
              />
              <kbd className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">⌘K</kbd>
            </div>
            <ThemeToggle />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Bell className="h-4.5 w-4.5" />
                  {unread > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gradient-primary ring-2 ring-background" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <p className="text-sm font-semibold">Notifications</p>
                  <span className="text-xs text-muted-foreground">{unread} new</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-4 text-center">No notifications.</p>
                  ) : (
                    logs.map((n) => (
                      <div key={n.id} className={cn("px-4 py-3 border-b border-border/60 last:border-0 hover:bg-accent/50 transition-smooth cursor-pointer", "bg-accent/30")}>
                        <p className="text-sm font-medium leading-tight capitalize">{n.action.replace("_", " ")}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-accent transition-smooth">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                      {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-xs font-semibold">{user.name}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{user.role}</span>
                  </div>
                  <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await signOut(); nav({ to: "/login" }); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="px-4 lg:px-8 py-6 lg:py-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}