
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">
        <div className="text-xl font-bold">{value}</div>
        {trend && (
          <p className={cn(
            "text-xs flex items-center gap-1 mt-1",
            trend.isPositive ? "text-success-700" : "text-error-500"
          )}>
            <span>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">vs last week</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
