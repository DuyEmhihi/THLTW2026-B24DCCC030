import type { Diploma, DiplomaSearchForm, ApiResponse } from './typings';

// Mock API functions for Diploma management
export const diplomaService = {
  // Get all diplomas
  getAll: async (): Promise<ApiResponse<Diploma[]>> => {
    try {
      const stored = localStorage.getItem('diplomas');
      const diplomas: Diploma[] = stored ? JSON.parse(stored) : [];
      return {
        success: true,
        data: diplomas,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load diplomas',
      };
    }
  },

  // Get diploma by ID
  getById: async (id: string): Promise<ApiResponse<Diploma | null>> => {
    try {
      const stored = localStorage.getItem('diplomas');
      const diplomas: Diploma[] = stored ? JSON.parse(stored) : [];
      const diploma = diplomas.find(d => d.id === id);
      return {
        success: true,
        data: diploma || null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to load diploma',
      };
    }
  },

  // Get diplomas by book ID
  getByBookId: async (bookId: string): Promise<ApiResponse<Diploma[]>> => {
    try {
      const stored = localStorage.getItem('diplomas');
      const diplomas: Diploma[] = stored ? JSON.parse(stored) : [];
      const filteredDiplomas = diplomas.filter(d => d.bookId === bookId);
      return {
        success: true,
        data: filteredDiplomas,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load diplomas for book',
      };
    }
  },

  // Get diplomas by decision ID
  getByDecisionId: async (decisionId: string): Promise<ApiResponse<Diploma[]>> => {
    try {
      const stored = localStorage.getItem('diplomas');
      const diplomas: Diploma[] = stored ? JSON.parse(stored) : [];
      const filteredDiplomas = diplomas.filter(d => d.decisionId === decisionId);
      return {
        success: true,
        data: filteredDiplomas,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load diplomas for decision',
      };
    }
  },

  // Create new diploma
  create: async (diplomaData: Omit<Diploma, 'id' | 'entryNumber'>): Promise<ApiResponse<Diploma>> => {
    try {
      const storedDiplomas = localStorage.getItem('diplomas');
      const diplomas: Diploma[] = storedDiplomas ? JSON.parse(storedDiplomas) : [];

      // Check if diploma number already exists
      const existingDiploma = diplomas.find(d => d.diplomaNumber === diplomaData.diplomaNumber);
      if (existingDiploma) {
        return {
          success: false,
          data: {} as Diploma,
          message: `Số hiệu văn bằng "${diplomaData.diplomaNumber}" đã tồn tại`,
        };
      }

      // Check if student ID already exists
      const existingStudent = diplomas.find(d => d.studentId === diplomaData.studentId);
      if (existingStudent) {
        return {
          success: false,
          data: {} as Diploma,
          message: `Mã sinh viên "${diplomaData.studentId}" đã có văn bằng`,
        };
      }

      // Validate required custom fields
      const storedFields = localStorage.getItem('diploma_fields');
      const fields: any[] = storedFields ? JSON.parse(storedFields) : [];
      for (const field of fields) {
        if (field.required) {
          const fieldValue = diplomaData.customFields?.[field.id];
          if (!fieldValue || fieldValue.toString().trim() === '') {
            return {
              success: false,
              data: {} as Diploma,
              message: `Trường "${field.name}" là bắt buộc`,
            };
          }
        }
      }

      // Get next entry number for the book
      const storedBooks = localStorage.getItem('diploma_books');
      const books = storedBooks ? JSON.parse(storedBooks) : [];
      const book = books.find((b: any) => b.id === diplomaData.bookId);

      if (!book) {
        return {
          success: false,
          data: {} as Diploma,
          message: 'Sổ văn bằng không tồn tại',
        };
      }

      const entryNumber = book.currentEntryNumber + 1;
      book.currentEntryNumber = entryNumber;
      localStorage.setItem('diploma_books', JSON.stringify(books));

      const newDiploma: Diploma = {
        id: Date.now().toString(),
        entryNumber,
        ...diplomaData,
      };

      diplomas.push(newDiploma);
      localStorage.setItem('diplomas', JSON.stringify(diplomas));

      return {
        success: true,
        data: newDiploma,
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Diploma,
        message: 'Failed to create diploma',
      };
    }
  },

  // Update diploma
  update: async (id: string, updates: Partial<Diploma>): Promise<ApiResponse<Diploma>> => {
    try {
      const stored = localStorage.getItem('diplomas');
      const diplomas: Diploma[] = stored ? JSON.parse(stored) : [];
      const diplomaIndex = diplomas.findIndex(d => d.id === id);

      if (diplomaIndex === -1) {
        return {
          success: false,
          data: {} as Diploma,
          message: 'Diploma not found',
        };
      }

      // Prevent updating entry number
      if (updates.entryNumber !== undefined) {
        return {
          success: false,
          data: {} as Diploma,
          message: 'Không được phép chỉnh sửa số vào sổ',
        };
      }

      // Check uniqueness if diploma number or student ID is being updated
      if (updates.diplomaNumber) {
        const existingDiploma = diplomas.find(d => d.diplomaNumber === updates.diplomaNumber && d.id !== id);
        if (existingDiploma) {
          return {
            success: false,
            data: {} as Diploma,
            message: `Số hiệu văn bằng "${updates.diplomaNumber}" đã tồn tại`,
          };
        }
      }

      if (updates.studentId) {
        const existingStudent = diplomas.find(d => d.studentId === updates.studentId && d.id !== id);
        if (existingStudent) {
          return {
            success: false,
            data: {} as Diploma,
            message: `Mã sinh viên "${updates.studentId}" đã có văn bằng`,
          };
        }
      }

      diplomas[diplomaIndex] = { ...diplomas[diplomaIndex], ...updates };
      localStorage.setItem('diplomas', JSON.stringify(diplomas));

      return {
        success: true,
        data: diplomas[diplomaIndex],
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Diploma,
        message: 'Failed to update diploma',
      };
    }
  },

  // Delete diploma
  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const stored = localStorage.getItem('diplomas');
      const diplomas: Diploma[] = stored ? JSON.parse(stored) : [];
      const filteredDiplomas = diplomas.filter(d => d.id !== id);

      if (filteredDiplomas.length === diplomas.length) {
        return {
          success: false,
          data: false,
          message: 'Diploma not found',
        };
      }

      localStorage.setItem('diplomas', JSON.stringify(filteredDiplomas));
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Failed to delete diploma',
      };
    }
  },

  // Search diplomas
  search: async (searchParams: DiplomaSearchForm): Promise<ApiResponse<Diploma[]>> => {
    try {
      const paramCount = Object.values(searchParams).filter(value => value && value.trim() !== '').length;
      if (paramCount < 2) {
        return {
          success: false,
          data: [],
          message: 'Phải nhập ít nhất 2 tham số tìm kiếm',
        };
      }

      const stored = localStorage.getItem('diplomas');
      const diplomas: Diploma[] = stored ? JSON.parse(stored) : [];

      const results = diplomas.filter(diploma => {
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

      // Log search for each decision found
      const decisionIds = [...new Set(results.map(d => d.decisionId))];
      const storedLogs = localStorage.getItem('search_logs') || '[]';
      const logs = JSON.parse(storedLogs);

      decisionIds.forEach(decisionId => {
        logs.push({
          id: Date.now().toString() + Math.random(),
          decisionId,
          searchParams,
          timestamp: new Date().toISOString(),
        });
      });

      localStorage.setItem('search_logs', JSON.stringify(logs));

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to search diplomas',
      };
    }
  },
};