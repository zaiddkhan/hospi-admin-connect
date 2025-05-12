// src/components/insights/InsightsList.tsx
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Calendar, Package2, TrendingUp, Users, Check, PanelRightOpen } from "lucide-react";
import { Insight } from "@/services/InsightsService";
import { useApplyInsight, useDismissInsight } from "@/hooks/useInsights";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface InsightsListProps {
  insights?: Insight[];
  isLoading: boolean;
  error: any;
  category: string;
}

const InsightsList: React.FC<InsightsListProps> = ({
  insights = [],
  isLoading,
  error,
  category,
}) => {
  const applyInsight = useApplyInsight();
  const dismissInsight = useDismissInsight();
  const [selectedInsight, setSelectedInsight] = React.useState<Insight | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  // Filter insights by category if needed
  const filteredInsights = category === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === category);
  
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
  
  const handleApply = (insight: Insight) => {
    setSelectedInsight(insight);
    setDialogOpen(true);
  };
  
  const confirmApply = () => {
    if (!selectedInsight) return;
    
    applyInsight.mutate(selectedInsight.id, {
      onSuccess: () => {
        toast.success("Insight applied successfully");
        setDialogOpen(false);
      }
    });
  };
  
  const handleDismiss = (insightId: string) => {
    dismissInsight.mutate(insightId, {
      onSuccess: () => {
        toast.success("Insight dismissed");
      }
    });
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
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (filteredInsights.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-2">No insights available for this category.</p>
          <p className="text-sm text-muted-foreground">
            The AI will generate insights as more data becomes available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredInsights.map((insight) => (
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
            <Button variant="outline" size="sm" onClick={() => handleDismiss(insight.id)}>
              Dismiss
            </Button>
            <Button size="sm" onClick={() => handleApply(insight)}>
              <Check className="h-4 w-4 mr-2" /> Apply Recommendation
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Recommendation</DialogTitle>
            <DialogDescription>
              Are you sure you want to apply this recommendation? This will make changes to your system.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInsight && (
            <div className="py-2">
              <p className="font-medium">{selectedInsight.title}</p>
              <p className="text-sm mt-1">{selectedInsight.description}</p>
              
              {selectedInsight.implementation_details && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">Changes to be made:</p>
                  <ul className="text-sm list-disc pl-5 mt-1 space-y-1">
                    {selectedInsight.implementation_details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmApply} 
              disabled={applyInsight.isPending}
            >
              {applyInsight.isPending ? "Applying..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InsightsList;