// src/pages/Insights.tsx
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InsightsOverview from "@/components/insights/InsightsOverview";
import InsightsList from "@/components/insights/InsightList";
import { useInsights } from "@/hooks/useInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Insights = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { data: insights, isLoading, error } = useInsights();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-title">AI Insights</h1>
          <p className="text-muted-foreground">
            Machine learning powered recommendations to optimize your practice
          </p>
        </div>

        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="all">All Insights</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <InsightsOverview />
            <InsightsList 
              insights={insights} 
              isLoading={isLoading} 
              error={error}
              category="all" 
            />
          </TabsContent>

          <TabsContent value="scheduling" className="mt-4">
            <InsightsList 
              insights={insights} 
              isLoading={isLoading} 
              error={error}
              category="scheduling" 
            />
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
            <InsightsList 
              insights={insights} 
              isLoading={isLoading} 
              error={error}
              category="inventory" 
            />
          </TabsContent>

          <TabsContent value="revenue" className="mt-4">
            <InsightsList 
              insights={insights} 
              isLoading={isLoading} 
              error={error}
              category="revenue" 
            />
          </TabsContent>
          
          <TabsContent value="patients" className="mt-4">
            <InsightsList 
              insights={insights} 
              isLoading={isLoading} 
              error={error}
              category="patients" 
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Insights;