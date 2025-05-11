import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsAPI } from '@/services/api';
import { toast } from 'sonner';

export const useTodayAppointments = () => {
  return useQuery({
    queryKey: ['todayAppointments'],
    queryFn: appointmentsAPI.getTodayAppointments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAppointments = (date?: string, status?: string) => {
  return useQuery({
    queryKey: ['appointments', { date, status }],
    queryFn: () => appointmentsAPI.getAppointments(date, status),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsAPI.getAppointmentById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appointmentData: any) => appointmentsAPI.createAppointment(appointmentData),
    onSuccess: () => {
      toast.success('Appointment scheduled successfully');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['todayAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule appointment');
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, appointmentData }: { id: string; appointmentData: any }) => 
      appointmentsAPI.updateAppointment(id, appointmentData),
    onSuccess: (data, variables) => {
      toast.success('Appointment updated successfully');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['todayAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update appointment');
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => appointmentsAPI.deleteAppointment(id),
    onSuccess: () => {
      toast.success('Appointment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['todayAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete appointment');
    },
  });
};