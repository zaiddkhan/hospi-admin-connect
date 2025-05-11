
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

// Mock data for inventory alerts
const inventoryAlerts = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    stock: 10,
    threshold: 20,
    percentage: 50,
    status: "low",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    stock: 5,
    threshold: 15,
    percentage: 33,
    status: "critical",
  },
  {
    id: 3,
    name: "Disposable Masks",
    stock: 25,
    threshold: 50,
    percentage: 50,
    status: "low",
  },
];

const InventoryAlerts = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <CardTitle className="text-lg">Inventory Alerts</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-3">
          {inventoryAlerts.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{item.name}</p>
                <Badge
                  variant="outline"
                  className={
                    item.status === "critical"
                      ? "border-error-500 text-error-500 text-xs"
                      : "border-warning-500 text-warning-500 text-xs"
                  }
                >
                  {item.status === "critical" ? "Critical" : "Low Stock"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={item.percentage} className="h-2" />
                <span className="text-xs text-muted-foreground w-16">
                  {item.stock}/{item.threshold}
                </span>
              </div>
            </div>
          ))}
          <Button size="sm" className="w-full mt-2">
            Reorder Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;
