// src/components/insights/EnhancedInsightList.tsx
import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Lightbulb, 
  Calendar, 
  Package2, 
  TrendingUp, 
  Users, 
  Check, 
  X,
  Eye
} from "lucide-react";
import { Insight } from "@/services/InsightsService";
import { useDismissInsight } from "@/hooks/useInsights";
import { toast } from "sonner";
import InsightDetailDialog from "./InsightDetailDialog";

interface EnhancedInsightListProps {
  insights?: Insight[];
  isLoading: boolean;
  error: any;
  category: string;
  onRefresh?: () => void;
}

const EnhancedInsightList: React.FC<EnhancedInsightListProps> = ({
  insights = [],
  isLoading,
  error,
  category,
  onRefresh
}) => {
  const dismissInsight = useDismissInsight();
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filter insights by category if needed
  const filteredInsights = category === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === category);

  // Filter active insights (pending only)
  const activeInsights = filteredInsights.filter(insight => insight.status === 'pending');
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'scheduling':
        return <Calendar className="h-5 w-5 text-primary" />;
      case 'inventory':
        return <Package2 className="h-5 w-5 text-primary" />;
      case 'revenue':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'patients':
        return <Users className="h-5 w-5 text-primary" />;
      default:
        return <Lightbulb className="h-5 w-5 text-primary" />;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scheduling':
        return "bg-blue-100 text-blue-800";
      case 'inventory':
        return "bg-green-100 text-green-800";
      case 'revenue':
        return "bg-purple-100 text-purple-800";
      case 'patients':
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return "bg-error-500";
      case 'medium':
        return "bg-warning-500";
      case 'low':
        return "bg-success-500";
      default:
        return "bg-muted";
    }
  };
  
  const handleViewDetails = (insight: Insight) => {
    setSelectedInsight(insight);
    setDialogOpen(true);
  };
  
  const handleDismiss = (insightId: string) => {
    dismissInsight.mutate(insightId, {
      onSuccess: () => {
        toast.success("Insight dismissed");
        if (onRefresh) onRefresh();
      }
    });
  };
  
  const handleDialogSuccess = () => {
    if (onRefresh) onRefresh();
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-error-500 mb-2">Failed to load insights. Please try again.</p>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (activeInsights.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">No active insights available for this category.</p>
          <p className="text-sm text-muted-foreground mb-4">
            The AI will generate insights as more data becomes available.
          </p>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Check for new insights
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {activeInsights.map((insight) => (
          <Card key={insight.id} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                {getCategoryIcon(insight.category)}
                <div>
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getCategoryColor(insight.category)}>
                      {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                    </Badge>
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Generated {format(new Date(insight.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{insight.description}</p>
              {insight.impact && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">Potential Impact:</p>
                  <p className="text-sm">{insight.impact}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDismiss(insight.id)}
                disabled={dismissInsight.isPending}
              >
                <X className="h-4 w-4 mr-2" /> Dismiss
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewDetails(insight)}
                >
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleViewDetails(insight)}
                >
                  <Check className="h-4 w-4 mr-2" /> Apply
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <InsightDetailDialog
        insight={selectedInsight}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleDialogSuccess}
      />
    </>
  );
};

export default EnhancedInsightList;