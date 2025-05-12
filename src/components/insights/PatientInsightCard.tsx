// src/components/insights/PatientInsightCard.tsx
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Bell, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface FollowUpPatient {
  id: string;
  name: string;
  reason: string;
  lastVisit: string;
  suggestedDate: string;
}

interface HealthCheckReminder {
  id: string;
  name: string;
  checkType: string;
  dueDate: string;
  lastCheck?: string;
}

interface PatientInsightProps {
  data: {
    followUps?: FollowUpPatient[];
    healthCheckReminders?: HealthCheckReminder[];
    recommendationReason?: string;
    benefitText?: string;
    categoryBreakdown?: {
      category: string;
      count: number;
      percentage: number;
    }[];
  };
  onApply: () => void;
}

export const PatientInsightCard: React.FC<PatientInsightProps> = ({
  data,
  onApply
}) => {
  const navigate = useNavigate();

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

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
                        <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
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

        {/* Category Breakdown */}
        {data.categoryBreakdown && data.categoryBreakdown.length > 0 && (
          <div className="p-4 bg-gray-50 border rounded-md">
            <h4 className="font-medium mb-3">Follow-up Category Breakdown</h4>
            <div className="space-y-2">
              {data.categoryBreakdown.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm">{category.count} patients ({category.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: index === 0 ? '#f97316' : 
                                        index === 1 ? '#3b82f6' : 
                                        index === 2 ? '#10b981' : 
                                        '#8b5cf6'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
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

export default PatientInsightCard;