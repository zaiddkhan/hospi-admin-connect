// src/components/insights/InsightCards.tsx
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart4, Calendar, Clipboard, Package2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SchedulingInsightProps {
  data: {
    date: string;
    doctorName: string;
    currentSchedule: Array<{ time: string; count: number }>;
    suggestedSchedule: Array<{ time: string; count: number }>;
    benefitText: string;
  };
  onApply: () => void;
}

export const SchedulingInsightCard: React.FC<SchedulingInsightProps> = ({ data, onApply }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Schedule Optimization for {data.doctorName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Our AI has analyzed appointment patterns and recommends the following schedule 
           adjustments for {data.date}:</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="font-medium">Current Schedule</p>
            <div className="space-y-1">
              {data.currentSchedule.map((slot, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{slot.time}</span>
                  <span>{slot.count} appointments</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Suggested Schedule</p>
            <div className="space-y-1">
              {data.suggestedSchedule.map((slot, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{slot.time}</span>
                  <span>{slot.count} appointments</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-muted rounded-md">
          <p className="font-medium">Potential Benefits:</p>
          <p className="text-sm">{data.benefitText}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/appointments")}>
          View Appointments
        </Button>
        <Button onClick={onApply}>
          <RefreshCw className="h-4 w-4 mr-2" /> Apply New Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

interface InventoryInsightProps {
  data: {
    itemsToRestock: Array<{ 
      id: string;
      name: string; 
      currentStock: number;
      suggestedStock: number;
      unitPrice: number;
    }>;
    totalCost: number;
    suggestedDate: string;
    savingsPercentage: number;
  };
  onApply: () => void;
}

export const InventoryInsightCard: React.FC<InventoryInsightProps> = ({ data, onApply }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5 text-primary" />
          Bulk Purchase Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Based on usage patterns and upcoming appointments, we recommend placing a bulk order 
           by {data.suggestedDate} for these items:</p>
        
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left text-sm">Item</th>
                <th className="px-4 py-2 text-right text-sm">Current Stock</th>
                <th className="px-4 py-2 text-right text-sm">Suggested Order</th>
                <th className="px-4 py-2 text-right text-sm">Unit Price</th>
                <th className="px-4 py-2 text-right text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.itemsToRestock.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2 text-sm">{item.name}</td>
                  <td className="px-4 py-2 text-sm text-right">{item.currentStock}</td>
                  <td className="px-4 py-2 text-sm text-right">{item.suggestedStock}</td>
                  <td className="px-4 py-2 text-sm text-right">₹{item.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">
                    ₹{(item.suggestedStock * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="border-t bg-muted/50">
                <td colSpan={4} className="px-4 py-2 text-sm font-medium text-right">
                  Total
                </td>
                <td className="px-4 py-2 text-sm font-bold text-right">
                  ₹{data.totalCost.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="p-3 bg-muted rounded-md">
          <p className="font-medium">Potential Savings:</p>
          <p className="text-sm">
            Placing this bulk order can save approximately {data.savingsPercentage}% compared to
            individual purchases.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/inventory")}>
          View Inventory
        </Button>
        <Button onClick={onApply}>
          <Clipboard className="h-4 w-4 mr-2" /> Generate Purchase Order
        </Button>
      </CardFooter>
    </Card>
  );
};

interface RevenueInsightProps {
  data: {
    insights: Array<{ 
      title: string;
      description: string;
      value: number;
      change: number;
    }>;
    recommendations: string[];
  };
  onApply: () => void;
}

export const RevenueInsightCard: React.FC<RevenueInsightProps> = ({ data, onApply }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart4 className="h-5 w-5 text-primary" />
          Revenue Optimization Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Our AI has analyzed your billing and appointment data to identify revenue 
           optimization opportunities:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.insights.map((insight, idx) => (
            <Card key={idx} className="border">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium">{insight.title}</h3>
                <p className="text-2xl font-bold mt-1">
                  ₹{insight.value.toLocaleString()}
                  <span className={`text-sm ml-2 ${insight.change > 0 ? 'text-success-700' : 'text-error-500'}`}>
                    {insight.change > 0 ? '↑' : '↓'} {Math.abs(insight.change)}%
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="p-3 bg-muted rounded-md">
          <p className="font-medium">Recommendations:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            {data.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm">{rec}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/billing")}>
          View Billing
        </Button>
        <Button onClick={onApply}>
          Apply Recommendations
        </Button>
      </CardFooter>
    </Card>
  );
};