import { createFileRoute } from "@tanstack/react-router";
import { ManagerDashboard } from "@/pages/ManagerDashboard";
export const Route = createFileRoute("/_app/team")({ component: ManagerDashboard });
