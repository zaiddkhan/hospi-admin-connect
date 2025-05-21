
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
  { date: "Mon", csat: 100 },
  { date: "Tue", csat: 98 },
  { date: "Wed", csat: 52 },
  { date: "Thu", csat: 87 },
  { date: "Fri", csat: 65 },
  { date: "Sat", csat: 21 },
  { date: "Sun", csat: 85 },
];

const monthlyRevenue = [
  { date: "Jan", csat: 98 },
  { date: "Feb", csat: 80 },
  { date: "Mar", csat: 88 },
  { date: "Apr", csat: 76},
  { date: "May", csat: 87 },
];

const RevenueMetrics = () => {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customer Satisfaction Metrics</CardTitle>
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
                  <YAxis tickFormatter={(value) => `${value}`} />
                  <Tooltip formatter={(value) => [`${value}`, "CSAT"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="csat"
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
                <p className="text-sm text-muted-foreground">Total NPS</p>
                <p className="text-2xl font-bold">50</p>
                <p className="text-xs text-success-700">
                  ↑ 12% vs last week
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Avg. Daily NPS</p>
                <p className="text-2xl font-bold">35</p>
                <p className="text-xs text-success-700">
                  ↑ 5% vs last week
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">NPS/Patient</p>
                <p className="text-2xl font-bold">34</p>
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
                  <YAxis tickFormatter={(value) => `${value}`} />
                  <Tooltip formatter={(value) => [`${value}`, "CSAT"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="csat"
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
                <p className="text-sm text-muted-foreground">Total NPS</p>
                <p className="text-2xl font-bold">66</p>
                <p className="text-xs text-success-700">
                  ↑ 8% vs last month
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Avg. Daily NPS</p>
                <p className="text-2xl font-bold">34</p>
                <p className="text-xs text-success-700">
                  ↑ 7% vs last month
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">NPS/Patient</p>
                <p className="text-2xl font-bold">40</p>
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
