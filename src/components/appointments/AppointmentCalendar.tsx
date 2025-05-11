import React, { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Appointment } from "@/services/appointmentService";
import { useNavigate } from "react-router-dom";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onDateSelect?: (date: Date) => void;
  onAddAppointment?: () => void;
  selectedDate?: Date;
  className?: string;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onDateSelect,
  onAddAppointment,
  selectedDate: propSelectedDate,
  className,
}) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(propSelectedDate || new Date());
  const [dateAppointments, setDateAppointments] = useState<Appointment[]>([]);

  // Update selected date when prop changes
  useEffect(() => {
    if (propSelectedDate) {
      setSelectedDate(propSelectedDate);
    }
  }, [propSelectedDate]);

  // Filter appointments for selected date
  useEffect(() => {
    if (selectedDate && appointments.length > 0) {
      const filteredAppointments = appointments.filter((appointment) =>
        isSameDay(new Date(appointment.date), selectedDate)
      );
      setDateAppointments(filteredAppointments);
    } else {
      setDateAppointments([]);
    }
  }, [selectedDate, appointments]);

  // Handler for date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  // Handler for navigating to today
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    if (onDateSelect) {
      onDateSelect(today);
    }
  };

  // Get status color for dot indicator
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success-500";
      case "cancelled":
        return "bg-error-500";
      case "completed":
        return "bg-primary";
      default:
        return "bg-warning-500";
    }
  };

  // Calendar day render to show appointments
  const dayWithAppointments = (date: Date) => {
    const dayAppointments = appointments.filter((appointment) =>
      isSameDay(new Date(appointment.date), date)
    );
    
    if (dayAppointments.length === 0) {
      return <div className="h-full"></div>;
    }
    
    const maxToShow = 3;
    const hasMore = dayAppointments.length > maxToShow;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 px-1 pb-0.5">
        <div className="flex flex-wrap gap-0.5 justify-center">
          {dayAppointments.slice(0, maxToShow).map((appointment, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${getStatusColor(appointment.status)}`}
            ></div>
          ))}
          {hasMore && (
            <span className="text-[10px] leading-none text-muted-foreground ml-0.5">
              +{dayAppointments.length - maxToShow}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Format time for display
  const formatTime = (time: string) => {
    return format(new Date(`2000-01-01T${time}`), "h:mm a");
  };

  // Navigate to appointment detail page
  const navigateToAppointment = (appointment: Appointment) => {
    navigate(`/appointments/${appointment.id}`);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <CardTitle className="text-lg">Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddAppointment || (() => navigate("/appointments/new"))}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border p-2"
            components={{
              DayContent: (props) => (
                <div className="relative h-full w-full">
                  <div>{props.date.getDate()}</div>
                  {dayWithAppointments(props.date)}
                </div>
              ),
            }}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
            </h3>
            <Badge>
              {dateAppointments.length} appointment{dateAppointments.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          {dateAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 border rounded-md p-4">
              <p className="text-muted-foreground mb-3">No appointments scheduled</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onAddAppointment || (() => navigate("/appointments/new"))}
              >
                <Plus className="h-4 w-4 mr-1" /> Schedule New
              </Button>
            </div>
          ) : (
            <div className="max-h-[250px] overflow-y-auto">
              {dateAppointments
                .sort((a, b) => (a.time > b.time ? 1 : -1))
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-secondary mb-2 cursor-pointer"
                    onClick={() => navigateToAppointment(appointment)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      ></div>
                      <div>
                        <p className="font-medium text-sm">
                          {formatTime(appointment.time)} - {appointment.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.patients?.name || "Unknown Patient"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        appointment.status === "confirmed"
                          ? "border-success-500 text-success-500"
                          : appointment.status === "cancelled"
                          ? "border-error-500 text-error-500"
                          : appointment.status === "completed"
                          ? "border-primary text-primary"
                          : "border-warning-500 text-warning-500"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendar;