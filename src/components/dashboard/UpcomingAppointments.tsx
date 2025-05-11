
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for upcoming appointments
const upcomingAppointments = [
  {
    id: 1,
    patientName: "Arjun Patel",
    time: "10:30 AM",
    type: "Consultation",
    status: "confirmed",
  },
  {
    id: 2,
    patientName: "Priya Singh",
    time: "11:15 AM",
    type: "Follow-up",
    status: "confirmed",
  },
  {
    id: 3,
    patientName: "Rajesh Kumar",
    time: "12:00 PM",
    type: "New Patient",
    status: "pending",
  },
  {
    id: 4,
    patientName: "Aisha Verma",
    time: "2:30 PM",
    type: "Consultation",
    status: "confirmed",
  },
];

const UpcomingAppointments = () => {
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
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {appointment.patientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{appointment.patientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.time} • {appointment.type}
                  </p>
                </div>
              </div>
              <Badge
                variant={appointment.status === "confirmed" ? "default" : "outline"}
                className={
                  appointment.status === "confirmed"
                    ? "bg-success-500"
                    : "border-warning-500 text-warning-500"
                }
              >
                {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
