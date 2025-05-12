import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon, Clock, User, FileText } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

// Define TypeScript interfaces for better type safety
interface Patient {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  patients?: {
    id: string;
    name: string;
    contact?: string;
    email?: string;
    birth_date?: string;
    gender?: string;
  };
}

interface AppointmentFormProps {
  appointment?: Appointment;
  onSubmit?: (data: any) => void;
  onSuccess?: () => void;
  patients?: Patient[];
  isLoading?: boolean;
  isSubmitting?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSubmit,
  onSuccess,
  patients = [],
  isLoading = false,
  isSubmitting = false
}) => {
  const navigate = useNavigate();
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  
  // Parse the appointment date safely, falling back to today if invalid
  const getInitialDate = (): Date => {
    if (!appointment?.date) return new Date();
    
    try {
      const parsedDate = new Date(appointment.date);
      return isValid(parsedDate) ? parsedDate : new Date();
    } catch (e) {
      setDateError("Invalid appointment date provided. Using today's date instead.");
      return new Date();
    }
  };
  
  // Initialize the date state
  const [date, setDate] = useState<Date | undefined>(getInitialDate());

  // Initialize form with default values or existing appointment data
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: appointment?.patient_id || "",
      date: getInitialDate(),
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
  const patientId = watch("patient_id");

  // Update form values when date changes
  useEffect(() => {
    if (date) {
      setValue("date", date);
    }
  }, [date, setValue]);

  // Form submission handler
  const handleFormSubmit = async (data: FormValues) => {
    // Use external isSubmitting state if provided, otherwise use internal state
    const submittingState = isSubmitting !== undefined ? isSubmitting : internalSubmitting;
    
    if (submittingState) return; // Prevent double submission
    
    try {
      if (isSubmitting === undefined) setInternalSubmitting(true);
      
      // Format the data
      const formattedData = {
        patient_id: data.patient_id,
        date: format(data.date, "yyyy-MM-dd"),
        time: data.time,
        type: data.type,
        notes: data.notes || undefined,
        status: data.status
      };

      if (onSubmit) {
        // Use provided onSubmit handler
        await onSubmit(formattedData);
      } else {
        // If no onSubmit provided, handle internally
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/appointments");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      if (isSubmitting === undefined) setInternalSubmitting(false);
    }
  };

  // Validate the selected time slot to avoid past times for today's appointments
  const isTimeSlotValid = (time: string): boolean => {
    if (!date) return true;
    
    // Only validate for today
    const today = new Date();
    const selectedDate = new Date(date);
    
    if (selectedDate.getDate() !== today.getDate() || 
        selectedDate.getMonth() !== today.getMonth() || 
        selectedDate.getFullYear() !== today.getFullYear()) {
      return true;
    }
    
    // For today, check if the time is in the future
    const [hours, minutes] = time.split(':').map(Number);
    const currentHours = today.getHours();
    const currentMinutes = today.getMinutes();
    
    if (hours < currentHours) return false;
    if (hours === currentHours && minutes <= currentMinutes) return false;
    
    return true;
  };

  // Generate available time slots based on the selected date
  const getAvailableTimeSlots = (): string[] => {
    if (!date) return TIME_SLOTS;
    
    return TIME_SLOTS.filter(time => isTimeSlotValid(time));
  };

  const availableTimeSlots = getAvailableTimeSlots();
  
  // Determine if the form is submitting (external or internal state)
  const formIsSubmitting = isSubmitting || internalSubmitting;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {appointment?.id ? "Edit Appointment" : "Schedule Appointment"}
        </CardTitle>
      </CardHeader>
      
      {dateError && (
        <Alert className="mx-6 mt-0 mb-4">
          <AlertDescription>{dateError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient_id">Patient</Label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Select
                value={patientId}
                onValueChange={(value) => setValue("patient_id", value)}
                disabled={isLoading || formIsSubmitting}
              >
                <SelectTrigger id="patient_id" className="w-full">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.length === 0 ? (
                    <SelectItem value="no-patients" disabled>
                      No patients available
                    </SelectItem>
                  ) : (
                    patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))
                  )}
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
                  disabled={formIsSubmitting}
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
                value={selectedTime}
                onValueChange={(value) => setValue("time", value)}
                disabled={formIsSubmitting}
              >
                <SelectTrigger id="time" className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.length === 0 ? (
                    <SelectItem value="no-slots" disabled>
                      No available slots for today
                    </SelectItem>
                  ) : (
                    availableTimeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {format(new Date(`2000-01-01T${slot}`), "h:mm a")}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {errors.time && (
              <p className="text-xs text-error-500 mt-1">{errors.time.message}</p>
            )}
            {selectedDate && 
             format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && 
             !isTimeSlotValid(selectedTime) && (
              <p className="text-xs text-error-500 mt-1">
                Please select a future time slot for today
              </p>
            )}
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue("type", value)}
              disabled={formIsSubmitting}
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
                value={selectedStatus}
                onValueChange={(value) => 
                  setValue("status", value as "pending" | "confirmed" | "cancelled" | "completed")
                }
                disabled={formIsSubmitting}
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
            <Label htmlFor="notes">Notes (optional)</Label>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-2" />
              <Textarea
                id="notes"
                placeholder="Add any special instructions or notes..."
                className="min-h-[80px]"
                {...register("notes")}
                disabled={formIsSubmitting}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate("/appointments")}
            disabled={formIsSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={formIsSubmitting}
          >
            {formIsSubmitting 
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