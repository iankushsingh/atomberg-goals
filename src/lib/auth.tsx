import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type Role = "employee" | "manager" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  employee_id: string | null;
  title: string | null;
  department_id: string | null;
  departments?: { name: string } | null;
  manager_id: string | null;
  avatar_url: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  title: string;
  department: string;
  employeeId: string;
  profile: Profile | null;
}

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthed: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  isAuthed: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

async function loadUser(u: User): Promise<AuthUser> {
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*, departments(name)").eq("id", u.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", u.id),
  ]);
  const typedProfile = (profile as Profile | null) ?? null;
  const role: Role =
    roles?.some((r) => r.role === "admin") ? "admin"
    : roles?.some((r) => r.role === "manager") ? "manager"
    : "employee";
  return {
    id: u.id,
    email: u.email ?? "",
    name: typedProfile?.full_name || (u.email?.split("@")[0] ?? "User"),
    role,
    title: typedProfile?.title ?? "GoalSphere User",
    department: typedProfile?.departments?.name ?? "Unassigned",
    employeeId: typedProfile?.employee_id ?? "—",
    profile: typedProfile,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const applySession = async (s: Session | null) => {
      if (!mounted) return;
      setSession(s);
      if (s?.user) {
        setLoading(true);
        try {
          const loadedUser = await loadUser(s.user);
          if (mounted) setUser(loadedUser);
        } catch {
          if (mounted) setUser(null);
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    // 1. Subscribe FIRST so we never miss a token refresh / sign-in event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setTimeout(() => void applySession(s), 0);
    });

    // 2. Then hydrate the existing session from storage
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      void applySession(s);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthCtx.Provider value={{ user, session, loading, isAuthed: !!session, signIn, signUp, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
