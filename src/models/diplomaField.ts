import { useState, useEffect } from 'react';
import { diplomaFieldService } from '../services/TH04/diplomaField';
import type { DiplomaField } from '../services/TH04/typings';

export default function useDiplomaFieldModel() {
  const [fields, setFields] = useState<DiplomaField[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from service
  const loadFields = async () => {
    setLoading(true);
    try {
      const response = await diplomaFieldService.getAll();
      if (response.success) {
        setFields(response.data);
      } else {
        console.error('Failed to load diploma fields:', response.message);
      }
    } catch (error) {
      console.error('Failed to load diploma fields:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadFields();
  }, []);

  const addField = async (fieldData: Omit<DiplomaField, 'id'>) => {
    setLoading(true);
    try {
      const response = await diplomaFieldService.create(fieldData);
      if (response.success) {
        setFields(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create diploma field');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (id: string, updates: Partial<DiplomaField>) => {
    setLoading(true);
    try {
      const response = await diplomaFieldService.update(id, updates);
      if (response.success) {
        setFields(prev => prev.map(field =>
          field.id === id ? response.data : field
        ));
      } else {
        throw new Error(response.message || 'Failed to update diploma field');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteField = async (id: string) => {
    setLoading(true);
    try {
      const response = await diplomaFieldService.delete(id);
      if (response.success) {
        setFields(prev => prev.filter(field => field.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete diploma field');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldById = (id: string) => {
    return fields.find(field => field.id === id);
  };

  const getActiveFields = () => {
    return fields; // All fields are active, no soft delete implemented
  };

  return {
    fields,
    loading,
    addField,
    updateField,
    deleteField,
    getFieldById,
    getActiveFields,
  };
}