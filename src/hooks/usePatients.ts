// src/hooks/usePatients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientAPI, PatientFormData, Patient } from '@/services/patientService';
import { toast } from 'sonner';

// Hook to fetch all patients with optional filtering
export const usePatients = (params?: {
  search?: string;
  status?: string;
  doctor_id?: number;
}) => {
  if (!params) {
    params.doctor_id = 3;
  } else {
    params = {
      doctor_id: 3,
    };
  }
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => patientAPI.getPatients(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a specific patient by ID
export const usePatient = (id?: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => id ? patientAPI.getPatientById(id) : Promise.resolve(null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run if ID is provided
  });
};

// Hook to fetch patient appointments
export const usePatientAppointments = (id?: string) => {
  return useQuery({
    queryKey: ['patient', id, 'appointments'],
    queryFn: () => id ? patientAPI.getPatientAppointments(id) : Promise.resolve([]),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run if ID is provided
  });
};

// Hook to fetch patient medical records
export const usePatientMedicalRecords = (id?: string) => {
  return useQuery({
    queryKey: ['patient', id, 'medical-records'],
    queryFn: () => id ? patientAPI.getPatientMedicalRecords(id) : Promise.resolve([]),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run if ID is provided
  });
};

// Hook to fetch patient invoices
export const usePatientInvoices = (id?: string) => {
  return useQuery({
    queryKey: ['patient', id, 'invoices'],
    queryFn: () => id ? patientAPI.getPatientInvoices(id) : Promise.resolve([]),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run if ID is provided
  });
};

// Hook for creating a new patient
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PatientFormData) => patientAPI.createPatient(data),
    onSuccess: (data) => {
      toast.success('Patient created successfully');
      
      // Invalidate the patients query to update the list
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: any) => {
      console.error('Error creating patient:', error);
      toast.error(error?.response?.data?.message || 'Failed to create patient');
    },
  });
};

// Hook for updating a patient
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, patientData }: { id: string; patientData: Partial<PatientFormData> }) => 
      patientAPI.updatePatient(id, patientData),
    onSuccess: (data, variables) => {
      toast.success('Patient updated successfully');
      
      // Invalidate relevant queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating patient:', error);
      toast.error(error?.response?.data?.message || 'Failed to update patient');
    },
  });
};

// Hook for deleting a patient
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => patientAPI.deletePatient(id),
    onSuccess: () => {
      toast.success('Patient deleted successfully');
      
      // Invalidate the patients query to update the list
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: any) => {
      console.error('Error deleting patient:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete patient');
    },
  });
};