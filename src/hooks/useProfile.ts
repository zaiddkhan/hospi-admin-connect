
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserProfile> => {
      try {
        const response = await api.get('/users/profile');
        return response.data;
      } catch (error: any) {
        toast.error('Failed to load profile: ' + (error.response?.data?.message || 'Unknown error'));
        throw error;
      }
    }
  });
};
