import React from "react";
import { format, differenceInYears, isValid } from "date-fns";
import {
  Calendar,
  User,
  Phone,
  Mail,
  Home,
  FileText,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Patient } from "@/services/patientService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { usePatientAppointments } from "@/hooks/usePatients";
import DocAnalysis from "@/pages/DocAnalaysis";

interface PatientDetailsProps {
  patient?: Patient;
  isLoading: boolean;
  error: any;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient,
  isLoading,
  error,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  // Fetch patient appointments
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = usePatientAppointments(patient?.id);

  // Calculate patient age from birth_date
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    try {
      const date = new Date(birthDate);
      if (!isValid(date)) return null;
      return differenceInYears(new Date(), date);
    } catch (error) {
      return null;
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="border-success-500 text-success-500">
            Confirmed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="border-error-500 text-error-500">Cancelled</Badge>
        );
      case "completed":
        return <Badge className="bg-primary">Completed</Badge>;
      default:
        return (
          <Badge className="border-warning-500 text-warning-500">Pending</Badge>
        );
    }
  };

  // Handle scheduling new appointment for this patient
  const handleScheduleAppointment = () => {
    if (patient) {
      navigate(`/appointments/new?patient_id=${patient.id}`);
    }
  };

  // Handle starting consultation for this patient
  const handleStartConsultation = () => {
    if (patient) {
      window.open(
        `https://hospiscribe.minusonetoten.com/consultation/${patient.id}`,
        "_blank"
      );
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

  if (error || !patient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-error-500 mb-4">
              {error?.message || "Failed to load patient details"}
            </p>
            <Button onClick={() => navigate("/patients")} variant="outline">
              Back to Patients
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>{patient.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            ID: {patient.id.substring(0, 8)}...
          </p>
        </div>
        <Badge
          variant={patient.status === "active" ? "default" : "outline"}
          className={patient.status === "active" ? "bg-success-500" : ""}
        >
          {patient.status === "active" ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Patient Details</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Full Name</p>
                    <p>{patient.name}</p>
                  </div>
                </div>

                {patient.birth_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Age / Date of Birth</p>
                      <p>
                        {calculateAge(patient.birth_date)
                          ? `${calculateAge(
                              patient.birth_date
                            )} years (${format(
                              new Date(patient.birth_date),
                              "PP"
                            )})`
                          : format(new Date(patient.birth_date), "PP")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p>{patient.contact}</p>
                  </div>
                </div>

                {patient.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p>{patient.email}</p>
                    </div>
                  </div>
                )}

                {patient.gender && (
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Gender</p>
                      <p>{patient.gender}</p>
                    </div>
                  </div>
                )}

                {patient.last_visit && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Last Visit</p>
                      <p>{format(new Date(patient.last_visit), "PP")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Address */}
            {patient.address ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Address</h3>
                <div className="flex items-start gap-2">
                  <Home className="h-5 w-5 text-primary mt-0.5" />
                  <p>{patient.address}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Address</h3>
                <p className="text-muted-foreground">No address recorded</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="appointments">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Appointment History</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={handleStartConsultation}
                    size="sm"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Start Consultation
                  </Button>
                  <Button onClick={handleScheduleAppointment} size="sm">
                    Schedule Appointment
                  </Button>
                </div>
              </div>

              {appointmentsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {appointmentsError.message || "Failed to load appointments"}
                  </AlertDescription>
                </Alert>
              ) : appointmentsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : appointments && appointments.length > 0 ? (
                <div className="space-y-2">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
                      onClick={() =>
                        navigate(`/appointments/${appointment.id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <p className="font-medium">
                            {format(new Date(appointment.date), "PP")} at{" "}
                            {format(
                              new Date(`2000-01-01T${appointment.time}`),
                              "p"
                            )}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          {appointment.type} - {appointment.status}
                        </p>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-secondary/50 rounded-md">
                  <p className="text-muted-foreground mb-2">
                    No appointment history found
                  </p>
                  <Button
                    onClick={handleScheduleAppointment}
                    variant="outline"
                    size="sm"
                  >
                    Schedule First Appointment
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <DocAnalysis patientId={patient.id} />
          </TabsContent>

          <TabsContent value="medical">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Medical History</h3>
                <Button onClick={onEdit} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Medical History
                </Button>
              </div>

              {patient.medical_history ? (
                <div className="bg-secondary/50 p-4 rounded-md">
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="whitespace-pre-wrap">
                        {patient.medical_history}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-secondary/50 rounded-md">
                  <p className="text-muted-foreground">
                    No medical history recorded
                  </p>
                  <Button
                    onClick={onEdit}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Add Medical History
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="space-x-2">
          <Button onClick={handleScheduleAppointment} variant="default">
            <CheckCircle className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
          <Button onClick={handleStartConsultation} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Start Consultation
          </Button>
        </div>

        <div className="space-x-2">
          <Button onClick={onEdit} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
          <Button onClick={onDelete} variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientDetails;
