import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ChartCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLiveProfiles, useLiveDepartments, useLiveRoles } from "@/lib/live-data";
import { useAuth } from "@/lib/auth";
import { Search, UserPlus, Upload, Download } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/users")({ component: UsersPage });

function UsersPage() {
  const { user } = useAuth();
  const profiles = useLiveProfiles();
  const departments = useLiveDepartments();
  const allRoles = useLiveRoles();
  const [q, setQ] = useState("");
  
  const filtered = profiles.filter((u) => 
    u.full_name.toLowerCase().includes(q.toLowerCase()) || 
    u.email.toLowerCase().includes(q.toLowerCase())
  );

  const isAdmin = user?.role === "admin";

  const handleDepartmentChange = async (userId: string, newDeptId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ department_id: newDeptId === "unassigned" ? null : newDeptId })
        .eq("id", userId);
        
      if (error) throw error;
      toast.success("Department updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update department");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: newRole as "employee" | "manager" | "admin" }, { onConflict: "user_id, role" });
        
      if (error) throw error;
      toast.success("Role updated");
      // Since it's a new row potentially or update, maybe we'd need to refresh local state if useLiveRoles doesn't subscribe
      // A full page reload ensures useLiveRoles refetches, but simple toast is fine for now
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update role");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage org members, roles and departments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5"><Upload className="h-4 w-4" /> Bulk upload</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" className="bg-gradient-primary gap-1.5"><UserPlus className="h-4 w-4" /> Add user</Button>
        </div>
      </div>
      <Panel>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} users</span>
        </div>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-left font-medium py-3">User</th>
              <th className="text-left font-medium">Employee ID</th>
              <th className="text-left font-medium">Department</th>
              <th className="text-left font-medium">Role</th>
              <th className="text-left font-medium">Status</th>
            </tr></thead>
            <tbody>
              {filtered.map((u) => {
                const userRole = allRoles.find(r => r.user_id === u.id)?.role || "employee";
                return (
                <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-accent/30 transition-smooth">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                          {u.full_name.split(" ").map(p=>p[0]).join("").slice(0,2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-tight">{u.full_name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-muted-foreground">{u.employee_id || "—"}</td>
                  <td>
                    {isAdmin ? (
                      <Select 
                        value={u.department_id || "unassigned"} 
                        onValueChange={(val) => handleDepartmentChange(u.id, val)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned" className="text-xs text-muted-foreground">Unassigned</SelectItem>
                          {departments.map(d => (
                            <SelectItem key={d.id} value={d.id} className="text-xs">{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm">{u.departments?.name || "Unassigned"}</span>
                    )}
                  </td>
                  <td>
                    {isAdmin ? (
                      <Select 
                        value={userRole} 
                        onValueChange={(val) => handleRoleChange(u.id, val)}
                      >
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee" className="text-xs">Employee</SelectItem>
                          <SelectItem value="manager" className="text-xs">Manager</SelectItem>
                          <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm capitalize">{userRole}</span>
                    )}
                  </td>
                  <td><StatusBadge status="Active" /></td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
