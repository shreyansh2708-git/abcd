const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
const IS_PRODUCTION = import.meta.env.MODE === 'production';

class ApiService {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.authToken = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Always get the latest token from localStorage
    this.authToken = localStorage.getItem('token');
    
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    console.log(`Response status: ${response.status}`, { 
      url,
      ok: response.ok,
      statusText: response.statusText 
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error(`API Error (${response.status}):`, error);
      throw new Error(error.error || error.message || 'An error occurred');
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.authToken = data.token;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'CUSTOMER' | 'FACILITY_OWNER';
  }) {
    const data = await this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.authToken = data.token;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async updateProfile(userData: {
    name?: string;
    phone?: string;
  }) {
    return this.request<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  logout() {
    this.authToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Venues methods
  async getVenues(params?: {
    sport?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request<{
      venues: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/venues${queryString ? `?${queryString}` : ''}`);
  }

  async getVenueById(id: string) {
    return this.request<any>(`/venues/${id}`);
  }

  // Sports methods
  async getSports() {
    return this.request<{ sports: any[] }>('/sports');
  }

  // Bookings methods
  async getUserBookings() {
    return this.request<{ bookings: any[] }>('/bookings/user');
  }

  async createBooking(bookingData: {
    venueId: string;
    courtId: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    totalPrice: number;
    notes?: string;
  }) {
    return this.request<{ booking: any }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async cancelBooking(bookingId: string) {
    return this.request<{ booking: any }>(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
  }

  // Reviews methods
  async getVenueReviews(venueId: string) {
    return this.request<{ reviews: any[] }>(`/reviews/venue/${venueId}`);
  }

  async createReview(reviewData: {
    venueId: string;
    rating: number;
    comment: string;
  }) {
    return this.request<{ review: any }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // User methods
  async getUserStats() {
    return this.request<{
      totalBookings: number;
      completedBookings: number;
      upcomingBookings: number;
      totalSpent: number;
      favoriteVenues: any[];
      recentActivity: any[];
    }>('/users/stats');
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request<any>('/dashboard/stats');
  }
}

export const apiService = new ApiService();
export default apiService;
