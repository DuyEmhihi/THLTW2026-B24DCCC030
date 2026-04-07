// Data Models for Travel Planning App

export interface Destination {
  id: string;
  name: string;
  image: string;
  location: string;
  description: string;
  rating: number;
  reviewCount: number;
  type: 'beach' | 'mountain' | 'city' | 'nature' | 'cultural';
  basePrice: number;
  duration: number; // hours
  foodCost: number;
  accommodationCost: number;
  transportCost: number;
}

export interface ItineraryItem {
  id: string;
  destinationId: string;
  destination?: Destination;
  day: number;
  date?: string;
  orderInDay: number;
  notes?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  destinations: ItineraryItem[];
  budget: BudgetBreakdown;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetBreakdown {
  food: number;
  accommodation: number;
  transport: number;
  activities: number;
  other: number;
  total: number;
}

export interface BudgetAlert {
  id: string;
  category: keyof BudgetBreakdown;
  limit: number;
  current: number;
  exceeded: boolean;
}

export interface StatisticsData {
  totalItineraries: number;
  totalRevenue: number;
  popularDestinations: Array<{
    destination: Destination;
    count: number;
  }>;
  monthlyItineraries: Array<{
    month: string;
    count: number;
  }>;
  budgetByCategory: BudgetBreakdown;
}
