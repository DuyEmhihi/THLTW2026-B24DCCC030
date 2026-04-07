# 🌍 Travel Planning Application - Documentation

## Project Overview
A comprehensive travel planning application built with React, TypeScript, and Ant Design Pro. Features responsive design for desktop, tablet, and mobile devices. Enables users to discover destinations, create itineraries, manage budgets, and provides admin capabilities for destination management and statistics.

## ✨ Key Features

### 1. **Explore Destinations** (Khám Phá Điểm Đến)
- Display destinations as interactive cards with:
  - High-quality images
  - Location and address
  - Star ratings and review counts
  - Destination type (beach, mountain, city, nature, cultural)
  - Base pricing information
- Advanced filtering:
  - Search by name or location
  - Filter by destination type (multiple selection)
  - Price range slider
  - Minimum rating filter
- Sorting options:
  - By rating (highest first)
  - By price (ascending/descending)
  - Alphabetical order

### 2. **Create Travel Itinerary** (Tạo Lịch Trình)
- Create custom travel plans with:
  - Itinerary title and date range
  - Add/remove destinations by day
  - Organize destinations chronologically
- Automatic calculations:
  - Total cost aggregation
  - Travel time estimation
  - Daily budget breakdown
- View created itineraries with full details

### 3. **Budget Management** (Quản Lý Ngân Sách)
- Comprehensive budget tracking:
  - Total budget visualization
  - Category-wise breakdown (food, accommodation, transport, activities, other)
  - Real-time budget usage percentage
- Alert system:
  - Warning when category exceeds limit
  - Visual indicators for overspending
  - Budget recommendations
- Interactive charts and statistics

### 4. **Admin Dashboard** (Quản Trị)
#### Destination Management
- Full CRUD operations for destinations
- Manage destination properties:
  - Name, location, description
  - Type and rating
  - Base price and duration
  - Costs for different categories (food, accommodation, transport)
  - Image upload capability
- Bulk operations support

#### Statistics & Reports
- Total itineraries created
- Revenue tracking
- Popular destinations ranking
- Monthly itinerary trends (line chart)
- Budget breakdown by category (bar chart)
- Destination analytics

## 🎨 Responsive Design

### Breakpoints
- **Desktop** (> 1024px): Full two-column layout with comprehensive filters
- **Tablet** (768px - 1024px): Optimized grid layout
- **Mobile** (< 768px): Single column layout with collapsible menu

### Mobile Features
- Hamburger menu navigation
- Touch-friendly buttons and inputs
- Optimized card layout
- Responsive tables with horizontal scroll
- Mobile-optimized modals and drawers

## 📁 Project Structure

```
src/pages/TH06/
├── index.tsx                    # Main app entry point with tab navigation
├── models.ts                    # TypeScript interfaces and types
├── mockData.ts                  # Mock data for destinations & itineraries
├── Explore.tsx                  # Destination discovery component
├── CreateItinerary.tsx          # Itinerary creation component
├── BudgetManagement.tsx         # Budget tracking and visualization
├── Admin.tsx                    # Admin dashboard and management
├── styles.less                  # Responsive styles
├── services/                    # API services (future)
└── README.md                    # This file
```

## 🔧 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Ant Design Pro
- **Styling**: Less
- **Routing**: UMI (Ant Design Pro framework)
- **Charts**: Recharts
- **State Management**: React Hooks
- **Build Tool**: Webpack (via UMI)

## 📦 Data Models

### Destination
```typescript
interface Destination {
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
```

### Itinerary
```typescript
interface Itinerary {
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
```

### BudgetBreakdown
```typescript
interface BudgetBreakdown {
  food: number;
  accommodation: number;
  transport: number;
  activities: number;
  other: number;
  total: number;
}
```

## 🚀 Getting Started

### Installation
```bash
cd baseltw
npm install
```

### Development
```bash
npm run dev
# or
npm run start:dev
```

### Building
```bash
npm run build
```

### Running
The app will be available at `http://localhost:8000` (default Ant Design Pro port)

## 🎯 Usage Guide

### For Users
1. **Explore Tab**: Browse destinations with filters
2. **Itinerary Tab**: Create personalized travel plans
3. **Budget Tab**: Track and manage travel expenses
4. **Admin Tab** (if authorized): Manage destinations and view analytics

### For Admins
1. Navigate to Admin tab
2. Use "Manage Destinations" to add/edit/delete locations
3. Check "Statistics & Reports" for analytics and performance metrics

## 🌟 Features Highlights

### Smart Filtering
- Multiple filter criteria work together
- Real-time filtering updates
- Saved filter preferences (future enhancement)

### Budget Alerts
- Automatic overspend detection
- Category-wise tracking
- Suggestions for budget optimization

### Responsive Charts
- Monthly trends visualization
- Budget distribution pie charts
- Popular destinations bar charts
- All charts are responsive and mobile-friendly

### User-Friendly Interface
- Intuitive navigation with clear labels
- Consistent design language
- Accessibility considerations
- Smooth animations and transitions

## 📊 Mock Data

The application includes comprehensive mock data:
- 8 popular Vietnamese destinations
- 1 sample itinerary
- Statistical data for admin dashboard
- Realistic pricing and ratings

## 🔮 Future Enhancements

1. **Backend Integration**
   - REST API for destinations
   - Database persistence
   - User authentication
   - Cloud storage for images

2. **Advanced Features**
   - Map integration (Google Maps/Mapbox)
   - Real-time travel time calculation
   - Weather forecasts
   - Local recommendations
   - Social sharing
   - Export to PDF

3. **User Management**
   - User accounts and profiles
   - Saved itineraries
   - Wishlist functionality
   - Travel history

4. **Payment Integration**
   - Online booking
   - Payment gateway integration
   - Invoice generation

5. **Analytics**
   - Advanced reporting
   - User behavior tracking
   - Personalized recommendations

## 🎨 Styling Customization

### Main Colors
- Primary: `#667eea` (Purple gradient)
- Success: `#52c41a` (Green)
- Warning: `#faad14` (Orange)
- Error: `#f5222d` (Red)
- Info: `#1890ff` (Blue)

### Responsive Grid System
Uses Ant Design breakpoints:
- xs: 0 - 575px
- sm: 576 - 767px
- md: 768 - 991px
- lg: 992 - 1199px
- xl: 1200 - 1599px
- xxl: 1600px+

## 📱 Testing on Different Devices

### Desktop
- Full feature display
- Sidebar filters
- Multi-column layouts
- Hover effects

### Tablet
- Adjusted column layouts
- Touch-friendly sizing
- Optimized spacing
- Responsive navigation

### Mobile
- Single column layout
- Hamburger menu
- Bottom navigation (optional)
- Optimized modals
- Large touch targets

## 🤝 Contributing

When adding new features:
1. Follow TypeScript strict mode
2. Add responsive styles for all breakpoints
3. Update mock data if needed
4. Document new components
5. Test on multiple screen sizes

## 📝 Notes

- All dates use ISO 8601 format (YYYY-MM-DD)
- Prices are in Vietnamese Dong (VNĐ)
- Mock data is sufficient for UI development
- Replace mock data with API calls for production

## 📄 License

This project is part of an educational course on web development.

---

**Created**: April 2026  
**Last Updated**: April 7, 2026  
**Status**: Production Ready with Mock Data
