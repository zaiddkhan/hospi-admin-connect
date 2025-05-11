import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import AppointmentDetails from "@/components/appointments/AppointmentDetails";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";
import { useAppointment } from "@/hooks/useAppointments";

const AppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get appointment data
  const { 
    data: appointment, 
    isLoading, 
    error 
  } = useAppointment(id as string);

  // Toggle between view and edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handle successful form submission
  const handleFormSuccess = () => {
    setIsEditing(false);
  };

  // Mock patients data (in a real app, this would come from an API)
  const patients = appointment?.patients 
    ? [{ id: appointment.patients.id, name: appointment.patients.name }]
    : [];

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
          {isEditing ? (
            <AppointmentForm 
              appointment={appointment}
              onSuccess={handleFormSuccess}
              patients={patients}
              isLoading={isLoading}
            />
          ) : (
            <AppointmentDetails 
              appointment={appointment}
              isLoading={isLoading}
              error={error}
              onEdit={toggleEditMode}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AppointmentDetail;