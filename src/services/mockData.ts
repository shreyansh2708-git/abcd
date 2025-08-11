import { Venue, Sport, Court, Booking, User } from '@/types';

export const mockSports: Sport[] = [
  { id: '1', name: 'Tennis', icon: '🎾', color: 'bg-green-500' },
  { id: '2', name: 'Basketball', icon: '🏀', color: 'bg-orange-500' },
  { id: '3', name: 'Football', icon: '⚽', color: 'bg-blue-500' },
  { id: '4', name: 'Badminton', icon: '🏸', color: 'bg-yellow-500' },
  { id: '5', name: 'Cricket', icon: '🏏', color: 'bg-red-500' },
  { id: '6', name: 'Table Tennis', icon: '🏓', color: 'bg-purple-500' },
  { id: '7', name: 'Volleyball', icon: '🏐', color: 'bg-pink-500' },
  { id: '8', name: 'Swimming', icon: '🏊', color: 'bg-cyan-500' },
];

export const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Elite Sports Complex',
    description: 'Premium sports facility with world-class amenities and professional-grade courts.',
    address: '123 Sports Avenue, Downtown',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      city: 'New York',
      state: 'NY'
    },
    ownerId: '2',
    sports: [mockSports[0], mockSports[1], mockSports[3]],
    amenities: ['Parking', 'Changing Rooms', 'Cafeteria', 'Equipment Rental', 'Air Conditioning'],
    photos: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'
    ],
    rating: 4.8,
    reviewCount: 156,
    priceRange: { min: 25, max: 80 },
    status: 'approved',
    createdAt: new Date('2024-01-15'),
    operatingHours: {
      Monday: { open: '06:00', close: '22:00', closed: false },
      Tuesday: { open: '06:00', close: '22:00', closed: false },
      Wednesday: { open: '06:00', close: '22:00', closed: false },
      Thursday: { open: '06:00', close: '22:00', closed: false },
      Friday: { open: '06:00', close: '23:00', closed: false },
      Saturday: { open: '07:00', close: '23:00', closed: false },
      Sunday: { open: '07:00', close: '21:00', closed: false },
    }
  },
  {
    id: '2',
    name: 'City Sports Hub',
    description: 'Modern sports facility in the heart of the city with multiple courts and excellent facilities.',
    address: '456 Central Park, Midtown',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      city: 'New York',
      state: 'NY'
    },
    ownerId: '2',
    sports: [mockSports[1], mockSports[2], mockSports[4]],
    amenities: ['Parking', 'Changing Rooms', 'Showers', 'Pro Shop'],
    photos: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'
    ],
    rating: 4.5,
    reviewCount: 89,
    priceRange: { min: 20, max: 60 },
    status: 'approved',
    createdAt: new Date('2024-02-01'),
    operatingHours: {
      Monday: { open: '07:00', close: '21:00', closed: false },
      Tuesday: { open: '07:00', close: '21:00', closed: false },
      Wednesday: { open: '07:00', close: '21:00', closed: false },
      Thursday: { open: '07:00', close: '21:00', closed: false },
      Friday: { open: '07:00', close: '22:00', closed: false },
      Saturday: { open: '08:00', close: '22:00', closed: false },
      Sunday: { open: '08:00', close: '20:00', closed: false },
    }
  },
  {
    id: '3',
    name: 'Riverside Sports Center',
    description: 'Beautiful riverside location with outdoor courts and scenic views.',
    address: '789 Riverside Drive, Uptown',
    location: {
      latitude: 40.8176,
      longitude: -73.9482,
      city: 'New York',
      state: 'NY'
    },
    ownerId: '2',
    sports: [mockSports[0], mockSports[2], mockSports[6]],
    amenities: ['Parking', 'Outdoor Courts', 'Scenic Views', 'Snack Bar'],
    photos: [
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'
    ],
    rating: 4.3,
    reviewCount: 67,
    priceRange: { min: 15, max: 45 },
    status: 'approved',
    createdAt: new Date('2024-01-20'),
    operatingHours: {
      Monday: { open: '06:00', close: '20:00', closed: false },
      Tuesday: { open: '06:00', close: '20:00', closed: false },
      Wednesday: { open: '06:00', close: '20:00', closed: false },
      Thursday: { open: '06:00', close: '20:00', closed: false },
      Friday: { open: '06:00', close: '21:00', closed: false },
      Saturday: { open: '07:00', close: '21:00', closed: false },
      Sunday: { open: '07:00', close: '19:00', closed: false },
    }
  }
];

