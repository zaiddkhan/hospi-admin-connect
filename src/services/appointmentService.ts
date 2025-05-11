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
    contact: string;
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
  status?: string;
}

// Appointments API functions
export const appointmentAPI = {
  getAppointments: async (params?: { date?: string; status?: string }): Promise<Appointment[]> => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  getTodayAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments/today');
    return response.data;
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  createAppointment: async (data: AppointmentFormData): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  updateAppointment: async (id: string, data: Partial<AppointmentFormData>): Promise<Appointment> => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  deleteAppointment: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
  
  // Additional methods for specific appointment operations
  confirmAppointment: async (id: string): Promise<Appointment> => {
    return appointmentAPI.updateAppointment(id, { status: 'confirmed' });
  },
  
  cancelAppointment: async (id: string): Promise<Appointment> => {
    return appointmentAPI.updateAppointment(id, { status: 'cancelled' });
  },
  
  completeAppointment: async (id: string): Promise<Appointment> => {
    return appointmentAPI.updateAppointment(id, { status: 'completed' });
  },
  
  // Get appointments for a specific patient
  getPatientAppointments: async (patientId: string): Promise<Appointment[]> => {
    const response = await api.get(`/patients/${patientId}/appointments`);
    return response.data;
  },
  
  // Get appointments for a specific date range
  getAppointmentsByDateRange: async (startDate: string, endDate: string): Promise<Appointment[]> => {
    const response = await api.get('/appointments', { 
      params: { start_date: startDate, end_date: endDate } 
    });
    return response.data;
  },
  
  // Get appointment statistics
  getAppointmentStats: async (period?: 'day' | 'week' | 'month' | 'year'): Promise<any> => {
    const response = await api.get('/appointments/stats', { params: { period } });
    return response.data;
  }
};