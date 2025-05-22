// src/services/patientService.ts
import api from './api';

export interface Patient {
  id: string;
  name: string;
  birth_date?: string;
  age?: number;
  gender?: string;
  contact: string;
  address?: string;
  email?: string;
  medical_history?: any;
  status: 'active' | 'inactive';
  last_visit?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PatientFormData {
  name: string;
  birth_date?: string;
  gender?: string;
  contact: string;
  address?: string;
  email?: string;
  medical_history?: any;
  status?: 'active' | 'inactive';
}

// Patient API functions
export const patientAPI = {
  getPatients: async (params?: {
    search?: string;
    status?: string;
  }): Promise<Patient[]> => {
    try {
      const response = await api.get("/patients", { params });

      // Handle pagination response format
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  },

  getPatientById: async (id: string): Promise<Patient> => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error);
      throw error;
    }
  },

  createPatient: async (data: PatientFormData): Promise<Patient> => {
    try {
      const response = await api.post("/patients", data);
      return response.data;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  },

  updatePatient: async (
    id: string,
    data: Partial<PatientFormData>
  ): Promise<Patient> => {
    try {
      const response = await api.put(`/patients/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating patient ${id}:`, error);
      throw error;
    }
  },

  deletePatient: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting patient ${id}:`, error);
      throw error;
    }
  },

  storePatientMedicalDocument: async (
    id: string,
    analysis_report: string
  ): Promise<{ message: string }> => {
    try {
      console.log(`Analysis Report: ${analysis_report}`);
      const response = await api.post(`/patients/store-report/${id}`, {
        analysis_report: analysis_report,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error storing patient medical document ${id}:`,
        error.message
      );
      throw error;
    }
  },

  // Get patient appointments
  getPatientAppointments: async (id: string): Promise<any[]> => {
    try {
      const response = await api.get(`/patients/${id}/appointments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for patient ${id}:`, error);
      throw error;
    }
  },

  // Get patient medical records
  getPatientMedicalRecords: async (id: string): Promise<any[]> => {
    try {
      const response = await api.get(`/patients/${id}/medical-records`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching medical records for patient ${id}:`, error);
      throw error;
    }
  },

  // Get patient invoices
  getPatientInvoices: async (id: string): Promise<any[]> => {
    try {
      const response = await api.get(`/patients/${id}/invoices`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoices for patient ${id}:`, error);
      throw error;
    }
  },
};