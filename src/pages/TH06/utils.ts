// Utility functions for Travel Planning App

import dayjs from 'dayjs';
import { CONSTANTS } from './constants';

/**
 * Format currency to Vietnamese Dong
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to display format
 */
export const formatDate = (date: string | Date, format: string = CONSTANTS.DATE_FORMATS.DISPLAY): string => {
  return dayjs(date).format(format);
};

/**
 * Calculate number of days between two dates
 */
export const getDaysBetween = (startDate: string | Date, endDate: string | Date): number => {
  return dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
};

/**
 * Calculate average cost per day
 */
export const calculateDailyAverage = (totalCost: number, days: number): number => {
  return days > 0 ? Math.round(totalCost / days) : 0;
};

/**
 * Calculate cost per person
 */
export const calculatePerPerson = (totalCost: number, numberOfPeople: number): number => {
  return numberOfPeople > 0 ? Math.round(totalCost / numberOfPeople) : 0;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};

/**
 * Check if budget is exceeded
 */
export const isBudgetExceeded = (spent: number, limit: number): boolean => {
  return spent > limit;
};

/**
 * Get budget status color
 */
export const getBudgetStatusColor = (spent: number, limit: number): string => {
  const percentage = (spent / limit) * 100;
  if (percentage > 100) return '#f5222d'; // Red
  if (percentage > 80) return '#faad14'; // Orange
  return '#52c41a'; // Green
};

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format travel time
 */
export const formatTravelTime = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} phút`;
  }
  if (Number.isInteger(hours)) {
    return `${hours} giờ`;
  }
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours} giờ ${minutes} phút`;
};

/**
 * Get destination type label
 */
export const getDestinationTypeLabel = (type: string): string => {
  return CONSTANTS.DESTINATION_TYPE_LABELS[type as keyof typeof CONSTANTS.DESTINATION_TYPE_LABELS] || type;
};

/**
 * Get destination type color
 */
export const getDestinationTypeColor = (type: string): string => {
  return CONSTANTS.DESTINATION_TYPE_COLORS[type as keyof typeof CONSTANTS.DESTINATION_TYPE_COLORS] || 'default';
};

/**
 * Get budget category label
 */
export const getBudgetCategoryLabel = (category: string): string => {
  return CONSTANTS.BUDGET_CATEGORY_LABELS[category as keyof typeof CONSTANTS.BUDGET_CATEGORY_LABELS] || category;
};

/**
 * Get budget category icon
 */
export const getBudgetCategoryIcon = (category: string): string => {
  return CONSTANTS.BUDGET_CATEGORY_ICONS[category as keyof typeof CONSTANTS.BUDGET_CATEGORY_ICONS] || '📦';
};

/**
 * Sort array of objects by property
 */
export const sortByProperty = (array: any[], property: string, ascending: boolean = true): any[] => {
  return [...array].sort((a, b) => {
    if (a[property] < b[property]) return ascending ? -1 : 1;
    if (a[property] > b[property]) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array by multiple criteria
 */
export const filterByMultipleCriteria = (
  array: any[],
  criteria: { [key: string]: any }
): any[] => {
  return array.filter((item) => {
    return Object.entries(criteria).every(([key, value]) => {
      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }
      return item[key] === value;
    });
  });
};

/**
 * Group array items by property
 */
export const groupByProperty = (array: any[], property: string): { [key: string]: any[] } => {
  return array.reduce((groupedArray, item) => {
    const key = item[property];
    if (!groupedArray[key]) {
      groupedArray[key] = [];
    }
    groupedArray[key].push(item);
    return groupedArray;
  }, {} as { [key: string]: any[] });
};

/**
 * Calculate total from array of objects
 */
export const calculateTotal = (array: any[], property: string): number => {
  return array.reduce((total, item) => total + (item[property] || 0), 0);
};

/**
 * Check if date is in past
 */
export const isDateInPast = (date: string | Date): boolean => {
  return dayjs(date).isBefore(dayjs().startOf('day'));
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().startOf('day'), 'day');
};

/**
 * Check if date is tomorrow
 */
export const isTomorrow = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().add(1, 'day').startOf('day'), 'day');
};

/**
 * Get relative date label
 */
export const getRelativeDateLabel = (date: string | Date): string => {
  if (isToday(date)) return 'Hôm nay';
  if (isTomorrow(date)) return 'Ngày mai';
  if (isDateInPast(date)) return 'Đã qua';
  return formatDate(date);
};

/**
 * Debounce function
 */
export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return (...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge arrays without duplicates
 */
export const mergeArrays = <T>(array1: T[], array2: T[], key?: string): T[] => {
  if (!key) {
    return Array.from(new Set([...array1, ...array2]));
  }
  const merged = [...array1];
  const existingKeys = new Set(array1.map((item: any) => item[key]));
  array2.forEach((item: any) => {
    if (!existingKeys.has(item[key])) {
      merged.push(item);
    }
  });
  return merged;
};

/**
 * Get browser locale
 */
export const getBrowserLocale = (): string => {
  return navigator.language || navigator.languages?.[0] || 'en-US';
};

/**
 * Check if device is mobile
 */
export const isMobileDevice = (): boolean => {
  return window.innerWidth <= CONSTANTS.BREAKPOINTS.MOBILE;
};

/**
 * Check if device is tablet
 */
export const isTabletDevice = (): boolean => {
  return (
    window.innerWidth > CONSTANTS.BREAKPOINTS.MOBILE &&
    window.innerWidth <= CONSTANTS.BREAKPOINTS.TABLET
  );
};

/**
 * Check if device is desktop
 */
export const isDesktopDevice = (): boolean => {
  return window.innerWidth > CONSTANTS.BREAKPOINTS.DESKTOP;
};

/**
 * Export data to JSON file
 */
export const exportToJSON = (data: any, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sleep function (for demos/testing)
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default {
  formatCurrency,
  formatDate,
  getDaysBetween,
  calculateDailyAverage,
  calculatePerPerson,
  calculatePercentage,
  isBudgetExceeded,
  getBudgetStatusColor,
  isValidEmail,
  formatTravelTime,
  getDestinationTypeLabel,
  getDestinationTypeColor,
  getBudgetCategoryLabel,
  getBudgetCategoryIcon,
  sortByProperty,
  filterByMultipleCriteria,
  groupByProperty,
  calculateTotal,
  isDateInPast,
  isToday,
  isTomorrow,
  getRelativeDateLabel,
  debounce,
  throttle,
  deepClone,
  mergeArrays,
  getBrowserLocale,
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  exportToJSON,
  copyToClipboard,
  generateId,
  sleep,
};
