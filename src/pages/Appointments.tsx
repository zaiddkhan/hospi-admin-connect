
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import AppointmentScheduler from "@/components/appointments/AppointmentScheduler";

const Appointments = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="text-muted-foreground">Manage your schedule and appointments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AppointmentCalendar />
          <AppointmentScheduler />
        </div>
      </div>
    </AppLayout>
  );
};

export default Appointments;
