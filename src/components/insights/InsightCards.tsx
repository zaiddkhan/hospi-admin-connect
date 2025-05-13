// src/components/insights/InsightCards.tsx
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart4, Calendar, Clipboard, Package2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge, Bell, CheckCircle, AlertCircle, Users } from "lucide-react";


interface PatientInsightProps {
    data: {
        followUps?: Array<{
            id: string;
            name: string;
            reason: string;
            lastVisit: string;
            suggestedDate: string;
        }>;
        healthCheckReminders?: Array<{
            id: string;
            name: string;
            checkType: string;
            dueDate: string;
            lastCheck?: string;
        }>;
        recommendationReason?: string;
        benefitText?: string;
        categoryBreakdown?: Array<{
            category: string;
            count: number;
            percentage: number;
        }>;
    };
    onApply: () => void;
}

interface SchedulingInsightProps {
    data: {
        date: string;
        doctorName: string;
        currentSchedule: Array<{ time: string; count: number }>;
        suggestedSchedule: Array<{ time: string; count: number }>;
        benefitText: string;
    };
    onApply: () => void;
}

export const SchedulingInsightCard: React.FC<SchedulingInsightProps> = ({ data, onApply }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Schedule Optimization for {"Dr. House"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Our AI has analyzed appointment patterns and recommends the following schedule
                    adjustments for 12/03/25:</p>

                <div className="grid grid-cols-2 gap-4">
                    {/* <div className="space-y-2">
                        <p className="font-medium">Current Schedule</p>
                        <div className="space-y-1">
                            {data.currentSchedule.map((slot, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{slot.time}</span>
                                    <span>{slot.count} appointments</span>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    {/* <div className="space-y-2">
                        <p className="font-medium">Suggested Schedule</p>
                        <div className="space-y-1">
                            {data.suggestedSchedule.map((slot, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{slot.time}</span>
                                    <span>{slot.count} appointments</span>
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>

                {/* <div className="p-3 bg-muted rounded-md">
                    <p className="font-medium">Potential Benefits:</p>
                    <p className="text-sm">{data.benefitText}</p>
                </div> */}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/appointments")}>
                    View Appointments
                </Button>
                <Button onClick={onApply}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Apply New Schedule
                </Button>
            </CardFooter>
        </Card>
    );
};

interface InventoryInsightProps {
    data: {
        itemsToRestock: Array<{
            id: string;
            name: string;
            currentStock: number;
            suggestedStock: number;
            unitPrice: number;
        }>;
        totalCost: number;
        suggestedDate: string;
        savingsPercentage: number;
    };
    onApply: () => void;
}

export const InventoryInsightCard: React.FC<InventoryInsightProps> = ({ data, onApply }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package2 className="h-5 w-5 text-primary" />
                    Bulk Purchase Recommendation
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Based on usage patterns and upcoming appointments, we recommend placing a bulk order
                    by {data.suggestedDate} for these items:</p>

                <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm">Item</th>
                                <th className="px-4 py-2 text-right text-sm">Current Stock</th>
                                <th className="px-4 py-2 text-right text-sm">Suggested Order</th>
                                <th className="px-4 py-2 text-right text-sm">Unit Price</th>
                                <th className="px-4 py-2 text-right text-sm">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.itemsToRestock && Array.isArray(data.itemsToRestock) && data.itemsToRestock.length > 0 ? (
                                data.itemsToRestock.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-2 text-sm">{item.name}</td>
                                        <td className="px-4 py-2 text-sm text-right">{item.currentStock}</td>
                                        <td className="px-4 py-2 text-sm text-right">{item.suggestedStock}</td>
                                        <td className="px-4 py-2 text-sm text-right">₹{item.unitPrice}</td>
                                        <td className="px-4 py-2 text-sm text-right">
                                            ₹{(item.suggestedStock * item.unitPrice)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-4 py-2 text-sm text-center">No items to restock</td>
                                </tr>
                            )}

                            <tr className="border-t bg-muted/50">
                                <td colSpan={4} className="px-4 py-2 text-sm font-medium text-right">
                                    Total
                                </td>
                                <td className="px-4 py-2 text-sm font-bold text-right">
                                    ₹{data.totalCost}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="p-3 bg-muted rounded-md">
                    <p className="font-medium">Potential Savings:</p>
                    <p className="text-sm">
                        Placing this bulk order can save approximately {data.savingsPercentage}% compared to
                        individual purchases.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/inventory")}>
                    View Inventory
                </Button>
                <Button onClick={onApply}>
                    <Clipboard className="h-4 w-4 mr-2" /> Generate Purchase Order
                </Button>
            </CardFooter>
        </Card>
    );
};

interface RevenueInsightProps {
    data: {
        insights: Array<{
            title: string;
            description: string;
            value: number;
            change: number;
        }>;
        recommendations: string[];
    };
    onApply: () => void;
}

