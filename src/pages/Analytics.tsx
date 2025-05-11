
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import RevenueMetrics from "@/components/analytics/RevenueMetrics";
import PatientAnalytics from "@/components/analytics/PatientAnalytics";

const Analytics = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="text-muted-foreground">Business intelligence and insights</p>
        </div>

        <div className="space-y-6">
          <RevenueMetrics />
          <PatientAnalytics />
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
