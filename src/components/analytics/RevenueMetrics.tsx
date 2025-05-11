
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Mock data for revenue analytics
const weeklyRevenue = [
  { date: "Mon", revenue: 12500 },
  { date: "Tue", revenue: 9800 },
  { date: "Wed", revenue: 15200 },
  { date: "Thu", revenue: 18700 },
  { date: "Fri", revenue: 16500 },
  { date: "Sat", revenue: 21000 },
  { date: "Sun", revenue: 8500 },
];

const monthlyRevenue = [
  { date: "Jan", revenue: 280000 },
  { date: "Feb", revenue: 320000 },
  { date: "Mar", revenue: 310000 },
  { date: "Apr", revenue: 350000 },
  { date: "May", revenue: 390000 },
];

const RevenueMetrics = () => {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue Metrics</CardTitle>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            Export Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="mb-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weeklyRevenue}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1A7FFF"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹102,200</p>
                <p className="text-xs text-success-700">
                  ↑ 12% vs last week
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Avg. Daily Revenue</p>
                <p className="text-2xl font-bold">₹14,600</p>
                <p className="text-xs text-success-700">
                  ↑ 5% vs last week
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Revenue/Patient</p>
                <p className="text-2xl font-bold">₹860</p>
                <p className="text-xs text-error-500">
                  ↓ 2% vs last week
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="monthly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyRevenue}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1A7FFF"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹1,650,000</p>
                <p className="text-xs text-success-700">
                  ↑ 8% vs last month
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Avg. Daily Revenue</p>
                <p className="text-2xl font-bold">₹16,500</p>
                <p className="text-xs text-success-700">
                  ↑ 7% vs last month
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Revenue/Patient</p>
                <p className="text-2xl font-bold">₹825</p>
                <p className="text-xs text-success-700">
                  ↑ 3% vs last month
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RevenueMetrics;
