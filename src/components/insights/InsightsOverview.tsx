// src/components/insights/InsightsOverview.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Calendar, Package2, TrendingUp, Users } from "lucide-react";
import { useInsightsStats } from "@/hooks/useInsights";
import { Skeleton } from "@/components/ui/skeleton";

const InsightsOverview = () => {
  const { data: stats, isLoading } = useInsightsStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
          <Lightbulb className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="py-2 px-4">
          <p className="text-2xl font-bold">{stats?.totalInsights || 0}</p>
          <p className="text-xs text-muted-foreground">
            {stats?.newInsights || 0} new since yesterday
          </p>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <CardTitle className="text-sm font-medium">Scheduling</CardTitle>
          <Calendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="py-2 px-4">
          <p className="text-2xl font-bold">{stats?.schedulingInsights || 0}</p>
          <p className="text-xs text-muted-foreground">Optimization opportunities</p>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <CardTitle className="text-sm font-medium">Inventory</CardTitle>
          <Package2 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="py-2 px-4">
          <p className="text-2xl font-bold">{stats?.inventoryInsights || 0}</p>
          <p className="text-xs text-muted-foreground">Restock recommendations</p>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="py-2 px-4">
          <p className="text-2xl font-bold">{stats?.revenueInsights || 0}</p>
          <p className="text-xs text-muted-foreground">Financial insights</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsOverview;