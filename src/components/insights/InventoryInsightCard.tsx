// src/components/insights/InventoryInsightCard.tsx
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package2, Clipboard, ShoppingCart, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  suggestedStock: number;
  unitPrice: number;
  threshold: number;
  stockPercentage?: number;
  category?: string;
}

interface InventoryInsightProps {
  data: {
    itemsToRestock: InventoryItem[];
    totalCost: number;
    suggestedDate: string;
    savingsPercentage: number;
    urgencyLevel?: string;
    bulkDiscount?: number;
    supplier?: string;
  };
  onApply: () => void;
}

const InventoryInsightCard: React.FC<InventoryInsightProps> = ({ data, onApply }) => {
  const navigate = useNavigate();
  
  // Format currency (Indian Rupees)
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Format percentage for stock level
  const formatStockPercentage = (item: InventoryItem) => {
    if (item.stockPercentage !== undefined) return item.stockPercentage;
    return item.threshold > 0 
      ? Math.round((item.currentStock / item.threshold) * 100) 
      : 0;
  };

  // Get stock level className based on percentage
  const getStockLevelClass = (percentage: number) => {
    if (percentage <= 25) return "bg-error-500";
    if (percentage <= 75) return "bg-warning-500";
    return "bg-success-500";
  };

  // Ensure we have valid data to display
  if (!data || !data.itemsToRestock || !Array.isArray(data.itemsToRestock)) {
    return (
      <div className="p-4 bg-muted rounded-md">
        <p className="text-muted-foreground">Inventory data is not available or is incomplete.</p>
      </div>
    );
  }

  return (
    <Card className="border-green-200">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5 text-green-600" />
          Bulk Inventory Purchase Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Recommended Inventory Restock</h3>
          <p className="text-sm text-muted-foreground">
            Based on usage patterns and upcoming appointments, we recommend placing a bulk order
            by {formatDate(data.suggestedDate)} for the following items:
          </p>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left text-sm">Item</th>
                <th className="px-4 py-2 text-center text-sm">Stock Level</th>
                <th className="px-4 py-2 text-right text-sm">Current</th>
                <th className="px-4 py-2 text-right text-sm">Order Qty</th>
                <th className="px-4 py-2 text-right text-sm">Unit Price</th>
                <th className="px-4 py-2 text-right text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.itemsToRestock.map((item, index) => {
                const stockPercentage = formatStockPercentage(item);
                const orderQuantity = item.suggestedStock - item.currentStock;
                const totalPrice = orderQuantity * item.unitPrice;
                
                return (
                  <tr key={item.id || index} className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {item.name}
                      {item.category && <span className="text-xs text-muted-foreground ml-1">({item.category})</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <div className="w-full max-w-[100px]">
                          <Progress 
                            value={stockPercentage} 
                            className={`h-2 ${getStockLevelClass(stockPercentage)}`} 
                          />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs">{stockPercentage}%</span>
                            <span className="text-xs">{item.currentStock}/{item.threshold}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">{item.currentStock}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{orderQuantity}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(totalPrice)}</td>
                  </tr>
                );
              })}
              <tr className="bg-green-50 border-t">
                <td colSpan={5} className="px-4 py-3 text-sm font-bold text-right">
                  Subtotal:
                </td>
                <td className="px-4 py-3 text-sm font-bold text-right">
                  {formatCurrency(data.totalCost)}
                </td>
              </tr>
              {data.bulkDiscount && (
                <>
                  <tr className="bg-green-50">
                    <td colSpan={5} className="px-4 py-3 text-sm text-right">
                      Bulk Discount ({data.bulkDiscount}%):
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-success-700">
                      -{formatCurrency((data.totalCost * data.bulkDiscount) / 100)}
                    </td>
                  </tr>
                  <tr className="bg-green-50 border-t">
                    <td colSpan={5} className="px-4 py-3 text-sm font-bold text-right">
                      Total After Discount:
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-right">
                      {formatCurrency(data.totalCost - (data.totalCost * data.bulkDiscount) / 100)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supplier Info */}
          {data.supplier && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-800">Recommended Supplier</h4>
              </div>
              <p className="text-sm mt-2 text-blue-700">
                {data.supplier}
              </p>
              <p className="text-xs mt-1 text-blue-600">
                Ordering by {formatDate(data.suggestedDate)} is recommended for timely delivery.
              </p>
            </div>
          )}

          {/* Savings Info */}
          <div className="p-4 bg-green-50 border border-green-100 rounded-md">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">Potential Savings</h4>
            </div>
            <p className="text-sm mt-2 text-green-700">
              Placing this bulk order can save approximately {data.savingsPercentage}% compared to
              individual purchases, resulting in savings of about 
              {data.bulkDiscount 
                ? ` ${formatCurrency((data.totalCost * data.bulkDiscount) / 100)}`
                : ` ${formatCurrency((data.totalCost * data.savingsPercentage) / 100)}`}.
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