import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authAPI.login(email, password),
    onSuccess: (data) => {
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
      
      // Reset all query cache
      queryClient.clear();
      
      // Show success message
      toast.success('Login successful');
      
      // Redirect to dashboard
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear all queries
    queryClient.clear();
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to login
    navigate('/login');
  };
};

export const useRegister = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (userData: any) => authAPI.register(userData),
    onSuccess: (data) => {
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
      
      // Show success message
      toast.success('Registration successful');
      
      // Redirect to dashboard
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    },
  });
};

export const useCurrentUser = () => {
  const userString = localStorage.getItem('user');
  
  if (!userString) {
    return null;
  }
  
  try {
    return JSON.parse(userString);
  } catch (error) {
    // If there's an error parsing the JSON, clear the localStorage
    localStorage.removeItem('user');
    return null;
  }
};