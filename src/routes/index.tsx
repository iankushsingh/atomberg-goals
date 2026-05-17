import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, BarChart3, Sparkles, Target, ShieldCheck, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthed, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && isAuthed) nav({ to: "/dashboard", replace: true });
  }, [isAuthed, loading, nav]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-primary opacity-10 blur-3xl pointer-events-none" />

      <header className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/signup"><Button size="sm" className="bg-gradient-primary shadow-elegant">Get started</Button></Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-24">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-ready performance OS for modern enterprises
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Align goals.{" "}
            <span className="gradient-text">Track progress.</span>
            <br />Drive performance.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            AtomQuest GoalSphere is the enterprise-grade goal setting and performance tracking
            portal that connects employees, managers, and HR with one shared source of truth.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-primary shadow-glow gap-2 h-12 px-6">
                Start free trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-6">Sign in to portal</Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-5">
          {[
            { icon: Target, title: "Smart Goal Sheets", desc: "Auto-weighted goals with real-time validation and shared KPIs across teams." },
            { icon: BarChart3, title: "Quarterly Insights", desc: "Planned vs actual tracking with heatmaps, trends, and QoQ analytics." },
            { icon: ShieldCheck, title: "Approval Workflows", desc: "Manager approvals, rule-based escalations, and tamper-proof audit logs." },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 shadow-elegant transition-smooth hover:shadow-lift hover:-translate-y-1">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-elegant">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 flex-wrap text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Microsoft Teams</span>
          <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Entra ID SSO</span>
          <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Slack</span>
          <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Email Automation</span>
        </div>
      </main>
    </div>
  );
}
