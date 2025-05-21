import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import DemoBanner from "@/components/dashboard/DemoBanner";
import { Calendar, Users, CreditCard, Clock, FileText, Newspaper } from "lucide-react";
import AppointmentsOverview from "@/components/dashboard/AppointmentsOverview";
import RevenueChart from "@/components/dashboard/RevenueChart";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
import { useDashboardStats } from "@/hooks/useDashboard";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { data: dashboardStats, isLoading, error } = useDashboardStats();

  // Show error if there's a problem fetching data
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load dashboard data");
    }
  }, [error]);

  const handleStartConsultation = () => {
    window.open("https://hospiscribe.minusonetoten.com/consultation/new", "_blank");
  };

  const handleMedicalResearch = () => {
    window.open("https://medsearch.minusonetoten.com/", "_blank");
  };

  return (
    <AppLayout>
      <div className="space-y-3">

        <DemoBanner />
        <br />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Dr. Rajeev!</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleMedicalResearch} className="flex items-center gap-2" variant="outline">
              <Newspaper className="h-4 w-4" />
              <span>Research Hub</span>
            </Button>
            <Button onClick={handleStartConsultation} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Start New Consultation</span>
            </Button>
          </div>
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
                title="Today's CSAT"
                // value={`₹${dashboardStats?.todayRevenue.amount.toLocaleString() || "0"}`}
                value = {"97%"}
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
