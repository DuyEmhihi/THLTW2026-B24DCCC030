import type { DiplomaField, ApiResponse } from './typings';

// Mock API functions for Diploma Field management
export const diplomaFieldService = {
  // Get all diploma fields
  getAll: async (): Promise<ApiResponse<DiplomaField[]>> => {
    try {
      const stored = localStorage.getItem('diploma_fields');
      const fields: DiplomaField[] = stored ? JSON.parse(stored) : [];
      return {
        success: true,
        data: fields,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load diploma fields',
      };
    }
  },

  // Get diploma field by ID
  getById: async (id: string): Promise<ApiResponse<DiplomaField | null>> => {
    try {
      const stored = localStorage.getItem('diploma_fields');
      const fields: DiplomaField[] = stored ? JSON.parse(stored) : [];
      const field = fields.find(f => f.id === id);
      return {
        success: true,
        data: field || null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to load diploma field',
      };
    }
  },

  // Create new diploma field
  create: async (fieldData: Omit<DiplomaField, 'id'>): Promise<ApiResponse<DiplomaField>> => {
    try {
      const stored = localStorage.getItem('diploma_fields');
      const fields: DiplomaField[] = stored ? JSON.parse(stored) : [];

      // Check if field name already exists
      const existingField = fields.find(field => field.name === fieldData.name);
      if (existingField) {
        return {
          success: false,
          data: {} as DiplomaField,
          message: `Trường thông tin "${fieldData.name}" đã tồn tại`,
        };
      }

      const newField: DiplomaField = {
        id: Date.now().toString(),
        ...fieldData,
      };

      fields.push(newField);
      localStorage.setItem('diploma_fields', JSON.stringify(fields));

      return {
        success: true,
        data: newField,
      };
    } catch (error) {
      return {
        success: false,
        data: {} as DiplomaField,
        message: 'Failed to create diploma field',
      };
    }
  },

  // Update diploma field
  update: async (id: string, updates: Partial<DiplomaField>): Promise<ApiResponse<DiplomaField>> => {
    try {
      const stored = localStorage.getItem('diploma_fields');
      const fields: DiplomaField[] = stored ? JSON.parse(stored) : [];
      const fieldIndex = fields.findIndex(f => f.id === id);

      if (fieldIndex === -1) {
        return {
          success: false,
          data: {} as DiplomaField,
          message: 'Diploma field not found',
        };
      }

      // Check name uniqueness if name is being updated
      if (updates.name) {
        const existingField = fields.find(field => field.name === updates.name && field.id !== id);
        if (existingField) {
          return {
            success: false,
            data: {} as DiplomaField,
            message: `Trường thông tin "${updates.name}" đã tồn tại`,
          };
        }
      }

      fields[fieldIndex] = { ...fields[fieldIndex], ...updates };
      localStorage.setItem('diploma_fields', JSON.stringify(fields));

      return {
        success: true,
        data: fields[fieldIndex],
      };
    } catch (error) {
      return {
        success: false,
        data: {} as DiplomaField,
        message: 'Failed to update diploma field',
      };
    }
  },

  // Delete diploma field
  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const stored = localStorage.getItem('diploma_fields');
      const fields: DiplomaField[] = stored ? JSON.parse(stored) : [];
      const filteredFields = fields.filter(f => f.id !== id);

      if (filteredFields.length === fields.length) {
        return {
          success: false,
          data: false,
          message: 'Diploma field not found',
        };
      }

      localStorage.setItem('diploma_fields', JSON.stringify(filteredFields));
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Failed to delete diploma field',
      };
    }
  },
};