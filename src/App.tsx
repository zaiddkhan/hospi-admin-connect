
// Updated routing configuration for App.tsx
// Import all necessary components including our new EnhancedInsights page
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Appointments from "@/pages/Appointments";
import AppointmentDetail from "@/pages/AppointmentDetail";
import NewAppointment from "@/pages/NewAppointment";
import Communications from "@/pages/Communications";
import Patients from "@/pages/Patients";
import PatientDetail from "@/pages/PatientDetail";
import NewPatient from "@/pages/NewPatient";
import Billing from "@/pages/Billing";
import Inventory from "@/pages/Inventory";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Login from "@/pages/auth/Login";
import EnhancedInsights from "@/pages/EnhancedInsights"; // Import our new enhanced insights page
import Profile from "@/pages/Profile"; // Import our new Profile page
import { useEffect, useState } from "react";
import UploadDoc from "./pages/UploadDoc";
import DocAnalysis from "./pages/DocAnalaysis";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('token');
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render children
  return <>{children}</>;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate checking token validity
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            
            {/* Appointment routes */}
            <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            <Route path="/appointments/new" element={<ProtectedRoute><NewAppointment /></ProtectedRoute>} />
            <Route path="/appointments/:id" element={<ProtectedRoute><AppointmentDetail /></ProtectedRoute>} />
            <Route path="/appointments/:id/edit" element={<ProtectedRoute><AppointmentDetail /></ProtectedRoute>} />
            
            {/* Patient routes */}
            <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
            <Route path="/patients/new" element={<ProtectedRoute><NewPatient /></ProtectedRoute>} />
            <Route path="/patients/:id" element={<ProtectedRoute><PatientDetail /></ProtectedRoute>} />
            
            {/* Other routes */}
            <Route path="/communications" element={<ProtectedRoute><Communications /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Enhanced Insights route */}
            <Route path="/insights" element={<ProtectedRoute><EnhancedInsights /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><UploadDoc /></ProtectedRoute>} />
            <Route path="/analysis" element={<ProtectedRoute><DocAnalysis /></ProtectedRoute>} />
            
            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
