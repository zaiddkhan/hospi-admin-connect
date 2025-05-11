import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PatientForm from "@/components/patients/PatientForm";
import { Button } from "@/components/ui/button";
import { PatientFormData } from "@/services/patientService";
import { useCreatePatient } from "@/hooks/usePatients";

const NewPatient = () => {
  const navigate = useNavigate();
  const createPatient = useCreatePatient();
  
  // Handle form submission
  const handleSubmit = (data: PatientFormData) => {
    createPatient.mutate(data, {
      onSuccess: () => {
        navigate("/patients");
      }
    });
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/patients")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Patients
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="page-title text-center mb-4">Add New Patient</h1>
          <PatientForm
            onSubmit={handleSubmit}
            isLoading={createPatient.isPending}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewPatient;