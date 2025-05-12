// src/components/insights/RevenueInsightCard.tsx
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart4, TrendingUp, TrendingDown, ArrowRight, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface RevenueMetric {
  title: string;
  description: string;
  value: number;
  change: number;
  changeText?: string;
}

interface PriceChange {
  serviceName: string;
  currentPrice: number;
  suggestedPrice: number;
  potentialRevenue: number;
}

interface RevenueInsightProps {
  data: {
    insights: RevenueMetric[];
    recommendations: string[];
    priceChanges?: PriceChange[];
    billingCampaign?: {
      name: string;
      targetPatients: number;
      expectedRevenue: number;
      description: string;
    };
    implementationPlan?: string[];
  };
  onApply: () => void;
}

export const RevenueInsightCard: React.FC<RevenueInsightProps> = ({
  data,
  onApply
}) => {
  const navigate = useNavigate();

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}`;
  };

  return (
    <Card className="border-purple-200">
      <CardHeader className="bg-purple-50">
        <CardTitle className="flex items-center gap-2">
          <BarChart4 className="h-5 w-5 text-purple-600" />
          Revenue Optimization Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Revenue Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Our AI has analyzed your billing and appointment data to identify revenue optimization opportunities.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.insights.map((insight, index) => (
            <Card key={index} className="border shadow-sm">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium">{insight.title}</h4>
                <div className="flex items-baseline mt-1 gap-2">
                  <span className="text-2xl font-bold">
                    {formatCurrency(insight.value)}
                  </span>
                  <Badge 
                    variant="outline"
                    className={
                      insight.change > 0 
                        ? "bg-green-50 text-green-800 border-green-200" 
                        : "bg-red-50 text-red-800 border-red-200"
                    }
                  >
                    <span className="flex items-center">
                      {insight.change > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(insight.change)}%
                    </span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {insight.changeText || insight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Price Change Recommendations */}
        {data.priceChanges && data.priceChanges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Recommended Price Adjustments</h4>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Service</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">Current Price</th>
                    <th className="px-4 py-2 text-center text-sm font-medium"></th>
                    <th className="px-4 py-2 text-right text-sm font-medium">Suggested Price</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">Potential Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.priceChanges.map((change, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm border-t font-medium">
                        {change.serviceName}
                      </td>
                      <td className="px-4 py-3 text-sm text-right border-t">
                        {formatCurrency(change.currentPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-t">
                        <ArrowRight className="h-4 w-4 text-purple-500 inline" />
                      </td>
                      <td className="px-4 py-3 text-sm text-right border-t font-medium">
                        {formatCurrency(change.suggestedPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right border-t">
                        <span className="text-green-600 font-medium">
                          {formatCurrency(change.potentialRevenue)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Billing Campaign */}
        {data.billingCampaign && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-800">Recommended Billing Campaign</h4>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-blue-700">Campaign Name:</span>
                <span className="text-sm text-blue-800">{data.billingCampaign.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-blue-700">Target Patients:</span>
                <span className="text-sm text-blue-800">{data.billingCampaign.targetPatients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-blue-700">Expected Revenue:</span>
                <span className="text-sm text-blue-800">{formatCurrency(data.billingCampaign.expectedRevenue)}</span>
              </div>
              <div className="pt-2">
                <p className="text-sm text-blue-700">{data.billingCampaign.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="p-4 bg-purple-50 border border-purple-100 rounded-md">
          <h4 className="font-medium text-purple-800">Implementation Plan:</h4>
          <ul className="mt-2 space-y-1 list-disc pl-5">
            {data.implementationPlan ? (
              data.implementationPlan.map((step, idx) => (
                <li key={idx} className="text-sm text-purple-700">{step}</li>
              ))
            ) : (
              data.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-purple-700">{rec}</li>
              ))
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
        <Button 
          variant="outline" 
          onClick={() => navigate("/billing")}
        >
          View Billing
        </Button>
        <Button onClick={onApply} className="bg-purple-600 hover:bg-purple-700">
          <TrendingUp className="h-4 w-4 mr-2" /> Apply Recommendations
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RevenueInsightCard;