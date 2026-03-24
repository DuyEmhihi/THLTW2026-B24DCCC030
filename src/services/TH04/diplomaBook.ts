import type { DiplomaBook, ApiResponse } from './typings';

// Mock API functions for Diploma Book management
export const diplomaBookService = {
  // Get all diploma books
  getAll: async (): Promise<ApiResponse<DiplomaBook[]>> => {
    try {
      const stored = localStorage.getItem('diploma_books');
      const books: DiplomaBook[] = stored ? JSON.parse(stored) : [];
      return {
        success: true,
        data: books,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load diploma books',
      };
    }
  },

  // Get diploma book by ID
  getById: async (id: string): Promise<ApiResponse<DiplomaBook | null>> => {
    try {
      const stored = localStorage.getItem('diploma_books');
      const books: DiplomaBook[] = stored ? JSON.parse(stored) : [];
      const book = books.find(b => b.id === id);
      return {
        success: true,
        data: book || null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to load diploma book',
      };
    }
  },

  // Create new diploma book
  create: async (bookData: Omit<DiplomaBook, 'id' | 'currentEntryNumber'>): Promise<ApiResponse<DiplomaBook>> => {
    try {
      const stored = localStorage.getItem('diploma_books');
      const books: DiplomaBook[] = stored ? JSON.parse(stored) : [];

      // Check if book for this year already exists
      const existingBook = books.find(book => book.year === bookData.year);
      if (existingBook) {
        return {
          success: false,
          data: {} as DiplomaBook,
          message: `Sổ văn bằng cho năm ${bookData.year} đã tồn tại`,
        };
      }

      const newBook: DiplomaBook = {
        id: Date.now().toString(),
        ...bookData,
        currentEntryNumber: 0,
      };

      books.push(newBook);
      localStorage.setItem('diploma_books', JSON.stringify(books));

      return {
        success: true,
        data: newBook,
      };
    } catch (error) {
      return {
        success: false,
        data: {} as DiplomaBook,
        message: 'Failed to create diploma book',
      };
    }
  },

  // Update diploma book
  update: async (id: string, updates: Partial<DiplomaBook>): Promise<ApiResponse<DiplomaBook>> => {
    try {
      const stored = localStorage.getItem('diploma_books');
      const books: DiplomaBook[] = stored ? JSON.parse(stored) : [];
      const bookIndex = books.findIndex(b => b.id === id);

      if (bookIndex === -1) {
        return {
          success: false,
          data: {} as DiplomaBook,
          message: 'Diploma book not found',
        };
      }

      books[bookIndex] = { ...books[bookIndex], ...updates };
      localStorage.setItem('diploma_books', JSON.stringify(books));

      return {
        success: true,
        data: books[bookIndex],
      };
    } catch (error) {
      return {
        success: false,
        data: {} as DiplomaBook,
        message: 'Failed to update diploma book',
      };
    }
  },

  // Delete diploma book
  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const stored = localStorage.getItem('diploma_books');
      const books: DiplomaBook[] = stored ? JSON.parse(stored) : [];
      const filteredBooks = books.filter(b => b.id !== id);

      if (filteredBooks.length === books.length) {
        return {
          success: false,
          data: false,
          message: 'Diploma book not found',
        };
      }

      localStorage.setItem('diploma_books', JSON.stringify(filteredBooks));
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Failed to delete diploma book',
      };
    }
  },

  // Increment entry number for a book
  incrementEntryNumber: async (bookId: string): Promise<ApiResponse<number>> => {
    try {
      const stored = localStorage.getItem('diploma_books');
      const books: DiplomaBook[] = stored ? JSON.parse(stored) : [];
      const book = books.find(b => b.id === bookId);

      if (!book) {
        return {
          success: false,
          data: 0,
          message: 'Diploma book not found',
        };
      }

      const newEntryNumber = book.currentEntryNumber + 1;
      book.currentEntryNumber = newEntryNumber;
      localStorage.setItem('diploma_books', JSON.stringify(books));

      return {
        success: true,
        data: newEntryNumber,
      };
    } catch (error) {
      return {
        success: false,
        data: 0,
        message: 'Failed to increment entry number',
      };
    }
  },
};