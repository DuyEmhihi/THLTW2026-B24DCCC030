import type { GraduationDecision, ApiResponse } from './typings';

// Mock API functions for Graduation Decision management
export const graduationDecisionService = {
  // Get all graduation decisions
  getAll: async (): Promise<ApiResponse<GraduationDecision[]>> => {
    try {
      const stored = localStorage.getItem('graduation_decisions');
      const decisions: GraduationDecision[] = stored ? JSON.parse(stored) : [];
      return {
        success: true,
        data: decisions,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load graduation decisions',
      };
    }
  },

  // Get graduation decision by ID
  getById: async (id: string): Promise<ApiResponse<GraduationDecision | null>> => {
    try {
      const stored = localStorage.getItem('graduation_decisions');
      const decisions: GraduationDecision[] = stored ? JSON.parse(stored) : [];
      const decision = decisions.find(d => d.id === id);
      return {
        success: true,
        data: decision || null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to load graduation decision',
      };
    }
  },

  // Get decisions by book ID
  getByBookId: async (bookId: string): Promise<ApiResponse<GraduationDecision[]>> => {
    try {
      const stored = localStorage.getItem('graduation_decisions');
      const decisions: GraduationDecision[] = stored ? JSON.parse(stored) : [];
      const filteredDecisions = decisions.filter(d => d.bookId === bookId);
      return {
        success: true,
        data: filteredDecisions,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load graduation decisions for book',
      };
    }
  },

  // Create new graduation decision
  create: async (decisionData: Omit<GraduationDecision, 'id' | 'searchCount'>): Promise<ApiResponse<GraduationDecision>> => {
    try {
      const stored = localStorage.getItem('graduation_decisions');
      const decisions: GraduationDecision[] = stored ? JSON.parse(stored) : [];

      // Check if decision number already exists for this book
      const existingDecision = decisions.find(
        d => d.bookId === decisionData.bookId && d.decisionNumber === decisionData.decisionNumber
      );
      if (existingDecision) {
        return {
          success: false,
          data: {} as GraduationDecision,
          message: `Quyết định số ${decisionData.decisionNumber} đã tồn tại trong sổ này`,
        };
      }

      const newDecision: GraduationDecision = {
        id: Date.now().toString(),
        ...decisionData,
        searchCount: 0,
      };

      decisions.push(newDecision);
      localStorage.setItem('graduation_decisions', JSON.stringify(decisions));

      return {
        success: true,
        data: newDecision,
      };
    } catch (error) {
      return {
        success: false,
        data: {} as GraduationDecision,
        message: 'Failed to create graduation decision',
      };
    }
  },

  // Update graduation decision
  update: async (id: string, updates: Partial<GraduationDecision>): Promise<ApiResponse<GraduationDecision>> => {
    try {
      const stored = localStorage.getItem('graduation_decisions');
      const decisions: GraduationDecision[] = stored ? JSON.parse(stored) : [];
      const decisionIndex = decisions.findIndex(d => d.id === id);

      if (decisionIndex === -1) {
        return {
          success: false,
          data: {} as GraduationDecision,
          message: 'Graduation decision not found',
        };
      }

      decisions[decisionIndex] = { ...decisions[decisionIndex], ...updates };
      localStorage.setItem('graduation_decisions', JSON.stringify(decisions));

      return {
        success: true,
        data: decisions[decisionIndex],
      };
    } catch (error) {
      return {
        success: false,
        data: {} as GraduationDecision,
        message: 'Failed to update graduation decision',
      };
    }
  },

  // Delete graduation decision
  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const stored = localStorage.getItem('graduation_decisions');
      const decisions: GraduationDecision[] = stored ? JSON.parse(stored) : [];
      const filteredDecisions = decisions.filter(d => d.id !== id);

      if (filteredDecisions.length === decisions.length) {
        return {
          success: false,
          data: false,
          message: 'Graduation decision not found',
        };
      }

      localStorage.setItem('graduation_decisions', JSON.stringify(filteredDecisions));
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Failed to delete graduation decision',
      };
    }
  },

  // Increment search count for a decision
  incrementSearchCount: async (decisionId: string): Promise<ApiResponse<number>> => {
    try {
      const stored = localStorage.getItem('graduation_decisions');
      const decisions: GraduationDecision[] = stored ? JSON.parse(stored) : [];
      const decision = decisions.find(d => d.id === decisionId);

      if (!decision) {
        return {
          success: false,
          data: 0,
          message: 'Graduation decision not found',
        };
      }

      const newCount = decision.searchCount + 1;
      decision.searchCount = newCount;
      localStorage.setItem('graduation_decisions', JSON.stringify(decisions));

      return {
        success: true,
        data: newCount,
      };
    } catch (error) {
      return {
        success: false,
        data: 0,
        message: 'Failed to increment search count',
      };
    }
  },
};