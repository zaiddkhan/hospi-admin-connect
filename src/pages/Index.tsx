import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Calendar, Users, CreditCard, Clock } from "lucide-react";
import AppointmentsOverview from "@/components/dashboard/AppointmentsOverview";
import RevenueChart from "@/components/dashboard/RevenueChart";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
import { useDashboardStats } from "@/hooks/useDashboard";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: dashboardStats, isLoading, error } = useDashboardStats();

  // Show error if there's a problem fetching data
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load dashboard data");
    }
  }, [error]);

  return (
    <AppLayout>
      <div className="space-y-3">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Rajeev!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {isLoading ? (
            // Show skeleton loading state
            <>
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
            </>
          ) : (
            // Show actual data
            <>
              <StatCard
                title="Today's Appointments"
                value={dashboardStats?.todayAppointments.count.toString() || "0"}
                icon={<Calendar className="h-4 w-4" />}
                trend={dashboardStats?.todayAppointments.trend}
              />
              <StatCard
                title="Total Patients"
                value={dashboardStats?.totalPatients.count.toLocaleString() || "0"}
                icon={<Users className="h-4 w-4" />}
                trend={dashboardStats?.totalPatients.trend}
              />
              <StatCard
                title="Today's Revenue"
                value={`₹${dashboardStats?.todayRevenue.amount.toLocaleString() || "0"}`}
                icon={<CreditCard className="h-4 w-4" />}
                trend={dashboardStats?.todayRevenue.trend}
              />
              <StatCard
                title="Avg. Wait Time"
                value={`${dashboardStats?.avgWaitTime.minutes || "0"} min`}
                icon={<Clock className="h-4 w-4" />}
                trend={dashboardStats?.avgWaitTime.trend}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <AppointmentsOverview />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <RevenueChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <UpcomingAppointments />
          {isLoading ? (
            <Skeleton className="h-64 rounded-md" />
          ) : (
            <InventoryAlerts inventoryAlerts={dashboardStats?.inventoryAlerts || []} />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;