export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'facility_owner' | 'admin';
  avatar?: string;
  createdAt: Date;
  status: 'active' | 'banned' | 'suspended';
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
  };
  ownerId: string;
  sports: Sport[];
  amenities: string[];
  photos: string[];
  rating: number;
  reviewCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Court {
  id: string;
  venueId: string;
  name: string;
  sportId: string;
  pricePerHour: number;
  status: 'active' | 'maintenance';
  amenities: string[];
}

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  cancelledAt?: Date;
  notes?: string;
}

export interface Review {
  id: string;
  userId: string;
  venueId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
  courtId?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedType: 'venue' | 'user';
  reportedId: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeVenues: number;
  totalUsers: number;
  weeklyBookings: { date: string; bookings: number }[];
  popularSports: { sport: string; bookings: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}
