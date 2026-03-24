import { useState, useEffect } from 'react';
import { graduationDecisionService } from '../services/TH04/graduationDecision';
import type { GraduationDecision } from '../services/TH04/typings';

export default function useGraduationDecisionModel() {
  const [decisions, setDecisions] = useState<GraduationDecision[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from service
  const loadDecisions = async () => {
    setLoading(true);
    try {
      const response = await graduationDecisionService.getAll();
      if (response.success) {
        setDecisions(response.data);
      } else {
        console.error('Failed to load graduation decisions:', response.message);
      }
    } catch (error) {
      console.error('Failed to load graduation decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadDecisions();
  }, []);

  const addDecision = async (decisionData: Omit<GraduationDecision, 'id' | 'searchCount'>) => {
    setLoading(true);
    try {
      const response = await graduationDecisionService.create(decisionData);
      if (response.success) {
        setDecisions(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create graduation decision');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateDecision = async (id: string, updates: Partial<GraduationDecision>) => {
    setLoading(true);
    try {
      const response = await graduationDecisionService.update(id, updates);
      if (response.success) {
        setDecisions(prev => prev.map(decision =>
          decision.id === id ? response.data : decision
        ));
      } else {
        throw new Error(response.message || 'Failed to update graduation decision');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteDecision = async (id: string) => {
    setLoading(true);
    try {
      const response = await graduationDecisionService.delete(id);
      if (response.success) {
        setDecisions(prev => prev.filter(decision => decision.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete graduation decision');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDecisionById = (id: string) => {
    return decisions.find(decision => decision.id === id);
  };

  const getDecisionsByBookId = (bookId: string) => {
    return decisions.filter(decision => decision.bookId === bookId);
  };

  const incrementSearchCount = async (decisionId: string) => {
    const response = await graduationDecisionService.incrementSearchCount(decisionId);
    if (response.success) {
      // Update local state
      setDecisions(prev => prev.map(decision =>
        decision.id === decisionId ? { ...decision, searchCount: response.data } : decision
      ));
    } else {
      throw new Error(response.message || 'Failed to increment search count');
    }
  };

  return {
    decisions,
    loading,
    addDecision,
    updateDecision,
    deleteDecision,
    getDecisionById,
    getDecisionsByBookId,
    incrementSearchCount,
  };
}