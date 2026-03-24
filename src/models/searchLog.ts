import { useState, useEffect } from 'react';
import { searchLogService } from '../services/TH04/searchLog';
import type { SearchLog } from '../services/TH04/typings';

export default function useSearchLogModel() {
  const [logs, setLogs] = useState<SearchLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from service
  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await searchLogService.getAll();
      if (response.success) {
        setLogs(response.data);
      } else {
        console.error('Failed to load search logs:', response.message);
      }
    } catch (error) {
      console.error('Failed to load search logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadLogs();
  }, []);

  const addLog = async (logData: Omit<SearchLog, 'id' | 'timestamp'>) => {
    setLoading(true);
    try {
      const response = await searchLogService.create(logData);
      if (response.success) {
        setLogs(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create search log');
      }
    } finally {
      setLoading(false);
    }
  };

  const getLogsByDecisionId = (decisionId: string) => {
    return logs.filter(log => log.decisionId === decisionId);
  };

  const getSearchStats = () => {
    const stats: Record<string, number> = {};
    logs.forEach(log => {
      stats[log.decisionId] = (stats[log.decisionId] || 0) + 1;
    });
    return stats;
  };

  const clearOldLogs = async (daysOld: number = 30) => {
    setLoading(true);
    try {
      const response = await searchLogService.clearOldLogs(daysOld);
      if (response.success) {
        setLogs(response.data);
      } else {
        console.error('Failed to clear old logs:', response.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    loading,
    addLog,
    getLogsByDecisionId,
    getSearchStats,
    clearOldLogs,
  };
}