import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, FileText } from "lucide-react";
import { Appointment, AppointmentFormData } from "@/services/appointmentService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useCreateAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import { useNavigate } from "react-router-dom";

// Time slots for appointments (30 min intervals from 9am to 5pm)
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

// Appointment types
const APPOINTMENT_TYPES = [
  { value: "consultation", label: "Consultation" },
  { value: "follow-up", label: "Follow-up" },
  { value: "procedure", label: "Procedure" },
  { value: "emergency", label: "Emergency" },
  { value: "check-up", label: "Check-up" }
];

// Validation schema for the form
const appointmentSchema = z.object({
  patient_id: z.string({ required_error: "Patient is required" }),
  date: z.date({ required_error: "Date is required" }),
  time: z.string({ required_error: "Time is required" }),
  type: z.string({ required_error: "Appointment type is required" }),
  notes: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).default("pending")
});

type FormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  appointment?: Appointment;
  onSuccess?: () => void;
  patients?: { id: string; name: string }[];
  isLoading?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSuccess,
  patients = [],
  isLoading = false
}) => {
  const navigate = useNavigate();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const [date, setDate] = useState<Date | undefined>(
    appointment?.date ? new Date(appointment.date) : new Date()
  );

  // Initialize form with default values or existing appointment data
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: appointment?.patient_id || "",
      date: appointment?.date ? new Date(appointment.date) : new Date(),
      time: appointment?.time || "09:00",
      type: appointment?.type || "consultation",
      notes: appointment?.notes || "",
      status: appointment?.status || "pending"
    }
  });

  // Watch form values for updates
  const selectedDate = watch("date");
  const selectedTime = watch("time");
  const selectedType = watch("type");
  const selectedStatus = watch("status");

  // Update form values when date changes
  useEffect(() => {
    if (date) {
      setValue("date", date);
    }
  }, [date, setValue]);

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      // Format the data
      const formattedData: AppointmentFormData = {
        patient_id: data.patient_id,
        date: format(data.date, "yyyy-MM-dd"),
        time: data.time,
        type: data.type,
        notes: data.notes,
        status: data.status
      };

      // Create or update appointment
      if (appointment?.id) {
        // Update existing appointment
        await updateAppointment.mutateAsync({
          id: appointment.id,
          data: formattedData
        });
      } else {
        // Create new appointment
        await createAppointment.mutateAsync(formattedData);
      }

      // Call success callback or navigate back
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/appointments");
      }
    } catch (error) {
      // Error is handled by the mutation hooks
      console.error("Form submission error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {appointment?.id ? "Edit Appointment" : "Schedule Appointment"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient_id">Patient</Label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Select
                defaultValue={appointment?.patient_id}
                onValueChange={(value) => setValue("patient_id", value)}
              >
                <SelectTrigger id="patient_id" className="w-full">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.patient_id && (
              <p className="text-xs text-error-500 mt-1">{errors.patient_id.message}</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-xs text-error-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Select
                defaultValue={selectedTime}
                onValueChange={(value) => setValue("time", value)}
              >
                <SelectTrigger id="time" className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {format(new Date(`2000-01-01T${slot}`), "hh:mm a")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.time && (
              <p className="text-xs text-error-500 mt-1">{errors.time.message}</p>
            )}
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Select
              defaultValue={selectedType}
              onValueChange={(value) => setValue("type", value)}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {APPOINTMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-error-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Appointment Status (only for editing) */}
          {appointment?.id && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={selectedStatus}
                onValueChange={(value) => 
                  setValue("status", value as "pending" | "confirmed" | "cancelled" | "completed")
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-error-500 mt-1">{errors.status.message}</p>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-2" />
              <Textarea
                id="notes"
                placeholder="Add any special instructions or notes..."
                className="min-h-[80px]"
                {...register("notes")}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate("/appointments")}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || createAppointment.isPending || updateAppointment.isPending}
          >
            {(isSubmitting || createAppointment.isPending || updateAppointment.isPending) 
              ? "Saving..." 
              : appointment?.id 
                ? "Update Appointment" 
                : "Schedule Appointment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AppointmentForm;