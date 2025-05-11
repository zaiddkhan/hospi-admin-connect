
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import InventoryTable from "@/components/inventory/InventoryTable";

const Inventory = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage inventory</p>
        </div>

        <InventoryTable />
      </div>
    </AppLayout>
  );
};

export default Inventory;
