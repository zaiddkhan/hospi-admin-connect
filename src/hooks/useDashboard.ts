import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/services/api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardAPI.getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAppointmentsOverview = () => {
  return useQuery({
    queryKey: ['appointmentsOverview'],
    queryFn: dashboardAPI.getAppointmentsOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRevenueChart = () => {
  return useQuery({
    queryKey: ['revenueChart'],
    queryFn: dashboardAPI.getRevenueChart,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePatientAnalytics = () => {
  return useQuery({
    queryKey: ['patientAnalytics'],
    queryFn: dashboardAPI.getPatientAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};