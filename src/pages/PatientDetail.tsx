import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PatientDetails from "@/components/patients/PatientDetails";
import PatientForm from "@/components/patients/PatientForm";
import { Button } from "@/components/ui/button";
import { usePatient, useUpdatePatient, useDeletePatient } from "@/hooks/usePatients";
import { PatientFormData } from "@/services/patientService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch patient data
  const { 
    data: patient, 
    isLoading, 
    error,
    refetch 
  } = usePatient(id);
  console.log("Patient Data: ", patient);
  // Hooks for mutations
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();

  // Toggle between view and edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle patient update
  const handleUpdate = (data: PatientFormData) => {
    if (!id) return;
    
    updatePatient.mutate(
      { id, patientData: data },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetch(); // Refresh patient data
        }
      }
    );
  };

  // Handle patient deletion
  const handleDelete = () => {
    if (!id) return;
    
    setIsDeleteDialogOpen(false);
    
    deletePatient.mutate(id, {
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
          {isEditing ? (
            <>
              <h1 className="page-title text-center mb-4">Edit Patient</h1>
              <PatientForm
                patient={patient}
                onSubmit={handleUpdate}
                isLoading={updatePatient.isPending}
              />
            </>
          ) : (
            <>
              <h1 className="page-title text-center mb-4">Patient Details</h1>
              <PatientDetails
                patient={patient}
                isLoading={isLoading}
                error={error}
                onEdit={handleEdit}
                onDelete={() => setIsDeleteDialogOpen(true)}
              />
            </>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient
              record and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default PatientDetail;