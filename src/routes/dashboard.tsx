import { createFileRoute, redirect } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { getSessionFn } from "@/utils/auth.functions";
import { getDashboardDataFn } from "@/components/dashboard/dashboard.functions";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    try {
      const session = await getSessionFn();
      if (!session?.user || session.user.emailVerified !== true) {
        throw redirect({
          to: "/auth/login",
          search: { error: "Please log in to continue." },
        });
      }
      return { session };
    } catch (_error) {
      throw redirect({
        to: "/auth/login",
        search: { error: "Please log in to continue." },
      });
    }
  },
  loader: async () => {
    return await getDashboardDataFn();
  },
  pendingComponent: DashboardSkeleton,
  component: Dashboard,
});
