import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { patientsAPI } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NewAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract any query params (for pre-filling form)
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("patient_id");
  const dateParam = queryParams.get("date");
  
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
  
  // Format patients for the form
  const patients = patientsData 
    ? patientsData.map((patient) => ({
        id: patient.id,
        name: patient.name
      }))
    : [];
  
  // Add the single patient to the list if we have loaded a specific patient
  useEffect(() => {
    if (patientData && !patientsData?.some(p => p.id === patientData.id)) {
      patients.push({
        id: patientData.id,
        name: patientData.name
      });
    }
  }, [patientData, patientsData]);
  
  // Handle successful form submission
  const handleSuccess = () => {
    navigate("/appointments");
  };

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
          <h1 className="page-title text-center mb-4">Schedule New Appointment</h1>
          
          {/* Error State */}
          {(patientsError || patientError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {patientsError?.message || patientError?.message || "Failed to load patient data. Please try again."}
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
          
          {/* Loading State */}
          {(patientsLoading || patientLoading) && patientId ? (
            <div className="p-8 flex justify-center">
              <Skeleton className="h-64 w-full max-w-md" />
            </div>
          ) : (
            <AppointmentForm
              onSuccess={handleSuccess}
              patients={patients}
              isLoading={patientsLoading || patientLoading}
              // If we have pre-filled data from query params
              appointment={patientId || dateParam ? {
                id: "",
                patient_id: patientId || "",
                date: dateParam ? new Date(dateParam).toISOString() : new Date().toISOString(),
                time: "09:00",
                type: "consultation",
                status: "pending",
              } : undefined}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default NewAppointment;