export const RevenueInsightCard: React.FC<RevenueInsightProps> = ({ data, onApply }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-primary" />
                    Revenue Optimization Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Our AI has analyzed your billing and appointment data to identify revenue
                    optimization opportunities:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data && Array.isArray(data.insights) && data.insights.length > 0 ? (
                        data.insights.map((insight, idx) => (
                            <Card key={idx} className="border">
                                <CardContent className="p-4">
                                    <h3 className="text-sm font-medium">{insight.title}</h3>
                                    <p className="text-2xl font-bold mt-1">
                                        ₹{insight.value.toLocaleString()}
                                        <span className={`text-sm ml-2 ${insight.change > 0 ? 'text-success-700' : 'text-error-500'}`}>
                                            {insight.change > 0 ? '↑' : '↓'} {Math.abs(insight.change)}%
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p>No insights available</p> // Display a fallback message when data or insights is undefined or empty
                    )}
                </div>


                <div className="p-3 bg-muted rounded-md">
                    <p className="font-medium">Recommendations:</p>
                    {data && Array.isArray(data.recommendations) && data.recommendations.length > 0 ? (
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            {data.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm">{rec}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">No recommendations available.</p> // Fallback message when no recommendations
                    )}
                </div>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/billing")}>
                    View Billing
                </Button>
                <Button onClick={onApply}>
                    Apply Recommendations
                </Button>
            </CardFooter>
        </Card>
    );
};

export const PatientInsightCard: React.FC<PatientInsightProps> = ({ data, onApply }) => {
    const navigate = useNavigate();

    // Get initials for avatar
    const getInitials = (name: string) => {
        if (!name) return "P";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "MMM d, yyyy");
        } catch (error) {
            return dateString;
        }
    };

    // Handle missing data
    if (!data) {
        return (
            <div className="p-4 bg-muted rounded-md">
                <p className="text-muted-foreground">Patient data is not available.</p>
            </div>
        );
    }

    return (
        <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    Patient Care Recommendations
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Patient Follow-up Insights</h3>
                    <p className="text-sm text-muted-foreground">
                        {data.recommendationReason || 
                            "Based on patient history and best practices, we recommend the following follow-ups and health check reminders."}
                    </p>
                </div>

                {/* Follow-up Recommendations */}
                {data.followUps && data.followUps.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                            <h4 className="font-medium">Recommended Follow-ups</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.followUps.map((patient, index) => (
                                <Card key={index} className="border shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-orange-100 text-orange-800">
                                                    {getInitials(patient.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{patient.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Last visit: {formatDate(patient.lastVisit)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Follow-up reason:</span>
                                                <Badge  className="bg-orange-50 text-orange-800 border-orange-200">
                                                    {patient.reason}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm font-medium">Suggested date:</span>
                                                <span className="text-sm">{formatDate(patient.suggestedDate)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Health Check Reminders */}
                {data.healthCheckReminders && data.healthCheckReminders.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Bell className="h-5 w-5 text-blue-600 mr-2" />
                            <h4 className="font-medium">Health Check Reminders</h4>
                        </div>
                        
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium">Patient</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium">Check Type</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium">Last Check</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium">Due Date</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.healthCheckReminders.map((reminder, index) => {
                                        const isOverdue = new Date(reminder.dueDate) < new Date();
                                        
                                        return (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-4 py-3 text-sm border-t">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                                                {getInitials(reminder.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{reminder.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm border-t">
                                                    {reminder.checkType}
                                                </td>
                                                <td className="px-4 py-3 text-sm border-t">
                                                    {reminder.lastCheck ? formatDate(reminder.lastCheck) : "N/A"}
                                                </td>
                                                <td className="px-4 py-3 text-sm border-t">
                                                    {formatDate(reminder.dueDate)}
                                                </td>
                                                <td className="px-4 py-3 text-sm border-t">
                                                    {isOverdue ? (
                                                        <Badge className="bg-red-100 text-red-800 border-red-200">
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            Overdue
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                                            Due Soon
                                                        </Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Benefits */}
                <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                    <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-medium text-green-800">Benefits of Implementation</h4>
                    </div>
                    <p className="text-sm mt-2 text-green-700">
                        {data.benefitText || "Implementing these patient care recommendations can improve patient outcomes, increase practice revenue, and strengthen patient retention. Regular follow-ups and health checks help catch issues early and demonstrate your commitment to patient care."}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
                <Button 
                    variant="outline" 
                    onClick={() => navigate("/patients")}
                >
                    View Patients
                </Button>
                <Button onClick={onApply} className="bg-orange-600 hover:bg-orange-700">
                    <CheckCircle className="h-4 w-4 mr-2" /> Apply Recommendations
                </Button>
            </CardFooter>
        </Card>
    );
};