import { useState, useEffect } from 'react';
import { diplomaBookService } from '../services/TH04/diplomaBook';
import type { DiplomaBook } from '../services/TH04/typings';

export default function useDiplomaBookModel() {
  const [books, setBooks] = useState<DiplomaBook[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from service
  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await diplomaBookService.getAll();
      if (response.success) {
        setBooks(response.data);
      } else {
        console.error('Failed to load diploma books:', response.message);
      }
    } catch (error) {
      console.error('Failed to load diploma books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadBooks();
  }, []);

  const addBook = async (bookData: Omit<DiplomaBook, 'id' | 'currentEntryNumber'>) => {
    setLoading(true);
    try {
      const response = await diplomaBookService.create(bookData);
      if (response.success) {
        setBooks(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create diploma book');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: string, updates: Partial<DiplomaBook>) => {
    setLoading(true);
    try {
      const response = await diplomaBookService.update(id, updates);
      if (response.success) {
        setBooks(prev => prev.map(book =>
          book.id === id ? response.data : book
        ));
      } else {
        throw new Error(response.message || 'Failed to update diploma book');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string) => {
    setLoading(true);
    try {
      const response = await diplomaBookService.delete(id);
      if (response.success) {
        setBooks(prev => prev.filter(book => book.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete diploma book');
      }
    } finally {
      setLoading(false);
    }
  };

  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };

  const getBookByYear = (year: number) => {
    return books.find(book => book.year === year);
  };

  const incrementEntryNumber = async (bookId: string) => {
    const response = await diplomaBookService.incrementEntryNumber(bookId);
    if (response.success) {
      // Update local state
      setBooks(prev => prev.map(book =>
        book.id === bookId ? { ...book, currentEntryNumber: response.data } : book
      ));
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to increment entry number');
    }
  };

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    getBookByYear,
    incrementEntryNumber,
  };
}