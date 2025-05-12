// src/components/insights/InventoryInsightCard.tsx
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package2, Clipboard, ChevronRight, TrendingUp, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  suggestedStock: number;
  unitPrice: number;
  threshold?: number;
  stockPercentage?: number;
}

interface InventoryInsightProps {
  data: {
    itemsToRestock: InventoryItem[];
    totalCost: number;
    suggestedDate: string;
    savingsPercentage: number;
    urgencyLevel?: 'high' | 'medium' | 'low';
    bulkDiscount?: number;
    supplier?: string;
  };
  onApply: () => void;
}

export const InventoryInsightCard: React.FC<InventoryInsightProps> = ({
  data,
  onApply
}) => {
  const navigate = useNavigate();
  const formattedDate = format(new Date(data.suggestedDate), "MMMM d, yyyy");

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}`;
  };

  // Get urgency badge
  const getUrgencyBadge = () => {
    switch (data.urgencyLevel) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High Urgency</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Medium Urgency</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low Urgency</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5 text-green-600" />
          Inventory Bulk Purchase Recommendation
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Suggested order by: {formattedDate}
          </p>
          {getUrgencyBadge()}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Recommended Purchase Order</h3>
          <p className="text-sm text-muted-foreground">
            Based on usage patterns and upcoming appointments, we recommend placing a bulk order for the following items:
          </p>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Item</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Current</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Order</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Unit Price</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.itemsToRestock.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm border-t">
                    <div className="font-medium">{item.name}</div>
                    {item.threshold && (
                      <div className="mt-1">
                        <Progress 
                          value={item.stockPercentage || (item.currentStock / item.threshold) * 100}
                          className="h-1.5"
                          indicatorClassName={
                            item.currentStock < item.threshold * 0.25 ? "bg-red-500" : 
                            item.currentStock < item.threshold ? "bg-orange-500" : 
                            "bg-green-500"
                          }
                        />
                        <div className="flex justify-between text-xs mt-0.5 text-muted-foreground">
                          <span>{item.currentStock} in stock</span>
                          <span>Min: {item.threshold}</span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right border-t">
                    {item.currentStock < item.threshold ? (
                      <div className="flex items-center justify-end">
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-500 mr-1" />
                        {item.currentStock}
                      </div>
                    ) : (
                      item.currentStock
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right border-t">
                    {item.suggestedStock}
                  </td>
                  <td className="px-4 py-3 text-sm text-right border-t">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium border-t">
                    {formatCurrency(item.suggestedStock * item.unitPrice)}
                  </td>
                </tr>
              ))}
              <tr className="bg-green-50">
                <td colSpan={4} className="px-4 py-3 text-sm font-bold text-right border-t">
                  Total
                </td>
                <td className="px-4 py-3 text-sm font-bold text-right border-t">
                  {formatCurrency(data.totalCost)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-100 rounded-md">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">Potential Savings</h4>
            </div>
            <p className="text-sm mt-2 text-green-700">
              Placing this bulk order can save approximately <span className="font-bold">{data.savingsPercentage}%</span> compared to individual purchases.
              {data.bulkDiscount && (
                <> This is based on a bulk discount of {data.bulkDiscount}% from {data.supplier || 'the supplier'}.</>
              )}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
            <div className="flex items-center">
              <Clipboard className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-800">Implementation</h4>
            </div>
            <p className="text-sm mt-2 text-blue-700">
              Approving this insight will create a purchase order with the recommended quantities. 
              You'll be able to review and adjust the order before finalizing it.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
        <Button 
          variant="outline" 
          onClick={() => navigate("/inventory")}
        >
          View Inventory
        </Button>
        <Button onClick={onApply} className="bg-green-600 hover:bg-green-700">
          <Clipboard className="h-4 w-4 mr-2" /> Generate Purchase Order
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InventoryInsightCard;