// Constants and Configuration for Travel Planning App

// Destination Types
export const DESTINATION_TYPES = {
  BEACH: 'beach',
  MOUNTAIN: 'mountain',
  CITY: 'city',
  NATURE: 'nature',
  CULTURAL: 'cultural',
} as const;

export const DESTINATION_TYPE_LABELS = {
  beach: 'Biển',
  mountain: 'Núi',
  city: 'Thành Phố',
  nature: 'Thiên Nhiên',
  cultural: 'Văn Hóa',
} as const;

export const DESTINATION_TYPE_COLORS = {
  beach: 'blue',
  mountain: 'green',
  city: 'orange',
  nature: 'cyan',
  cultural: 'purple',
} as const;

// Budget Categories
export const BUDGET_CATEGORIES = {
  FOOD: 'food',
  ACCOMMODATION: 'accommodation',
  TRANSPORT: 'transport',
  ACTIVITIES: 'activities',
  OTHER: 'other',
} as const;

export const BUDGET_CATEGORY_LABELS = {
  food: 'Ăn Uống',
  accommodation: 'Lưu Trú',
  transport: 'Di Chuyển',
  activities: 'Hoạt Động',
  other: 'Khác',
} as const;

export const BUDGET_CATEGORY_ICONS = {
  food: '🍔',
  accommodation: '🏨',
  transport: '🚗',
  activities: '🎭',
  other: '📦',
} as const;

// Price Ranges (VNĐ)
export const PRICE_RANGES = {
  MIN: 0,
  MAX: 2000000,
  STEP: 100000,
} as const;

// Rating Options
export const RATING_OPTIONS = [
  { label: 'Không giới hạn', value: null },
  { label: '★★★★★ (5.0+)', value: 5 },
  { label: '★★★★☆ (4.0+)', value: 4 },
  { label: '★★★☆☆ (3.0+)', value: 3 },
  { label: '★★☆☆☆ (2.0+)', value: 2 },
] as const;

// Sort Options
export const SORT_OPTIONS = [
  { label: 'Đánh giá cao nhất', value: 'rating' },
  { label: 'Giá thấp nhất', value: 'price-asc' },
  { label: 'Giá cao nhất', value: 'price-desc' },
  { label: 'Tên A-Z', value: 'name' },
] as const;

// Pagination
export const PAGINATION = {
  PAGE_SIZE_SMALL: 5,
  PAGE_SIZE_MEDIUM: 10,
  PAGE_SIZE_LARGE: 20,
  DEFAULT_PAGE: 1,
} as const;

// Date Formats
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_FULL: 'dddd, DD/MM/YYYY',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm',
} as const;

// Responsive Breakpoints (pixels)
export const BREAKPOINTS = {
  MOBILE: 576,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1200,
  EXTRA_LARGE: 1600,
} as const;

// Default Values
export const DEFAULT_VALUES = {
  CURRENCY: 'VNĐ',
  TIMEZONE: 'Asia/Ho_Chi_Minh',
  LANGUAGE: 'vi-VN',
  ITEMS_PER_PAGE: 12,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
} as const;

// Message Types
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  MILLISECONDS_PER_HOUR: 3600000,
  HOURS_PER_DAY: 24,
  TRAVEL_TIME_PER_100KM: 1, // hours
} as const;

// Status Codes
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 200,
  PRICE_MIN: 0,
  PRICE_MAX: 1000000000,
  RATING_MIN: 0,
  RATING_MAX: 5,
} as const;

// API Endpoints (if using external APIs)
export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  DESTINATIONS: '/destinations',
  ITINERARIES: '/itineraries',
  BUDGETS: '/budgets',
  STATISTICS: '/statistics',
  USERS: '/users',
  TRAVEL: '/travel',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Trường này là bắt buộc',
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PRICE: 'Giá phải là số dương',
  INVALID_RATING: 'Đánh giá phải từ 0 đến 5',
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  NO_DESTINATIONS: 'Hãy chọn ít nhất một địa điểm',
  BUDGET_EXCEEDED: 'Đã vượt quá ngân sách cho loại chi phí này',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATE_SUCCESS: 'Tạo thành công',
  UPDATE_SUCCESS: 'Cập nhật thành công',
  DELETE_SUCCESS: 'Xóa thành công',
  SAVE_SUCCESS: 'Lưu thành công',
  ITINERARY_CREATED: 'Tạo lịch trình thành công!',
  DESTINATION_ADDED: 'Thêm địa điểm thành công',
} as const;

// Confirmation Messages
export const CONFIRMATION_MESSAGES = {
  DELETE_DESTINATION: 'Bạn chắc chắn muốn xóa địa điểm này?',
  DELETE_ITINERARY: 'Bạn chắc chắn muốn xóa lịch trình này?',
  UNSAVED_CHANGES: 'Bạn có những thay đổi chưa lưu. Bạn muốn tiếp tục?',
} as const;

// Feature Flags (for future use)
export const FEATURE_FLAGS = {
  ENABLE_MAP_VIEW: false,
  ENABLE_SOCIAL_SHARING: false,
  ENABLE_EXPORT_PDF: false,
  ENABLE_BOOKINGS: false,
  ENABLE_PAYMENTS: false,
  ENABLE_RECOMMENDATIONS: false,
} as const;

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  USER_PREFERENCES: 'travelApp_userPreferences',
  SAVED_FILTERS: 'travelApp_savedFilters',
  RECENT_SEARCHES: 'travelApp_recentSearches',
  DRAFT_ITINERARIES: 'travelApp_draftItineraries',
  THEME: 'travelApp_theme',
  LANGUAGE: 'travelApp_language',
} as const;

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#f5222d',
  INFO: '#1890ff',
  BACKGROUND: '#f5f5f5',
  BORDER: '#d9d9d9',
  TEXT: '#262626',
  TEXT_SECONDARY: '#666',
} as const;

// Export all constants as a single object for convenience
export const CONSTANTS = {
  DESTINATION_TYPES,
  DESTINATION_TYPE_LABELS,
  DESTINATION_TYPE_COLORS,
  BUDGET_CATEGORIES,
  BUDGET_CATEGORY_LABELS,
  BUDGET_CATEGORY_ICONS,
  PRICE_RANGES,
  RATING_OPTIONS,
  SORT_OPTIONS,
  PAGINATION,
  DATE_FORMATS,
  BREAKPOINTS,
  DEFAULT_VALUES,
  MESSAGE_TYPES,
  TIME_CONSTANTS,
  STATUS_CODES,
  VALIDATION_RULES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CONFIRMATION_MESSAGES,
  FEATURE_FLAGS,
  LOCAL_STORAGE_KEYS,
  THEME_COLORS,
} as const;

export default CONSTANTS;
