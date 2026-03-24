import { useState, useEffect } from 'react';
import { diplomaService } from '../services/TH04/diploma';
import type { Diploma, DiplomaSearchForm } from '../services/TH04/typings';

export default function useDiplomaModel() {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from service
  const loadDiplomas = async () => {
    setLoading(true);
    try {
      const response = await diplomaService.getAll();
      if (response.success) {
        setDiplomas(response.data);
      } else {
        console.error('Failed to load diplomas:', response.message);
      }
    } catch (error) {
      console.error('Failed to load diplomas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadDiplomas();
  }, []);

  const addDiploma = async (diplomaData: Omit<Diploma, 'id' | 'entryNumber'>) => {
    setLoading(true);
    try {
      const response = await diplomaService.create(diplomaData);
      if (response.success) {
        setDiplomas(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create diploma');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateDiploma = async (id: string, updates: Partial<Diploma>) => {
    setLoading(true);
    try {
      const response = await diplomaService.update(id, updates);
      if (response.success) {
        setDiplomas(prev => prev.map(diploma =>
          diploma.id === id ? response.data : diploma
        ));
      } else {
        throw new Error(response.message || 'Failed to update diploma');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteDiploma = async (id: string) => {
    setLoading(true);
    try {
      const response = await diplomaService.delete(id);
      if (response.success) {
        setDiplomas(prev => prev.filter(diploma => diploma.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete diploma');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDiplomaById = (id: string) => {
    return diplomas.find(diploma => diploma.id === id);
  };

  const getDiplomasByBookId = (bookId: string) => {
    return diplomas.filter(diploma => diploma.bookId === bookId);
  };

  const getDiplomasByDecisionId = (decisionId: string) => {
    return diplomas.filter(diploma => diploma.decisionId === decisionId);
  };

  const searchDiplomas = (searchParams: DiplomaSearchForm) => {
    const paramCount = Object.values(searchParams).filter(value => value && value.trim() !== '').length;
    if (paramCount < 2) {
      throw new Error('Phải nhập ít nhất 2 tham số tìm kiếm');
    }

    return diplomas.filter(diploma => {
      let matches = 0;

      if (searchParams.diplomaNumber && diploma.diplomaNumber.toLowerCase().includes(searchParams.diplomaNumber!.toLowerCase())) {
        matches++;
      }
      if (searchParams.entryNumber && diploma.entryNumber.toString() === searchParams.entryNumber) {
        matches++;
      }
      if (searchParams.studentId && diploma.studentId.toLowerCase().includes(searchParams.studentId!.toLowerCase())) {
        matches++;
      }
      if (searchParams.name && diploma.name.toLowerCase().includes(searchParams.name!.toLowerCase())) {
        matches++;
      }
      if (searchParams.birthDate && diploma.birthDate === searchParams.birthDate) {
        matches++;
      }

      return matches >= 2;
    });
  };

  return {
    diplomas,
    loading,
    addDiploma,
    updateDiploma,
    deleteDiploma,
    getDiplomaById,
    getDiplomasByBookId,
    getDiplomasByDecisionId,
    searchDiplomas,
  };
}