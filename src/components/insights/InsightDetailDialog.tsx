// src/components/insights/InsightDetailDialog.tsx
import React, { useState } from "react";
import { Insight } from "@/services/InsightsService";
import { useApplyInsight, useDismissInsight } from "@/hooks/useInsights";
import {
    Calendar,
    Package2,
    TrendingUp,
    Users,
    Lightbulb,
    CheckCircle,
    XCircle,
    Loader2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SchedulingInsightCard from "@/components/insights/SchedulingInsightCard";
import InventoryInsightCard from "@/components/insights/InventoryInsightCard";
import RevenueInsightCard from "@/components/insights/RevenueInsightCard";
import PatientInsightCard from "@/components/insights/PatientInsightCard";
import { toast } from "sonner";

interface InsightDetailDialogProps {
    insight: Insight | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const InsightDetailDialog: React.FC<InsightDetailDialogProps> = ({
    insight,
    isOpen,
    onOpenChange,
    onSuccess
}) => {
    const [actionResult, setActionResult] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const applyInsight = useApplyInsight();
    const dismissInsight = useDismissInsight();

    if (!insight) return null;

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'scheduling': return <Calendar className="h-5 w-5 text-primary" />;
            case 'inventory': return <Package2 className="h-5 w-5 text-primary" />;
            case 'revenue': return <TrendingUp className="h-5 w-5 text-primary" />;
            case 'patients': return <Users className="h-5 w-5 text-primary" />;
            default: return <Lightbulb className="h-5 w-5 text-primary" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'scheduling': return "bg-blue-100 text-blue-800";
            case 'inventory': return "bg-green-100 text-green-800";
            case 'revenue': return "bg-purple-100 text-purple-800";
            case 'patients': return "bg-orange-100 text-orange-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return "bg-error-500";
            case 'medium': return "bg-warning-500";
            case 'low': return "bg-success-500";
            default: return "bg-muted";
        }
    };

    const handleApply = async () => {
        try {
            // Call the API with the insight ID
            const result = await applyInsight.mutateAsync(insight.id);
            setActionResult(result);
            setShowSuccess(true);
            
            toast.success(`The ${insight.category} insight has been successfully applied`);

            // Call success callback if provided
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error applying insight:', error);
            // Check for specific error messages
            const errorMessage = error?.response?.data?.message || 
                                 error?.message || 
                                 "Failed to apply insight. Please try again.";
            
            // If there's a message about a missing function, show a more helpful error
            if (errorMessage.includes("Could not find the function") || 
                errorMessage.includes("apply_scheduling_insight") ||
                errorMessage.includes("apply_inventory_insight") ||
                errorMessage.includes("apply_revenue_insight") ||
                errorMessage.includes("apply_patient_insight")) {
                toast.error("Backend integration is not complete. Please check with your administrator.");
            } else {
                toast.error(errorMessage);
            }
            
            // Close the dialog on error
            onOpenChange(false);
        }
    };

    const handleDismiss = async () => {
        try {
            await dismissInsight.mutateAsync(insight.id);
            onOpenChange(false);
            
            toast.success("Insight dismissed");

            // Call success callback if provided
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error dismissing insight:', error);
            toast.error("Failed to dismiss insight. Please try again.");
        }
    };

    // Render the insight visualization based on category
    const renderInsightVisualization = () => {
        if (!insight.data) return null;

        switch (insight.category) {
            case 'scheduling':
                return (
                    <SchedulingInsightCard
                        data={insight.data}
                        onApply={handleApply}
                    />
                );
            case 'inventory':
                return (
                    <InventoryInsightCard
                        data={insight.data}
                        onApply={handleApply}
                    />
                );
            case 'revenue':
                return (
                    <RevenueInsightCard
                        data={insight.data}
                        onApply={handleApply}
                    />
                );
            case 'patients':
                return (
                    <PatientInsightCard
                        data={insight.data}
                        onApply={handleApply}
                    />
                );
            default:
                return (
                    <div className="p-4 bg-muted rounded-md">
                        <p className="text-muted-foreground">No detailed view available for this insight type.</p>
                    </div>
                );
        }
    };

    // Format changes based on insight category
    const formatChanges = (changes: any[], category: string) => {
        if (!changes || !Array.isArray(changes) || changes.length === 0) {
            return <p>No specific changes were made.</p>;
        }

        switch (category) {
            case 'scheduling':
                return changes.map((change, idx) => (
                    <li key={idx}>
                        Rescheduled appointment for {change.patient_name} from {change.old_time} to {change.new_time}
                    </li>
                ));
            case 'inventory':
                return changes.map((change, idx) => (
                    <li key={idx}>
                        {change.action === 'create_order' 
                            ? `Created purchase order #${change.purchase_order_id} with ${change.items_count} items totaling ₹${change.total_amount?.toLocaleString()}`
                            : `Updated stock level for ${change.item_name} from ${change.old_stock} to ${change.new_stock}`}
                    </li>
                ));
            case 'revenue':
                return changes.map((change, idx) => (
                    <li key={idx}>
                        {change.service_name 
                            ? `Updated price for ${change.service_name} from ₹${change.old_price} to ₹${change.new_price}`
                            : `Created billing campaign "${change.campaign_name}" targeting ${change.target_count} patients`}
                    </li>
                ));
            case 'patients':
                return changes.map((change, idx) => (
                    <li key={idx}>
                        {change.appointment_id 
                            ? `Scheduled follow-up for ${change.patient_name} on ${new Date(change.date).toLocaleDateString()}`
                            : `Created health reminder for ${change.check_type || 'check-up'} due on ${new Date(change.due_date).toLocaleDateString()}`}
                    </li>
                ));
            default:
                return <li>Applied insight successfully</li>;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                {!showSuccess ? (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                {getCategoryIcon(insight.category)}
                                <DialogTitle>{insight.title}</DialogTitle>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className={getCategoryColor(insight.category)}>
                                    {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                                </Badge>
                                <Badge className={getPriorityColor(insight.priority)}>
                                    {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
                                </Badge>
                            </div>
                            <DialogDescription className="mt-2">
                                {insight.description}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            {insight.impact && (
                                <Alert className="mb-4">
                                    <AlertTitle>Potential Impact</AlertTitle>
                                    <AlertDescription>
                                        {insight.impact}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {renderInsightVisualization()}

                            {insight.implementation_details && insight.implementation_details.length > 0 && (
                                <div className="mt-4 p-4 bg-muted rounded-md">
                                    <h3 className="font-medium mb-2">Changes to be made:</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {Array.isArray(insight.implementation_details) && 
                                            insight.implementation_details.map((detail, idx) => (
                                                <li key={idx}>{detail}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={handleDismiss}
                                disabled={dismissInsight.isPending}
                            >
                                {dismissInsight.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Dismissing...
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Dismiss
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handleApply}
                                disabled={applyInsight.isPending}
                            >
                                {applyInsight.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Applying...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Apply
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-success-700">
                                <CheckCircle className="h-5 w-5" />
                                Insight Applied Successfully
                            </DialogTitle>
                        </DialogHeader>

                        <div className="py-4">
                            <Alert className="mb-4 bg-green-50 border-green-200">
                                <CheckCircle className="h-4 w-4 text-green-800" />
                                <AlertTitle className="text-green-800">Changes Applied</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    {actionResult?.message || "The insight has been successfully applied."}
                                </AlertDescription>
                            </Alert>

                            {actionResult?.result?.changes && 
                             actionResult.result.changes.length > 0 && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                                    <h3 className="font-medium mb-2 text-green-800">Applied Changes:</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-green-700">
                                        {formatChanges(actionResult.result.changes, insight.category)}
                                    </ul>
                                </div>
                            )}
                            
                            {actionResult?.result?.insights && (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                    <h3 className="font-medium mb-2 text-blue-800">New Insights Generated:</h3>
                                    <p className="text-blue-700">
                                        {actionResult.result.insights} new insight{actionResult.result.insights !== 1 ? 's' : ''} generated based on your action.
                                    </p>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button onClick={() => onOpenChange(false)} className="bg-green-600 hover:bg-green-700">
                                Close
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default InsightDetailDialog;