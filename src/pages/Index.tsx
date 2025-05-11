
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Calendar, Users, CreditCard, Clock } from "lucide-react";
import AppointmentsOverview from "@/components/dashboard/AppointmentsOverview";
import RevenueChart from "@/components/dashboard/RevenueChart";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Rajeev!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            title="Today's Appointments"
            value="12"
            icon={<Calendar className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Total Patients"
            value="1,258"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Today's Revenue"
            value="₹12,500"
            icon={<CreditCard className="h-4 w-4" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Avg. Wait Time"
            value="12 min"
            icon={<Clock className="h-4 w-4" />}
            trend={{ value: 2, isPositive: false }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <AppointmentsOverview />
          <RevenueChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <UpcomingAppointments />
          <InventoryAlerts />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
