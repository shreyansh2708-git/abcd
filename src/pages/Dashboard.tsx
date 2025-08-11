import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Activity,
  Plus,
  Edit3,
  Trash2,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      const [dashboardStats, bookings] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getUserBookings()
      ]);
      
      setDashboardData(dashboardStats);
      setUserBookings(bookings.bookings || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const userRole = user?.role || 'customer';

  // Dynamic stats based on user role and actual data
  const getStatsForRole = () => {
    if (!dashboardData) {
      return [
        { title: 'Loading...', value: '-', change: '', icon: Calendar, color: 'text-blue-600' },
        { title: 'Loading...', value: '-', change: '', icon: Clock, color: 'text-green-600' },
        { title: 'Loading...', value: '-', change: '', icon: DollarSign, color: 'text-purple-600' },
        { title: 'Loading...', value: '-', change: '', icon: MapPin, color: 'text-orange-600' }
      ];
    }

    if (userRole === 'customer') {
      return [
        { title: 'My Bookings', value: dashboardData.totalBookings || 0, change: `+${dashboardData.totalBookings || 0}`, icon: Calendar, color: 'text-blue-600' },
        { title: 'Upcoming', value: dashboardData.upcomingBookings || 0, change: `+${dashboardData.upcomingBookings || 0}`, icon: Clock, color: 'text-green-600' },
        { title: 'Completed', value: dashboardData.completedBookings || 0, change: `+${dashboardData.completedBookings || 0}`, icon: Activity, color: 'text-purple-600' },
        { title: 'Recent Activity', value: userBookings.length, change: '+2', icon: MapPin, color: 'text-orange-600' }
      ];
    } else if (userRole === 'facility_owner') {
      return [
        { title: 'Total Revenue', value: `$${dashboardData.totalRevenue || 0}`, change: '+8%', icon: DollarSign, color: 'text-purple-600' },
        { title: 'Total Bookings', value: dashboardData.totalBookings || 0, change: '+12%', icon: Calendar, color: 'text-blue-600' },
        { title: 'Active Venues', value: dashboardData.activeVenues || 0, change: '+2', icon: MapPin, color: 'text-green-600' },
        { title: 'Venue Count', value: dashboardData.venueCount || 0, change: '+15%', icon: Users, color: 'text-orange-600' }
      ];
    } else {
      // Admin stats
      return [
        { title: 'Total Users', value: dashboardData.totalUsers || 0, change: '+12%', icon: Users, color: 'text-blue-600' },
        { title: 'Total Venues', value: dashboardData.totalVenues || 0, change: '+2', icon: MapPin, color: 'text-green-600' },
        { title: 'Total Bookings', value: dashboardData.totalBookings || 0, change: '+8%', icon: Calendar, color: 'text-purple-600' },
        { title: 'Total Revenue', value: `$${dashboardData.totalRevenue || 0}`, change: '+15%', icon: DollarSign, color: 'text-orange-600' }
      ];
    }
  };

  const stats = getStatsForRole();

  // Use actual user bookings for recent activity
  const recentActivity = userBookings.slice(0, 5).map(booking => ({
    id: booking.id,
    user: userRole === 'customer' ? (user?.name || 'You') : (booking.user?.name || 'Unknown User'),
    court: booking.court?.name || `Court ${booking.courtId}`,
    date: booking.date,
    time: `${booking.startTime}-${booking.endTime}`,
    status: booking.status
  }));

  // Only define facilities and courts data for facility owners
  const facilities = userRole === 'facility_owner' && dashboardData ? [
    { id: 1, name: 'Elite Sports Center', courts: 5, status: 'active', revenue: `$${(dashboardData.totalRevenue || 0) * 0.6}` },
    { id: 2, name: 'Metro Sports Complex', courts: 3, status: 'active', revenue: `$${(dashboardData.totalRevenue || 0) * 0.4}` }
  ] : [];

  const courts = userRole === 'facility_owner' ? [
    { id: 1, name: 'Tennis Court A', sport: 'Tennis', price: 25, status: 'available' },
    { id: 2, name: 'Tennis Court B', sport: 'Tennis', price: 25, status: 'booked' },
    { id: 3, name: 'Basketball Court 1', sport: 'Basketball', price: 35, status: 'maintenance' }
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'active':
      case 'available':
        return 'bg-success text-success-foreground';
      case 'pending':
      case 'booked':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
      case 'maintenance':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          {userRole === 'facility_owner' 
            ? 'Manage your sports facilities and bookings'
            : userRole === 'admin'
            ? 'Platform overview and administration'
            : 'Your sports booking overview'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-success">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">{userRole === 'customer' ? 'My Bookings' : 'Bookings'}</TabsTrigger>
          {userRole === 'facility_owner' && (
            <>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="courts">Courts</TabsTrigger>
            </>
          )}
          {userRole === 'admin' && (
            <>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  {userRole === 'customer' ? 'My Recent Bookings' : 'Recent Activity'}
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium text-sm">{booking.user}</p>
                          <p className="text-xs text-muted-foreground">{booking.court}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No {userRole === 'customer' ? 'bookings' : 'recent activity'} yet</p>
                      <p className="text-sm">
                        {userRole === 'customer' 
                          ? 'Start by booking your first sports venue!' 
                          : 'Activity will appear here as users make bookings.'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                  <div className="flex items-end space-x-2 h-48">
                    <div className="bg-primary h-16 w-8 rounded-t"></div>
                    <div className="bg-primary h-24 w-8 rounded-t"></div>
                    <div className="bg-primary h-32 w-8 rounded-t"></div>
                    <div className="bg-primary h-28 w-8 rounded-t"></div>
                    <div className="bg-primary h-36 w-8 rounded-t"></div>
                    <div className="bg-primary h-40 w-8 rounded-t"></div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">Monthly booking trends</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {userRole === 'customer' ? 'My Bookings' : 'Recent Bookings'}
              </CardTitle>
              {userRole === 'customer' && (
                <Button variant="outline" size="sm" onClick={() => navigate('/venues')}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Booking
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{booking.user}</p>
                          <p className="text-sm text-muted-foreground">{booking.court}</p>
                        </div>
                        <div className="text-sm">
                          <p className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {booking.date}
                          </p>
                          <p className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {booking.time}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {userRole === 'facility_owner' && (
          <>
            <TabsContent value="facilities">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Facilities</CardTitle>
                  <Button variant="hero" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Facility
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {facilities.map((facility) => (
                      <div key={facility.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{facility.name}</h4>
                          <p className="text-sm text-muted-foreground">{facility.courts} courts</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">{facility.revenue}</p>
                            <Badge className={getStatusColor(facility.status)}>
                              {facility.status}
                            </Badge>
                          </div>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courts">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Court Management</CardTitle>
                  <Button variant="hero" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Court
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courts.map((court) => (
                      <Card key={court.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{court.name}</h4>
                          <Badge className={getStatusColor(court.status)}>
                            {court.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center justify-between">
                            <span className="text-muted-foreground">Sport:</span>
                            <span>{court.sport}</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span>${court.price}/hr</span>
                          </p>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;