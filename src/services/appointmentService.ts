// src/services/appointmentService.ts
import api from './api';

export interface Appointment {
  id: string;
  patient_id: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  patients?: {
    id: string;
    name: string;
    contact?: string;
    email?: string;
    birth_date?: string;
    gender?: string;
  };
}

export interface AppointmentFormData {
  patient_id: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

// Appointments API functions
export const appointmentAPI = {
  getAppointments: async (params?: { date?: string; status?: string; patient_id?: string }): Promise<Appointment[]> => {
    try {
      const response = await api.get('/appointments', { params });
      
      // Handle pagination response format
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  getTodayAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get('/appointments/today');
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      throw error;
    }
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  },

  createAppointment: async (data: AppointmentFormData): Promise<Appointment> => {
    try {
      const response = await api.post('/appointments', data);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  updateAppointment: async (id: string, data: Partial<AppointmentFormData>): Promise<Appointment> => {
    try {
      const response = await api.put(`/appointments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${id}:`, error);
      throw error;
    }
  },

  deleteAppointment: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting appointment ${id}:`, error);
      throw error;
    }
  },
  
  // Additional methods for specific appointment operations
  confirmAppointment: async (id: string): Promise<Appointment> => {
    try {
      return appointmentAPI.updateAppointment(id, { status: 'confirmed' });
    } catch (error) {
      console.error(`Error confirming appointment ${id}:`, error);
      throw error;
    }
  },
  
  cancelAppointment: async (id: string): Promise<Appointment> => {
    try {
      return appointmentAPI.updateAppointment(id, { status: 'cancelled' });
    } catch (error) {
      console.error(`Error cancelling appointment ${id}:`, error);
      throw error;
    }
  },
  
  completeAppointment: async (id: string): Promise<Appointment> => {
    try {
      return appointmentAPI.updateAppointment(id, { status: 'completed' });
    } catch (error) {
      console.error(`Error completing appointment ${id}:`, error);
      throw error;
    }
  },
  
  // Get appointments for a specific patient
  getPatientAppointments: async (patientId: string): Promise<Appointment[]> => {
    try {
      const response = await api.get(`/patients/${patientId}/appointments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for patient ${patientId}:`, error);
      throw error;
    }
  },
  
  // Get appointments for a specific date range
  getAppointmentsByDateRange: async (startDate: string, endDate: string): Promise<Appointment[]> => {
    try {
      const response = await api.get('/appointments', { 
        params: { start_date: startDate, end_date: endDate } 
      });
      
      // Handle pagination response format
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for date range ${startDate} to ${endDate}:`, error);
      throw error;
    }
  },
  
  // Get appointment statistics
  getAppointmentStats: async (period?: 'day' | 'week' | 'month' | 'year'): Promise<any> => {
    try {
      const response = await api.get('/appointments/stats', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment statistics:', error);
      throw error;
    }
  }
};