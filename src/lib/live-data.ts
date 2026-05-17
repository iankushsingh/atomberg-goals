import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Goal = {
  id: string;
  title: string;
  description: string;
  thrust: string;
  uom: string;
  target: number;
  actual: number;
  weightage: number;
  priority: "High" | "Medium" | "Low";
  due: string;
  status: "Draft" | "Submitted" | "Approved" | "Returned" | "Locked";
  achStatus: "On Track" | "At Risk" | "Delayed" | "Completed";
  owner?: string;
  manager_comment?: string | null;
  dbId: string;
};

type GoalRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  weightage: number;
  progress: number;
  status: "draft" | "submitted" | "approved" | "in_progress" | "completed" | "on_hold";
  due_date: string | null;
  manager_comment: string | null;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  employee_id: string | null;
  title: string | null;
  department_id: string | null;
  departments?: { name: string } | null;
};

type AuditRow = {
  id: string;
  action: string;
  entity: string;
  created_at: string;
  meta: Record<string, unknown> | null;
};

const statusMap: Record<GoalRow["status"], Goal["status"]> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  in_progress: "Approved",
  completed: "Locked",
  on_hold: "Returned",
};

function toGoal(row: GoalRow): Goal {
  return {
    id: `G-${row.id.slice(0, 4).toUpperCase()}`,
    dbId: row.id,
    thrust: row.category ?? "Business Impact",
    title: row.title,
    description: row.description ?? "",
    uom: "%",
    target: 100,
    actual: row.progress,
    weightage: row.weightage,
    due: row.due_date ?? "2026-12-31",
    priority: row.weightage >= 20 ? "High" : row.weightage >= 15 ? "Medium" : "Low",
    status: statusMap[row.status] ?? "Draft",
    achStatus:
      row.progress >= 90
        ? "Completed"
        : row.progress >= 55
        ? "On Track"
        : row.progress >= 30
        ? "At Risk"
        : "Delayed",
    owner: "Goal owner",
    manager_comment: row.manager_comment,
  };
}

/**
 * Generate a unique channel name per hook invocation.
 * This prevents the Supabase error:
 *   "cannot add postgres_changes callbacks for <channel> after subscribe()"
 * which occurs when multiple components mount the same hook and share
 * a static channel name.
 */
function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useLiveGoals() {
  const [rows, setRows] = useState<Goal[] | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("goals")
        .select("id,title,description,category,weightage,progress,status,due_date,manager_comment")
        .order("created_at", { ascending: false });
      if (mounted && data) setRows((data as unknown as GoalRow[]).map(toGoal));
    };

    void load();
    const channel = supabase
      .channel(uid("live-goals"))
      .on("postgres_changes", { event: "*", schema: "public", table: "goals" }, () => void load())
      .subscribe();

    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return rows ?? [];
}

export function useLiveProfiles() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id,email,full_name,employee_id,title,department_id,departments(name)")
        .order("full_name");
      if (mounted && data) setProfiles(data as unknown as ProfileRow[]);
    };
    void load();
    const channel = supabase
      .channel(uid("live-profiles"))
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => void load())
      .subscribe();
    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return profiles;
}

export function useLiveDepartments() {
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("departments")
        .select("id, name")
        .order("name");
      if (mounted && data) setDepartments(data);
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return departments;
}

export function useLiveRoles() {
  const [roles, setRoles] = useState<{ user_id: string; role: string }[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase.from("user_roles").select("user_id, role");
      if (mounted && data) setRoles(data);
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return roles;
}

export function useLiveCycles() {
  const [cycles, setCycles] = useState<
    { id: string; name: string; start_date: string; end_date: string; is_active: boolean }[]
  >([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("cycles")
        .select("*")
        .order("start_date", { ascending: false });
      if (mounted && data) setCycles(data);
    };
    void load();
    const channel = supabase
      .channel(uid("live-cycles"))
      .on("postgres_changes", { event: "*", schema: "public", table: "cycles" }, () => void load())
      .subscribe();
    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return cycles;
}

export function useLiveAuditLogs() {
  const [logs, setLogs] = useState<AuditRow[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("id,action,entity,created_at,meta")
        .order("created_at", { ascending: false })
        .limit(8);
      if (mounted && data) setLogs(data as AuditRow[]);
    };
    void load();
    const channel = supabase
      .channel(uid("live-audit"))
      .on("postgres_changes", { event: "*", schema: "public", table: "audit_logs" }, () => void load())
      .subscribe();
    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return logs;
}

export function useGoalMetrics(goals: Goal[]) {
  return useMemo(() => {
    const total = goals.reduce((sum, g) => sum + g.weightage, 0);
    const achieved = goals.reduce(
      (sum, g) => sum + (g.actual / Math.max(1, g.target)) * g.weightage,
      0
    );
    const completion = total > 0 ? Math.round((achieved / total) * 100) : 0;
    return {
      completion,
      approved: goals.filter((g) => g.status === "Approved" || g.status === "Locked").length,
      pending: goals.filter((g) => g.status === "Submitted" || g.status === "Draft").length,
      delayed: goals.filter((g) => g.achStatus === "Delayed" || g.achStatus === "At Risk").length,
    };
  }, [goals]);
}