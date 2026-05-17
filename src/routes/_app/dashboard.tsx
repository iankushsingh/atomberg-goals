import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { EmployeeDashboard } from "@/pages/EmployeeDashboard";
import { ManagerDashboard } from "@/pages/ManagerDashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "manager") return <ManagerDashboard />;
  if (user.role === "admin") return <AdminDashboard />;
  return <EmployeeDashboard />;
}