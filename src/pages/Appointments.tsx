import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Plus, Filter } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import AppointmentList from "@/components/appointments/AppointmentList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments } from "@/hooks/useAppointments";

const Appointments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar");
  
  // Convert selected date to string format for API
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  
  // Get appointments data
  const { 
    data: appointments, 
    isLoading, 
    error 
  } = useAppointments({ date: activeView === "calendar" ? undefined : formattedDate });

  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Navigate to create new appointment
  const handleAddAppointment = () => {
    navigate("/appointments/new");
  };

  // Navigate to edit appointment
  const handleEditAppointment = (id: string) => {
    navigate(`/appointments/${id}/edit`);
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Appointments</h1>
            <p className="text-muted-foreground">Manage your schedule and appointments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddAppointment}>
              <Plus className="h-4 w-4 mr-2" /> New Appointment
            </Button>
          </div>
        </div>

        <Tabs defaultValue="calendar" onValueChange={(value) => setActiveView(value as "calendar" | "list")}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <TabsList>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="mt-4">
            {isLoading ? (
              <Skeleton className="h-[500px] w-full" />
            ) : (
              <AppointmentCalendar
                appointments={appointments || []}
                onDateSelect={handleDateSelect}
                onAddAppointment={handleAddAppointment}
                selectedDate={selectedDate}
              />
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <AppointmentList
              appointments={appointments || []}
              isLoading={isLoading}
              error={error}
              onEdit={(appointment) => handleEditAppointment(appointment.id)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Appointments;