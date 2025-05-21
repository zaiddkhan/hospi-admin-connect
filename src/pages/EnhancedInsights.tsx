// src/pages/EnhancedInsights.tsx
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InsightsOverview from "@/components/insights/InsightsOverview";
import EnhancedInsightList from "@/components/insights/EnhancedInsightList";
import { useInsights, useGenerateInsights } from "@/hooks/useInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const EnhancedInsights = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  // Fetch insights data
  const { 
    data: insights, 
    isLoading, 
    error,
    refetch 
  } = useInsights({});
  
  // Mutation hook for generating new insights
  const generateInsights = useGenerateInsights();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    refetch();
    setRefreshKey(prev => prev + 1);
  };
  
  // Handle generate insights
  const handleGenerateInsights = async (type?: string) => {
    try {
      await generateInsights.mutateAsync(type);
      toast.success("New insights generated successfully");
      handleRefresh();
    } catch (error) {
      toast.error("Failed to generate new insights");
      console.error("Error generating insights:", error);
    }
  };
  
  // Count insights by category and status
  const insightCounts = React.useMemo(() => {
    if (!insights) return { all: 0, scheduling: 0, inventory: 0, revenue: 0, patients: 0 };
    
    // Only count pending (active) insights
    const pendingInsights = insights.filter(insight => insight.status === 'pending');
    
    return {
      all: pendingInsights.length,
      scheduling: pendingInsights.filter(i => i.category === 'scheduling').length,
      inventory: pendingInsights.filter(i => i.category === 'inventory').length,
      revenue: pendingInsights.filter(i => i.category === 'revenue').length,
      patients: pendingInsights.filter(i => i.category === 'patients').length,
    };
  }, [insights]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">AI Insights</h1>
            <p className="text-muted-foreground">
              Machine learning powered recommendations to optimize your practice
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            
            <Button 
              size="sm" 
              onClick={() => handleGenerateInsights(activeTab !== 'all' ? activeTab : undefined)}
              disabled={generateInsights.isPending}
            >
              {generateInsights.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              Generate Insights
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load insights. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">
              All Insights
              {insightCounts.all > 0 && (
                <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {insightCounts.all}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="scheduling">
              Scheduling
              {insightCounts.scheduling > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                  {insightCounts.scheduling}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="inventory">
              Inventory
              {insightCounts.inventory > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                  {insightCounts.inventory}
                </span>
              )}
            </TabsTrigger>
            {/* <TabsTrigger value="revenue">
              Revenue
              {insightCounts.revenue > 0 && (
                <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                  {insightCounts.revenue}
                </span>
              )}
            </TabsTrigger> */}
            <TabsTrigger value="patients">
              Patients
              {insightCounts.patients > 0 && (
                <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs">
                  {insightCounts.patients}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <InsightsOverview />
            <EnhancedInsightList 
              insights={insights} 
              isLoading={isLoading} 
              error={error}
              category="all" 
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="scheduling" className="mt-4">
            <EnhancedInsightList 
              insights={insights} 
              isLoading={isLoading} 
              error={error}
              category="scheduling" 
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
            <EnhancedInsightList 
              insights={insights} 
              isLoading={isLoading} 
              error={error}
              category="inventory" 
              onRefresh={handleRefresh}
            />
          </TabsContent>

          {/* <TabsContent value="revenue" className="mt-4">
            <EnhancedInsightList 
              insights={insights} 
              isLoading={isLoading} 
              error={error}
              category="revenue" 
              onRefresh={handleRefresh}
            />
          </TabsContent> */}
          
          <TabsContent value="patients" className="mt-4">
            <EnhancedInsightList 
              insights={insights} 
              isLoading={isLoading} 
              error={error}
              category="patients" 
              onRefresh={handleRefresh}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EnhancedInsights;