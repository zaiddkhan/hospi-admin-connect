// src/hooks/useInsights.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insightsAPI } from '@/services/InsightsService';
import { toast } from 'sonner';

// Hook to fetch all insights
export const useInsights = (params?: { category?: string; status?: string }) => {
  return useQuery({
    queryKey: ['insights', params],
    queryFn: () => insightsAPI.getInsights(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a specific insight
export const useInsight = (id?: string) => {
  return useQuery({
    queryKey: ['insight', id],
    queryFn: () => id ? insightsAPI.getInsightById(id) : Promise.resolve(null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};

// Hook to fetch insight statistics
export const useInsightsStats = () => {
  return useQuery({
    queryKey: ['insights', 'stats'],
    queryFn: () => insightsAPI.getInsightStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to apply an insight
export const useApplyInsight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => insightsAPI.applyInsight(id),
    onSuccess: (data) => {
      // Invalidate relevant queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      queryClient.invalidateQueries({ queryKey: ['insights', 'stats'] });
      
      // Based on the insight category, invalidate other relevant queries
      const category = data?.insight?.category;
      if (category === 'scheduling') {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      } else if (category === 'inventory') {
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      } else if (category === 'revenue') {
        queryClient.invalidateQueries({ queryKey: ['billing'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      } else if (category === 'patients') {
        queryClient.invalidateQueries({ queryKey: ['patients'] });
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
      }
      
      // Return the data for further processing
      return data;
    },
    onError: (error: any) => {
      console.error('Error applying insight:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to apply insight';
      toast.error(errorMessage);
      throw error;
    },
  });
};

// Hook to dismiss an insight
export const useDismissInsight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => insightsAPI.dismissInsight(id),
    onSuccess: () => {
      // Invalidate relevant queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      queryClient.invalidateQueries({ queryKey: ['insights', 'stats'] });
    },
    onError: (error: any) => {
      console.error('Error dismissing insight:', error);
      toast.error(error?.response?.data?.message || 'Failed to dismiss insight');
    },
  });
};

// Hook to manually trigger insight generation
export const useGenerateInsights = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (type?: string) => insightsAPI.generateInsights(type),
    onSuccess: () => {
      // Invalidate relevant queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      queryClient.invalidateQueries({ queryKey: ['insights', 'stats'] });
      toast.success('Insights generated successfully');
    },
    onError: (error: any) => {
      console.error('Error generating insights:', error);
      toast.error(error?.response?.data?.message || 'Failed to generate insights');
    },
  });
};