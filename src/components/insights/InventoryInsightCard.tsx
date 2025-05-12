import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PackageCheck, PackageX } from "lucide-react";

interface InventoryInsightCardProps {
  itemName: string;
  currentStock: number;
  threshold: number;
}

const InventoryInsightCard: React.FC<InventoryInsightCardProps> = ({
  itemName,
  currentStock,
  threshold,
}) => {
  const isLowStock = currentStock <= threshold;
  const stockPercentage = Math.min((currentStock / threshold) * 100, 100); // Ensure it doesn't exceed 100%

  return (
    <Card>
      <CardHeader>
        <CardTitle>{itemName}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLowStock ? (
          <Alert variant="destructive">
            <PackageX className="h-4 w-4" />
            <AlertTitle>Low Stock</AlertTitle>
            <AlertDescription>
              Only {currentStock} left. Reorder soon!
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <PackageCheck className="h-4 w-4" />
            <AlertTitle>Sufficient Stock</AlertTitle>
            <AlertDescription>
              {currentStock} items in stock.
            </AlertDescription>
          </Alert>
        )}
        <div className="mt-4">
          <p className="text-sm font-medium">Stock Level:</p>
          <div className="flex items-center space-x-2">
            <Progress value={stockPercentage} className="h-2" />
            <span className="text-xs text-muted-foreground">{stockPercentage.toFixed(0)}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Threshold: {threshold}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryInsightCard;
