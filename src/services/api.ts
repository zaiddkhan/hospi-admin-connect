import axios from 'axios';

// Create an axios instance with default config
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateUserProfile: async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
};

// Patients API
export const patientsAPI = {
  getPatients: async (search?: string) => {
    const response = await api.get('/patients', { params: { search } });
    return response.data;
  },
  getPatientById: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  createPatient: async (patientData: any) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },
  updatePatient: async (id: string, patientData: any) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },
  deletePatient: async (id: string) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

// Appointments API
export const appointmentsAPI = {
  getAppointments: async (date?: string, status?: string) => {
    const response = await api.get('/appointments', { params: { date, status } });
    return response.data;
  },
  getTodayAppointments: async () => {
    const response = await api.get('/appointments/today');
    return response.data;
  },
  getAppointmentById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  createAppointment: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  updateAppointment: async (id: string, appointmentData: any) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  deleteAppointment: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

// Inventory API
export const inventoryAPI = {
  getInventoryItems: async (search?: string, category?: string) => {
    const response = await api.get('/inventory', { params: { search, category } });
    return response.data;
  },
  getInventoryAlerts: async () => {
    const response = await api.get('/inventory/alerts');
    return response.data;
  },
  getInventoryItemById: async (id: string) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },
  createInventoryItem: async (itemData: any) => {
    const response = await api.post('/inventory', itemData);
    return response.data;
  },
  updateInventoryItem: async (id: string, itemData: any) => {
    const response = await api.put(`/inventory/${id}`, itemData);
    return response.data;
  },
  updateInventoryStock: async (id: string, quantity: number, operation: 'add' | 'subtract') => {
    const response = await api.put(`/inventory/${id}/stock`, { quantity, operation });
    return response.data;
  },
  deleteInventoryItem: async (id: string) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
};

// Billing API
export const billingAPI = {
  getInvoices: async (params?: any) => {
    const response = await api.get('/billing/invoices', { params });
    return response.data;
  },
  getInvoiceById: async (id: string) => {
    const response = await api.get(`/billing/invoices/${id}`);
    return response.data;
  },
  createInvoice: async (invoiceData: any) => {
    const response = await api.post('/billing/invoices', invoiceData);
    return response.data;
  },
  updateInvoiceStatus: async (id: string, status: string) => {
    const response = await api.put(`/billing/invoices/${id}/status`, { status });
    return response.data;
  },
  getPaymentAnalytics: async (period?: string) => {
    const response = await api.get('/billing/analytics', { params: { period } });
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getAppointmentsOverview: async () => {
    const response = await api.get('/dashboard/appointments-overview');
    return response.data;
  },
  getRevenueChart: async () => {
    const response = await api.get('/dashboard/revenue-chart');
    return response.data;
  },
  getPatientAnalytics: async () => {
    const response = await api.get('/dashboard/patient-analytics');
    return response.data;
  },
};

export default api;
