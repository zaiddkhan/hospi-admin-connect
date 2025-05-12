// src/services/InsightGenerationService.js
import api from './api';

/**
 * Service for generating and managing AI-powered insights
 * This service communicates with the MCP server for insight generation
 */
class InsightGenerationService {
  /**
   * Get all insights with optional filtering
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} - List of insights
   */
  async getInsights(params = {}) {
    try {
      const response = await api.get('/insights', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  }

  /**
   * Get a specific insight by ID
   * @param {string} id - Insight ID
   * @returns {Promise<Object>} - Insight details
   */
  async getInsightById(id) {
    try {
      const response = await api.get(`/insights/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching insight ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get insight statistics
   * @returns {Promise<Object>} - Insight statistics
   */
  async getInsightStats() {
    try {
      const response = await api.get('/insights/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching insight stats:', error);
      throw error;
    }
  }

  /**
   * Apply an insight's recommendations
   * This will trigger the corresponding action on the server
   * @param {string} id - Insight ID to apply
   * @returns {Promise<Object>} - Result of the operation
   */
  async applyInsight(id) {
    try {
      const response = await api.post(`/insights/${id}/apply`);
      return response.data;
    } catch (error) {
      console.error(`Error applying insight ${id}:`, error);
      throw error;
    }
  }

  /**
   * Dismiss an insight without applying it
   * @param {string} id - Insight ID to dismiss
   * @returns {Promise<Object>} - Result of the operation
   */
  async dismissInsight(id) {
    try {
      const response = await api.post(`/insights/${id}/dismiss`);
      return response.data;
    } catch (error) {
      console.error(`Error dismissing insight ${id}:`, error);
      throw error;
    }
  }

  /**
   * Manually trigger insight generation
   * @param {string} type - Optional type of insights to generate
   * @returns {Promise<Object>} - Result of the operation
   */
  async generateInsights(type) {
    try {
      const response = await api.post('/insights/generate', { type });
      return response.data;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }
}

// Export as a singleton
const insightsService = new InsightGenerationService();
export default insightsService;