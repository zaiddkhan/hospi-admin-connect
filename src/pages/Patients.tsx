import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Upload } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PatientList from "@/components/patients/PatientList";
import { Button } from "@/components/ui/button";
import { usePatients, useDeletePatient } from "@/hooks/usePatients";
import { toast } from "sonner";

const Patients = () => {
  const navigate = useNavigate();
  
  // Fetch patients data
  const { data: patients, isLoading, error } = usePatients();
  
  // Hook for deleting patients
  const deletePatient = useDeletePatient();

  // Handle adding a new patient
  const handleAddPatient = () => {
    navigate("/patients/new");
  };

  // Handle patient deletion
  const handleDeletePatient = (id: string) => {
    deletePatient.mutate(id);
  };

  // Handle export to CSV
  const handleExport = () => {
    toast.info("Export functionality will be implemented soon");
  };

  // Handle import from CSV
  const handleImport = () => {
    toast.info("Import functionality will be implemented soon");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Patients</h1>
            <p className="text-muted-foreground">Manage your patient information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" /> Import
            </Button>
            <Button size="sm" onClick={handleAddPatient}>
              <Plus className="h-4 w-4 mr-2" /> Add Patient
            </Button>
          </div>
        </div>

        <PatientList
          patients={patients || []}
          isLoading={isLoading}
          error={error}
          onDelete={handleDeletePatient}
        />
      </div>
    </AppLayout>
  );
};

export default Patients;