import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Plus, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePatients } from "@/hooks/usePatients";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useNavigate } from "react-router-dom";

const AppointmentScheduler = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();``
  const [patientId, setPatientId] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch patients for the dropdown
  const { data: patients, isLoading: patientsLoading } = usePatients();
  
  // Mutation hook for creating appointments
  const createAppointment = useCreateAppointment();

  // Validate the form
  const isFormValid = date && patientId && appointmentType && time;

  const handleScheduleAppointment = () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("reached 123")

    // Format the appointment data
    const appointmentData = {
      patient_id: patientId,
      date: format(date as Date, "yyyy-MM-dd"),
      time: time,
      type: appointmentType,
      notes: notes || undefined,
    };

    // Submit the appointment
    createAppointment.mutate(appointmentData, {
      onSuccess: () => {
        // Reset form on success
        setDate(undefined);
        setPatientId("");
        setAppointmentType("");
        setTime("");
        setNotes("");
        
        // Navigate to appointments page or stay on current page
        // navigate("/appointments");
      }
    });
  };

  // Get today's date for min date in calendar
  const today = new Date();

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-lg">Schedule Appointment</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="patient" className="text-sm">Patient</Label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Select value={patientId} onValueChange={setPatientId} disabled={patientsLoading}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patientsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading patients...
                    </SelectItem>
                  ) : patients && patients.length > 0 ? (
                    patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-patients" disabled>
                      No patients found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="date" className="text-sm">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-9",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-2 pointer-events-auto"
                  disabled={(date) => date < today}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label htmlFor="time" className="text-sm">Time</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="09:30">09:30 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="10:30">10:30 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="11:30">11:30 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="12:30">12:30 PM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="14:30">02:30 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="15:30">03:30 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                  <SelectItem value="16:30">04:30 PM</SelectItem>
                  <SelectItem value="17:00">05:00 PM</SelectItem>
                  <SelectItem value="17:30">05:30 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="type" className="text-sm">Appointment Type</Label>
            <Select value={appointmentType} onValueChange={setAppointmentType}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="new-patient">New Patient</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes" className="text-sm">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="Add any special instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-9"
            />
          </div>

          <Button 
            className="w-full mt-3" 
            onClick={handleScheduleAppointment}
            size="sm"
            disabled={!isFormValid || createAppointment.isPending}
          >
            {createAppointment.isPending ? (
              "Scheduling..."
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> Schedule Appointment
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentScheduler;