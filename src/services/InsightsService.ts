// src/services/InsightsService.ts
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
  data: any; // Generic data property that will contain different structures based on category
}

export interface InsightStats {
  totalInsights: number;
  newInsights: number;
  schedulingInsights: number;
  inventoryInsights: number;
  revenueInsights: number;
  patientsInsights: number;
}

export interface InsightApplicationResult {
  message: string;
  insight: Insight;
  result: {
    changes?: any[];
    insights?: number;
    applicationId?: string;
    applicationTime?: string;
  };
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

  applyInsight: async (id: string): Promise<InsightApplicationResult> => {
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