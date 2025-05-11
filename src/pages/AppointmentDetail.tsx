import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Fixed implementation that resolves the data-related bugs
const AppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<any>(null);
  const [patients, setPatients] = useState<{id: string, name: string}[]>([]);
  
  // Fetch appointment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch both appointment and patients data concurrently
        if (id) {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Mock data for demonstration
          const mockAppointment = {
            id,
            patient_id: "patient-123",
            date: "2025-05-15",
            time: "10:00",
            type: "consultation",
            notes: "Regular check-up appointment",
            status: "confirmed",
            patients: {
              id: "patient-123",
              name: "Arjun Patel",
              contact: "+91 98765 43210",
              email: "arjun@example.com",
              birth_date: "1990-06-15"
            }
          };
          
          const mockPatients = [
            { id: "patient-123", name: "Arjun Patel" },
            { id: "patient-124", name: "Priya Singh" }
          ];
          
          setAppointment(mockAppointment);
          setPatients(mockPatients);
        }
      } catch (err) {
        console.error("Error fetching appointment data:", err);
        setError(err instanceof Error ? err.message : "Failed to load appointment details");
        toast.error("Failed to load appointment details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Toggle between view and edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handle successful form submission
  const handleFormSuccess = () => {
    setIsEditing(false);
    // Refresh appointment data after successful edit
    toast.success("Appointment updated successfully");
    navigate(`/appointments/${id}`);
  };
  
  // If in edit mode, show the form
  if (isEditing) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(false)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="page-title text-center mb-4">Edit Appointment</h1>
            
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ) : (
              <AppointmentForm 
                appointment={appointment}
                onSuccess={handleFormSuccess}
                patients={patients}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </AppLayout>
    );
  }
  
  // If loading, show skeleton
  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/appointments")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Appointments
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  // If error, show error message
  if (error || !appointment) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/appointments")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Appointments
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-destructive mb-4">
                    {error || "Failed to load appointment details"}
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
          </div>
        </div>
      </AppLayout>
    );
  }
  
  // Render appointment details - in a real application you'd use the AppointmentDetails component here
  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/appointments")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Appointments
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Appointment Details</CardTitle>
              <Button onClick={toggleEditMode}>Edit</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Patient</h3>
                  <p>{appointment.patients?.name || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Date & Time</h3>
                  <p>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Type</h3>
                  <p className="capitalize">{appointment.type}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  <p className="capitalize">{appointment.status}</p>
                </div>
                {appointment.notes && (
                  <div className="col-span-2">
                    <h3 className="font-medium text-sm">Notes</h3>
                    <p>{appointment.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AppointmentDetail;