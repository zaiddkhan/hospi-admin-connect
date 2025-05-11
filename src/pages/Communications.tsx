
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import WhatsappInterface from "@/components/communications/WhatsappInterface";
import ReminderSettings from "@/components/communications/ReminderSettings";

const Communications = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Communications</h1>
          <p className="text-muted-foreground">Manage patient communications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <WhatsappInterface />
          <ReminderSettings />
        </div>
      </div>
    </AppLayout>
  );
};

export default Communications;
