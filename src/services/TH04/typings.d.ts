// Type definitions for Diploma Management System

export interface DiplomaBook {
  id: string;
  year: number;
  currentEntryNumber: number; // Auto-increments per book
}

export interface GraduationDecision {
  id: string;
  bookId: string;
  batchNumber: number;
  decisionNumber: string;
  decisionDate: string;
  summary: string;
  searchCount: number; // Track searches per decision
}

export interface DiplomaField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date';
  required: boolean;
}

export interface Diploma {
  id: string;
  entryNumber: number; // Auto-increments per book
  diplomaNumber: string;
  studentId: string;
  name: string;
  birthDate: string;
  customFields: Record<string, any>; // Dynamic fields from template
  decisionId: string;
  bookId: string;
}

export interface SearchLog {
  id: string;
  decisionId: string;
  searchParams: Record<string, any>;
  timestamp: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  message?: string;
}

// Form types
export interface DiplomaBookForm {
  year: number;
}

export interface GraduationDecisionForm {
  bookId: string;
  batchNumber: number;
  decisionNumber: string;
  decisionDate: string;
  summary: string;
}

export interface DiplomaFieldForm {
  name: string;
  type: 'string' | 'number' | 'date';
  required: boolean;
}

export interface DiplomaForm {
  diplomaNumber: string;
  studentId: string;
  name: string;
  birthDate: string;
  decisionId: string;
  bookId: string;
  customFields: Record<string, any>;
}

export interface DiplomaSearchForm {
  diplomaNumber?: string;
  entryNumber?: string;
  studentId?: string;
  name?: string;
  birthDate?: string;
}