export const mockCourts: Court[] = [
  // Elite Sports Complex courts
  { id: '1', venueId: '1', name: 'Court A - Tennis', sportId: '1', pricePerHour: 30, status: 'active', amenities: ['LED Lighting', 'Hard Court'] },
  { id: '2', venueId: '1', name: 'Court B - Tennis', sportId: '1', pricePerHour: 30, status: 'active', amenities: ['LED Lighting', 'Hard Court'] },
  { id: '3', venueId: '1', name: 'Court 1 - Basketball', sportId: '2', pricePerHour: 40, status: 'active', amenities: ['Indoor', 'Professional Hoops'] },
  { id: '4', venueId: '1', name: 'Court 1 - Badminton', sportId: '4', pricePerHour: 25, status: 'active', amenities: ['Wooden Floor', 'High Ceiling'] },
  
  // City Sports Hub courts
  { id: '5', venueId: '2', name: 'Court 1 - Basketball', sportId: '2', pricePerHour: 35, status: 'active', amenities: ['Indoor', 'Sound System'] },
  { id: '6', venueId: '2', name: 'Court 2 - Basketball', sportId: '2', pricePerHour: 35, status: 'active', amenities: ['Indoor', 'Sound System'] },
  { id: '7', venueId: '2', name: 'Field A - Football', sportId: '3', pricePerHour: 60, status: 'active', amenities: ['Artificial Turf', 'Floodlights'] },
  
  // Riverside Sports Center courts
  { id: '8', venueId: '3', name: 'Court 1 - Tennis', sportId: '1', pricePerHour: 25, status: 'active', amenities: ['Outdoor', 'Clay Court'] },
  { id: '9', venueId: '3', name: 'Court 2 - Tennis', sportId: '1', pricePerHour: 25, status: 'active', amenities: ['Outdoor', 'Clay Court'] },
  { id: '10', venueId: '3', name: 'Field 1 - Football', sportId: '3', pricePerHour: 45, status: 'active', amenities: ['Outdoor', 'Natural Grass'] },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    venueId: '1',
    courtId: '1',
    date: '2024-12-15',
    startTime: '10:00',
    endTime: '11:00',
    duration: 1,
    totalPrice: 30,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: new Date('2024-12-10'),
    notes: 'Singles match'
  },
  {
    id: '2',
    userId: '1',
    venueId: '2',
    courtId: '5',
    date: '2024-12-18',
    startTime: '18:00',
    endTime: '19:00',
    duration: 1,
    totalPrice: 35,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: new Date('2024-12-12'),
    notes: 'Team practice'
  },
  {
    id: '3',
    userId: '1',
    venueId: '3',
    courtId: '8',
    date: '2024-12-20',
    startTime: '16:00',
    endTime: '17:30',
    duration: 1.5,
    totalPrice: 37.5,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: new Date('2024-12-14')
  }
];

// API simulation functions
export const venueService = {
  getAll: async (filters?: { sport?: string; city?: string; priceRange?: [number, number] }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let venues = [...mockVenues];
    
    if (filters?.sport && filters.sport !== 'all') {
      venues = venues.filter(venue => 
        venue.sports.some(sport => sport.id === filters.sport)
      );
    }
    
    if (filters?.city) {
      venues = venues.filter(venue => 
        venue.location.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    if (filters?.priceRange) {
      venues = venues.filter(venue => 
        venue.priceRange.min <= filters.priceRange![1] && 
        venue.priceRange.max >= filters.priceRange![0]
      );
    }
    
    return venues;
  },
  
  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockVenues.find(venue => venue.id === id);
  },
  
  getCourts: async (venueId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCourts.filter(court => court.venueId === venueId);
  }
};

export const bookingService = {
  getByUserId: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockBookings.filter(booking => booking.userId === userId);
  },
  
  create: async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    mockBookings.push(newBooking);
    return newBooking;
  },
  
  cancel: async (bookingId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const booking = mockBookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
      booking.cancelledAt = new Date();
    }
    return booking;
  }
};

export const sportsService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSports;
  }
};
