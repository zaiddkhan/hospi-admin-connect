import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/hooks/useAppointments";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const UpcomingAppointments = () => {
  const { data: appointments, isLoading } = useAppointments();

  // Function to determine the avatar color based on appointment type
  const getAvatarColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-primary text-primary-foreground";
      case "checkup":
        return "bg-secondary text-secondary-foreground";
      case "followup":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : appointments && appointments.length > 0 ? (
          <ul className="divide-y divide-border">
            {appointments.slice(0, 5).map((appointment) => (
              <li key={appointment.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className={getAvatarColor(appointment.type)}>
                    <AvatarImage src="https://github.com/shadcn.png" alt={appointment.patients.name} />
                    <AvatarFallback>{appointment.patients.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{appointment.patients.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(appointment.date), "MMM dd, yyyy")} at {appointment.time}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="secondary">{appointment.type}</Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-center text-muted-foreground">No upcoming appointments.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
