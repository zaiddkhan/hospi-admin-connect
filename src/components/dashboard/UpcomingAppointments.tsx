import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodayAppointments, useUpdateAppointment } from "@/hooks/useAppointments";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const UpcomingAppointments = () => {
  const navigate = useNavigate();
  const { data: appointments, isLoading, error } = useTodayAppointments();
  const updateAppointment = useUpdateAppointment();

  const handleViewAll = () => {
    navigate("/appointments");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleSendReminder = (id: string) => {
    // Update appointment to add a reminder flag
    updateAppointment.mutate({
      id,
      appointmentData: { reminder_sent: true }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <CardTitle className="text-lg">Today's Appointments</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="space-y-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !appointments) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <CardTitle className="text-lg">Today's Appointments</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="flex items-center justify-center py-4">
            <p className="text-muted-foreground">Failed to load appointments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <CardTitle className="text-lg">Today's Appointments</CardTitle>
        <Button variant="outline" size="sm" onClick={handleViewAll}>
          View All
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-2">
          {appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No appointments scheduled for today
            </p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {appointment.patients && getInitials(appointment.patients.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{appointment.patients?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(`${appointment.date}T${appointment.time}`), 'h:mm a')} • {appointment.type}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={appointment.status === "confirmed" ? "default" : "outline"}
                  className={
                    appointment.status === "confirmed"
                      ? "bg-success-500"
                      : appointment.status === "cancelled"
                      ? "border-error-500 text-error-500"
                      : "border-warning-500 text-warning-500"
                  }
                >
                  {appointment.status === "confirmed" ? "Confirmed" : 
                   appointment.status === "cancelled" ? "Cancelled" : "Pending"}
                </Badge>
              </div>
            ))
          )}
          {appointments.length > 0 && appointments.some(a => a.status === "pending") && (
            <Button 
              size="sm" 
              className="w-full mt-2"
              onClick={() => {
                // Find the first pending appointment
                const pendingAppointment = appointments.find(a => a.status === "pending");
                if (pendingAppointment) {
                  handleSendReminder(pendingAppointment.id);
                }
              }}
            >
              Send Reminder
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;