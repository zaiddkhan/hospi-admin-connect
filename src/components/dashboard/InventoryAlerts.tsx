import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface InventoryAlertsProps {
  inventoryAlerts: {
    id: number;
    name: string;
    stock: number;
    threshold: number;
    percentage: number;
    status: string;
  }[];
}

const InventoryAlerts = ({ inventoryAlerts }: InventoryAlertsProps) => {
  const navigate = useNavigate();

  // Handle reorder action
  const handleReorder = () => {
    try {
      // This would typically update the inventory status or create purchase orders
      toast.success("Reorder initiated for low stock items");
      
      // Navigate to inventory page
      navigate("/inventory");
    } catch (error) {
      toast.error("Failed to initiate reorder");
    }
  };

  // Handle view all action
  const handleViewAll = () => {
    navigate("/inventory");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <CardTitle className="text-lg">Inventory Alerts</CardTitle>
        <Button variant="outline" size="sm" onClick={handleViewAll}>
          View All
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-3">
          {inventoryAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No inventory alerts at this time
            </p>
          ) : (
            inventoryAlerts.map((item) => (
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
                  <Progress 
                    value={item.percentage} 
                    className={`h-2 ${
                      item.status === "critical" 
                        ? "bg-error-500" 
                        : "bg-warning-500"
                    }`} 
                  />
                  <span className="text-xs text-muted-foreground w-16">
                    {item.stock}/{item.threshold}
                  </span>
                </div>
              </div>
            ))
          )}
          {inventoryAlerts.length > 0 && (
            <Button size="sm" className="w-full mt-2" onClick={handleReorder}>
              Reorder Items
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;