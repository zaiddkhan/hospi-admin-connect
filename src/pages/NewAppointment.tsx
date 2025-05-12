
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, FileText } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { patientsAPI } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { format, isValid } from "date-fns";

const NewAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const createAppointment = useCreateAppointment();
  
  // Extract query params (for pre-filling form)
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("patient_id");
  const dateParam = queryParams.get("date");
  
  // Validate date parameter
  const parsedDate = dateParam ? new Date(dateParam) : new Date();
  const isValidDate = dateParam ? isValid(parsedDate) : true;
  
  // Fetch patients for the dropdown
  const { 
    data: patientsData, 
    isLoading: patientsLoading,
    error: patientsError
  } = useQuery({
    queryKey: ["patients"],
    queryFn: () => patientsAPI.getPatients(),
  });
  
  // Fetch specific patient data if patientId is provided
  const {
    data: patientData,
    isLoading: patientLoading,
    error: patientError
  } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientsAPI.getPatientById(patientId as string),
    enabled: !!patientId
  });
  
  // Format patients for the form using useMemo to avoid recreating this list unnecessarily
  const patients = useMemo(() => {
    const patientsList = patientsData 
      ? patientsData.map((patient) => ({
          id: patient.id,
          name: patient.name
        }))
      : [];
    
    // Add the specific patient if it's not already in the list
    if (patientData && !patientsList.some(p => p.id === patientData.id)) {
      return [...patientsList, {
        id: patientData.id,
        name: patientData.name
      }];
    }
    
    return patientsList;
  }, [patientsData, patientData]);
  
  // Handle form submission
  const handleSubmit = (formData) => {
    createAppointment.mutate(formData, {
      onSuccess: () => {
        navigate("/appointments");
      }
    });
  };

  // Handle successful form submission
  const handleSuccess = () => {
    navigate("/appointments");
  };
  
  // Start consultation instead of normal appointment
  const handleStartConsultation = () => {
    if (patientId) {
      window.open(`https://hospiagent.vercel.app/consultation/${patientId}`, "_blank");
    } else {
      window.open("https://hospiagent.vercel.app/consultation/new", "_blank");
    }
  };
  
  // Check if there are any loading or error states
  const isLoading = patientsLoading || patientLoading;
  const error = patientsError || patientError;
  
  // Build appointment default values if applicable
  const appointmentDefaults = (patientId || dateParam) ? {
    id: "",
    patient_id: patientId || "",
    date: isValidDate ? format(parsedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    time: "09:00",
    type: "consultation",
    status: "pending",
  } : undefined;

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/appointments")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Appointments
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartConsultation}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Start Online Consultation
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="page-title text-center mb-4">Schedule New Appointment</h1>
          
          {/* Date parameter error */}
          {dateParam && !isValidDate && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Invalid Date</AlertTitle>
              <AlertDescription>
                The provided date parameter is invalid. Using today's date instead.
              </AlertDescription>
            </Alert>
          )}
          
          {/* API Errors */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.message || "Failed to load patient data. Please try again."}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Patient context if scheduling for a specific patient */}
          {patientId && patientData && (
            <Alert className="mb-4">
              <AlertTitle>Scheduling for {patientData.name}</AlertTitle>
              <AlertDescription>
                {patientData.contact && <span>Contact: {patientData.contact}</span>}
                {patientData.birth_date && (
                  <span className="block">
                    Birth Date: {new Date(patientData.birth_date).toLocaleDateString()}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Show loading state only when first loading a specific patient */}
          {(patientLoading && patientId) ? (
            <div className="p-8 flex justify-center">
              <Skeleton className="h-64 w-full max-w-md" />
            </div>
          ) : (
            <AppointmentForm
              onSubmit={handleSubmit}
              onSuccess={handleSuccess}
              patients={patients}
              isLoading={isLoading}
              isSubmitting={createAppointment.isPending}
              appointment={null}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default NewAppointment;
