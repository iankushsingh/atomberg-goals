import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const nav = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords don't match"); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.name);
      toast.success("Account created — signing you in");
      nav({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <div className="flex justify-between items-center p-6 max-w-5xl mx-auto w-full">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md glass rounded-2xl p-8 shadow-lift animate-slide-up">
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Start tracking goals in minutes.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Jane Doe" required />
            </div>
            <div className="space-y-2">
              <Label>Work email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@company.com" required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input type={show ? "text" : "password"} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required minLength={8} />
                <button type="button" onClick={() => setShow((x) => !x)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm password</Label>
              <Input type={show ? "text" : "password"} value={form.confirm} onChange={(e) => setForm({...form, confirm: e.target.value})} required />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary shadow-elegant">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
