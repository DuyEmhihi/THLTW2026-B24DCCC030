import type { SearchLog, ApiResponse } from './typings';

// Mock API functions for Search Log management
export const searchLogService = {
  // Get all search logs
  getAll: async (): Promise<ApiResponse<SearchLog[]>> => {
    try {
      const stored = localStorage.getItem('search_logs');
      const logs: SearchLog[] = stored ? JSON.parse(stored) : [];
      return {
        success: true,
        data: logs,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load search logs',
      };
    }
  },

  // Get search logs by decision ID
  getByDecisionId: async (decisionId: string): Promise<ApiResponse<SearchLog[]>> => {
    try {
      const stored = localStorage.getItem('search_logs');
      const logs: SearchLog[] = stored ? JSON.parse(stored) : [];
      const filteredLogs = logs.filter(log => log.decisionId === decisionId);
      return {
        success: true,
        data: filteredLogs,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load search logs for decision',
      };
    }
  },

  // Create new search log
  create: async (logData: Omit<SearchLog, 'id' | 'timestamp'>): Promise<ApiResponse<SearchLog>> => {
    try {
      const stored = localStorage.getItem('search_logs');
      const logs: SearchLog[] = stored ? JSON.parse(stored) : [];

      const newLog: SearchLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...logData,
      };

      logs.push(newLog);
      localStorage.setItem('search_logs', JSON.stringify(logs));

      return {
        success: true,
        data: newLog,
      };
    } catch (error) {
      return {
        success: false,
        data: {} as SearchLog,
        message: 'Failed to create search log',
      };
    }
  },

  // Get search statistics
  getStats: async (): Promise<ApiResponse<Record<string, number>>> => {
    try {
      const stored = localStorage.getItem('search_logs');
      const logs: SearchLog[] = stored ? JSON.parse(stored) : [];

      const stats: Record<string, number> = {};
      logs.forEach(log => {
        stats[log.decisionId] = (stats[log.decisionId] || 0) + 1;
      });

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        data: {},
        message: 'Failed to get search statistics',
      };
    }
  },

  // Clear old logs (older than specified days)
  clearOld: async (daysOld: number = 30): Promise<ApiResponse<boolean>> => {
    try {
      const stored = localStorage.getItem('search_logs');
      const logs: SearchLog[] = stored ? JSON.parse(stored) : [];

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const filteredLogs = logs.filter(log => new Date(log.timestamp) > cutoffDate);
      localStorage.setItem('search_logs', JSON.stringify(filteredLogs));

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Failed to clear old logs',
      };
    }
  },
};