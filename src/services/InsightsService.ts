// src/services/insightsService.ts
import api from './api';

export interface Insight {
  id: string;
  title: string;
  description: string;
  category: 'scheduling' | 'inventory' | 'revenue' | 'patients';
  priority: 'high' | 'medium' | 'low';
  impact?: string;
  implementation_details?: string[];
  status: 'pending' | 'applied' | 'dismissed';
  created_at: string;
  updated_at: string;
  data: {
    itemsToRestock: Array<{ 
      id: string;
      name: string; 
      currentStock: number;
      suggestedStock: number;
      unitPrice: number;
    }>;
    totalCost: number;
    suggestedDate: string;
    savingsPercentage: number;
  };
  scheduleData : {
    date: string;
    doctorName: string;
    currentSchedule: Array<{ time: string; count: number }>;
    suggestedSchedule: Array<{ time: string; count: number }>;
    benefitText: string;
  };
  revenueInsightData : {
    insights: Array<{ 
      title: string;
      description: string;
      value: number;
      change: number;
    }>;
    recommendations: string[];
  }
}

export interface InsightStats {
  totalInsights: number;
  newInsights: number;
  schedulingInsights: number;
  inventoryInsights: number;
  revenueInsights: number;
  patientsInsights: number;
}

export const insightsAPI = {
  getInsights: async (params?: { category?: string; status?: string }): Promise<Insight[]> => {
    try {
      const response = await api.get('/insights', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  },

  getInsightById: async (id: string): Promise<Insight> => {
    try {
      const response = await api.get(`/insights/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching insight ${id}:`, error);
      throw error;
    }
  },

  getInsightStats: async (): Promise<InsightStats> => {
    try {
      const response = await api.get('/insights/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching insight stats:', error);
      throw error;
    }
  },

  applyInsight: async (id: string): Promise<any> => {
    try {
      const response = await api.post(`/insights/${id}/apply`);
      return response.data;
    } catch (error) {
      console.error(`Error applying insight ${id}:`, error);
      throw error;
    }
  },

  dismissInsight: async (id: string): Promise<any> => {
    try {
      const response = await api.post(`/insights/${id}/dismiss`);
      return response.data;
    } catch (error) {
      console.error(`Error dismissing insight ${id}:`, error);
      throw error;
    }
  },

  // Request a specific type of insight generation
  generateInsights: async (type?: string): Promise<any> => {
    try {
      const response = await api.post('/insights/generate', { type });
      return response.data;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }
};