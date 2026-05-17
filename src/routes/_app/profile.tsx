import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (!fullName.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", user.id);
      
      if (error) throw error;
      toast.success("Profile updated successfully");
      setTimeout(() => window.location.reload(), 1500); // Wait for toast before reloading
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account information.</p>
      </div>
      <Panel>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              {user.name.split(" ").map(p=>p[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.title} · {user.department}</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{user.employeeId}</p>
          </div>
        </div>
      </Panel>
      <Panel title="Personal details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Employee ID</Label>
            <Input defaultValue={user.employeeId} disabled />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input defaultValue={user.department} disabled />
          </div>
        </div>
        <Button 
          className="mt-4 bg-gradient-primary shadow-elegant" 
          onClick={handleSave} 
          disabled={loading || !fullName.trim()}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Save changes
        </Button>
      </Panel>
    </div>
  );
}
