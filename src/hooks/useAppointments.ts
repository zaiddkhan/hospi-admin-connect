import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentAPI, Appointment, AppointmentFormData } from '@/services/appointmentService';
import { toast } from 'sonner';

// Hook to fetch today's appointments
export const useTodayAppointments = () => {
  return useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: appointmentAPI.getTodayAppointments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch appointments with optional filters
export const useAppointments = (filters?: { date?: string; status?: string }) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => appointmentAPI.getAppointments(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch appointments by date range
export const useAppointmentsByDateRange = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['appointments', 'range', startDate, endDate],
    queryFn: () => startDate && endDate 
      ? appointmentAPI.getAppointmentsByDateRange(startDate, endDate)
      : Promise.resolve([]),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!startDate && !!endDate, // Only run if both dates are provided
  });
};

// Hook to fetch a specific appointment by ID
export const useAppointment = (id?: string) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => id ? appointmentAPI.getAppointmentById(id) : Promise.resolve(null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run if ID is provided
  });
};

// Hook to fetch appointments for a specific patient
export const usePatientAppointments = (patientId?: string) => {
  return useQuery({
    queryKey: ['appointments', 'patient', patientId],
    queryFn: () => patientId ? appointmentAPI.getPatientAppointments(patientId) : Promise.resolve([]),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!patientId, // Only run if patient ID is provided
  });
};

// Hook to fetch appointment statistics
export const useAppointmentStats = (period?: 'day' | 'week' | 'month' | 'year') => {
  return useQuery({
    queryKey: ['appointments', 'stats', period],
    queryFn: () => appointmentAPI.getAppointmentStats(period),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to create a new appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AppointmentFormData) => appointmentAPI.createAppointment(data),
    onSuccess: () => {
      toast.success('Appointment scheduled successfully');
      
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule appointment');
    },
  });
};

// Hook to update an existing appointment
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AppointmentFormData> }) => 
      appointmentAPI.updateAppointment(id, data),
    onSuccess: (data, variables) => {
      toast.success('Appointment updated successfully');
      
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update appointment');
    },
  });
};

// Hook to delete an appointment
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => appointmentAPI.deleteAppointment(id),
    onSuccess: () => {
      toast.success('Appointment deleted successfully');
      
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete appointment');
    },
  });
};

// Hook for appointment confirmation
export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => appointmentAPI.confirmAppointment(id),
    onSuccess: (data) => {
      toast.success('Appointment confirmed successfully');
      
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to confirm appointment');
    },
  });
};

// Hook for appointment cancellation
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => appointmentAPI.cancelAppointment(id),
    onSuccess: (data) => {
      toast.success('Appointment cancelled successfully');
      
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    },
  });
};

// Hook for marking appointment as completed
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => appointmentAPI.completeAppointment(id),
    onSuccess: (data) => {
      toast.success('Appointment marked as completed');
      
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update appointment status');
    },
  });
};