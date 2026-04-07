// API Services for Travel Planning Application
// These are placeholder services that can be connected to real API endpoints

import { Destination, Itinerary, StatisticsData } from './models';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Destination Services
export const destinationService = {
  // Get all destinations
  async getAll(): Promise<Destination[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  },

  // Get destination by ID
  async getById(id: string): Promise<Destination> {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching destination:', error);
      throw error;
    }
  },

  // Create new destination
  async create(destination: Omit<Destination, 'id'>): Promise<Destination> {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destination),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating destination:', error);
      throw error;
    }
  },

  // Update destination
  async update(id: string, destination: Partial<Destination>): Promise<Destination> {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destination),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating destination:', error);
      throw error;
    }
  },

  // Delete destination
  async delete(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/destinations/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting destination:', error);
      throw error;
    }
  },

  // Search destinations
  async search(query: string): Promise<Destination[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations/search?q=${encodeURIComponent(query)}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching destinations:', error);
      throw error;
    }
  },

  // Filter destinations
  async filter(filters: any): Promise<Destination[]> {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/destinations/filter?${queryString}`);
      return await response.json();
    } catch (error) {
      console.error('Error filtering destinations:', error);
      throw error;
    }
  },

  // Upload destination image
  async uploadImage(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(`${API_BASE_URL}/destinations/upload-image`, {
        method: 'POST',
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};

// Itinerary Services
export const itineraryService = {
  // Get all itineraries
  async getAll(): Promise<Itinerary[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/itineraries`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      throw error;
    }
  },

  // Get itinerary by ID
  async getById(id: string): Promise<Itinerary> {
    try {
      const response = await fetch(`${API_BASE_URL}/itineraries/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      throw error;
    }
  },

  // Create new itinerary
  async create(itinerary: Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Itinerary> {
    try {
      const response = await fetch(`${API_BASE_URL}/itineraries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itinerary),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating itinerary:', error);
      throw error;
    }
  },

  // Update itinerary
  async update(id: string, itinerary: Partial<Itinerary>): Promise<Itinerary> {
    try {
      const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itinerary),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating itinerary:', error);
      throw error;
    }
  },

  // Delete itinerary
  async delete(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/itineraries/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      throw error;
    }
  },

  // Get user's itineraries
  async getUserItineraries(userId: string): Promise<Itinerary[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/itineraries`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching user itineraries:', error);
      throw error;
    }
  },
};

// Budget Services
export const budgetService = {
  // Calculate total cost for itinerary
  async calculateCost(itineraryId: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${itineraryId}/calculate`);
      const data = await response.json();
      return data.total;
    } catch (error) {
      console.error('Error calculating cost:', error);
      throw error;
    }
  },

  // Get budget breakdown
  async getBudgetBreakdown(itineraryId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${itineraryId}/breakdown`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching budget breakdown:', error);
      throw error;
    }
  },

  // Estimate travel cost
  async estimateCost(destinations: string[], startDate: string, endDate: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinations, startDate, endDate }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error estimating cost:', error);
      throw error;
    }
  },
};

// Statistics Services
export const statisticsService = {
  // Get admin statistics
  async getAdminStats(): Promise<StatisticsData> {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics/admin`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Get popular destinations
  async getPopularDestinations(limit: number = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics/popular-destinations?limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      throw error;
    }
  },

  // Get monthly statistics
  async getMonthlyStats(year: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics/monthly?year=${year}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching monthly statistics:', error);
      throw error;
    }
  },

  // Get revenue data
  async getRevenueData(startDate: string, endDate: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics/revenue?startDate=${startDate}&endDate=${endDate}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  },
};

// Travel Distance/Time Calculation (e.g., using Google Maps API)
export const travelService = {
  // Calculate travel time between two destinations
  async calculateTravelTime(origin: string, destination: string): Promise<number> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/travel/time?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
      );
      const data = await response.json();
      return data.duration; // in minutes
    } catch (error) {
      console.error('Error calculating travel time:', error);
      throw error;
    }
  },

  // Get route information
  async getRoute(origin: string, destination: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/travel/route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching route:', error);
      throw error;
    }
  },
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError(error: any): string {
    if (error.response) {
      return error.response.data?.message || 'An error occurred';
    }
    return error.message || 'An unknown error occurred';
  },

  // Format API request error
  formatErrorMessage(status: number, message: string): string {
    const statusMessages: { [key: number]: string } = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Server Error',
      503: 'Service Unavailable',
    };
    return `${statusMessages[status] || 'Error'}: ${message}`;
  },
};

export default {
  destinationService,
  itineraryService,
  budgetService,
  statisticsService,
  travelService,
  apiUtils,
};
