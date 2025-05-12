// src/components/insights/SchedulingInsightCard.tsx
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface ScheduleSlot {
  time: string;
  count: number;
  appointments?: string[];
}

interface SchedulingInsightProps {
  data: {
    date: string;
    doctorName: string;
    currentSchedule: ScheduleSlot[];
    suggestedSchedule: ScheduleSlot[];
    benefitText: string;
    redistributionReason?: string;
    appointments?: {
      id: string;
      patientName: string;
      oldTime: string;
      newTime: string;
    }[];
  };
  onApply: () => void;
}

export const SchedulingInsightCard: React.FC<SchedulingInsightProps> = ({ 
  data, 
  onApply 
}) => {
  const navigate = useNavigate();
  const formattedDate = format(new Date(data.date), "EEEE, MMMM d, yyyy");

  const maxAppointments = Math.max(
    ...data.currentSchedule.map(slot => slot.count),
    ...data.suggestedSchedule.map(slot => slot.count)
  );

  // Format time for display (convert from 24h to 12h format)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Schedule Optimization for {data.doctorName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {formattedDate}
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Current vs. Suggested Schedule</h3>
          <p className="text-sm text-muted-foreground">
            {data.redistributionReason || 
              "Based on patient waiting times and doctor availability, we suggest redistributing appointments to optimize the schedule."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Current Schedule</h4>
              <Badge variant="outline" className="bg-blue-50">
                {data.currentSchedule.reduce((sum, slot) => sum + slot.count, 0)} Appointments
              </Badge>
            </div>
            
            <div className="space-y-3">
              {data.currentSchedule.map((slot, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm font-medium">{formatTime(slot.time)}</span>
                    </div>
                    <span className="text-sm">{slot.count} appointments</span>
                  </div>
                  <div className="w-full h-2 bg-muted overflow-hidden rounded-full">
                    <div 
                      className="h-full bg-blue-400 rounded-full" 
                      style={{ width: `${(slot.count / maxAppointments) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Suggested Schedule</h4>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Optimized
              </Badge>
            </div>
            
            <div className="space-y-3">
              {data.suggestedSchedule.map((slot, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm font-medium">{formatTime(slot.time)}</span>
                    </div>
                    <span className="text-sm">{slot.count} appointments</span>
                  </div>
                  <div className="w-full h-2 bg-muted overflow-hidden rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${(slot.count / maxAppointments) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments to be rescheduled */}
        {data.appointments && data.appointments.length > 0 && (
          <div className="space-y-3 mt-4">
            <h4 className="font-medium">Appointments to be Rescheduled:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.appointments.map((apt, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 rounded-md bg-blue-50 border border-blue-100"
                >
                  <div>
                    <p className="font-medium text-sm">{apt.patientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(apt.oldTime)} <ChevronRight className="h-3 w-3 inline" /> {formatTime(apt.newTime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="p-4 bg-green-50 border border-green-100 rounded-md">
          <h4 className="font-medium text-green-800">Benefits of This Change:</h4>
          <p className="text-sm mt-1 text-green-700">
            {data.benefitText}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
        <Button 
          variant="outline" 
          onClick={() => navigate("/appointments")}
        >
          View Appointments
        </Button>
        <Button onClick={onApply} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" /> Apply New Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SchedulingInsightCard;