import React from "react";
import { format, parseISO, differenceInYears } from "date-fns";
import { Calendar, Clock, User, FileText, Phone, Mail, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { Appointment } from "@/services/appointmentService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  useConfirmAppointment, 
  useCancelAppointment, 
  useCompleteAppointment, 
  useDeleteAppointment 
} from "@/hooks/useAppointments";
import { useNavigate } from "react-router-dom";

interface AppointmentDetailsProps {
  appointment?: Appointment;
  isLoading: boolean;
  error: any;
  onEdit?: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  isLoading,
  error,
  onEdit,
}) => {
  const navigate = useNavigate();
  const confirmAppointment = useConfirmAppointment();
  const cancelAppointment = useCancelAppointment();
  const completeAppointment = useCompleteAppointment();
  const deleteAppointment = useDeleteAppointment();

  // Handle appointment confirmation
  const handleConfirm = () => {
    if (appointment) {
      confirmAppointment.mutate(appointment.id);
    }
  };

  // Handle appointment cancellation
  const handleCancel = () => {
    if (appointment && window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointment.mutate(appointment.id);
    }
  };

  // Handle marking appointment as completed
  const handleComplete = () => {
    if (appointment) {
      completeAppointment.mutate(appointment.id);
    }
  };

  // Handle appointment deletion
  const handleDelete = () => {
    if (appointment && window.confirm("Are you sure you want to delete this appointment? This action cannot be undone.")) {
      deleteAppointment.mutate(appointment.id, {
        onSuccess: () => {
          navigate("/appointments");
        }
      });
    }
  };

  // Calculate patient age from birth_date
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    try {
      const date = parseISO(birthDate);
      return differenceInYears(new Date(), date);
    } catch (error) {
      return null;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success-500">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-error-500">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-primary">Completed</Badge>;
      default:
        return <Badge className="bg-warning-500">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (error || !appointment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-error-500 mb-4">
              {error?.message || "Failed to load appointment details"}
            </p>
            <Button
              onClick={() => navigate("/appointments")}
              variant="outline"
            >
              Back to Appointments
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Appointment Details</CardTitle>
        <div className="flex items-center gap-2">
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Appointment Time Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Schedule Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p>{format(new Date(appointment.date), "PPPP")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p>{format(new Date(`2000-01-01T${appointment.time}`), "h:mm a")}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Patient Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Name</p>
                <p>{appointment.patients?.name || "Unknown"}</p>
              </div>
            </div>
            {appointment.patients?.contact && (
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p>{appointment.patients.contact}</p>
                </div>
              </div>
            )}
            {appointment.patients?.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p>{appointment.patients.email}</p>
                </div>
              </div>
            )}
            {appointment.patients?.birth_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Age</p>
                  <p>
                    {calculateAge(appointment.patients.birth_date)} years
                    {appointment.patients.gender && ` (${appointment.patients.gender})`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Appointment Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appointment Details</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm font-medium">Type</p>
              <p className="capitalize">{appointment.type}</p>
            </div>
            {appointment.notes && (
              <div>
                <p className="text-sm font-medium">Notes</p>
                <div className="bg-secondary p-3 rounded-md mt-1">
                  <p className="whitespace-pre-wrap">{appointment.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="space-x-2">
          {appointment.status === "pending" && (
            <Button onClick={handleConfirm} variant="default">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm
            </Button>
          )}
          {appointment.status === "confirmed" && (
            <Button onClick={handleComplete} variant="default">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          )}
          {(appointment.status === "pending" || appointment.status === "confirmed") && (
            <Button onClick={handleCancel} variant="outline">
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
        <div className="space-x-2">
          <Button onClick={onEdit} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AppointmentDetails;