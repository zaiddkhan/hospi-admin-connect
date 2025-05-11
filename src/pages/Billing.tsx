
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import InvoiceGenerator from "@/components/billing/InvoiceGenerator";
import PaymentTracker from "@/components/billing/PaymentTracker";

const Billing = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage invoices and payments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <InvoiceGenerator />
          <PaymentTracker />
        </div>
      </div>
    </AppLayout>
  );
};

export default Billing;
