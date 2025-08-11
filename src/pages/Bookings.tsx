import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { bookingService, venueService } from '@/services/mockData';
import { Booking, Venue } from '@/types';
import { Calendar, MapPin, Clock, User, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Bookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<{ [key: string]: Venue }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    if (!user) return;
    
    try {
      const userBookings = await bookingService.getByUserId(user.id);
      setBookings(userBookings);
      
      // Load venue details for each booking
      const venueIds = [...new Set(userBookings.map(b => b.venueId))];
      const venueDetails: { [key: string]: Venue } = {};
      
      await Promise.all(
        venueIds.map(async (venueId) => {
          const venue = await venueService.getById(venueId);
          if (venue) {
            venueDetails[venueId] = venue;
          }
        })
      );
      
      setVenues(venueDetails);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.cancel(bookingId);
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
      loadBookings(); // Reload bookings
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const isBookingCancellable = (booking: Booking) => {
    if (booking.status !== 'confirmed') return false;
    
    const bookingDateTime = new Date(`${booking.date} ${booking.startTime}`);
    const now = new Date();
    const timeDiff = bookingDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return hoursDiff > 2; // Can cancel if more than 2 hours before booking
  };

  const filterBookings = (status: string) => {
    switch (status) {
      case 'upcoming':
        return bookings.filter(b => b.status === 'confirmed' && new Date(`${b.date} ${b.startTime}`) > new Date());
      case 'past':
        return bookings.filter(b => b.status === 'completed' || new Date(`${b.date} ${b.startTime}`) < new Date());
      case 'cancelled':
        return bookings.filter(b => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-6 w-48" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredBookings = filterBookings(activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Manage your court reservations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {filteredBookings.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground mb-4">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                <p>
                  {activeTab === 'all' 
                    ? "You haven't made any bookings yet." 
                    : `No ${activeTab} bookings found.`}
                </p>
              </div>
              <Link to="/venues">
                <Button>Browse Venues</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => {
                const venue = venues[booking.venueId];
                
                return (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">
                              {venue?.name || 'Unknown Venue'}
                            </h3>
                            <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                              {getStatusIcon(booking.status)}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{venue?.location.city || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4" />
                              <span>${booking.totalPrice}</span>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <span className="text-muted-foreground">Court: </span>
                            <span className="font-medium">Court #{booking.courtId}</span>
                            {booking.notes && (
                              <>
                                <span className="text-muted-foreground ml-4">Notes: </span>
                                <span>{booking.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link to={`/venue/${booking.venueId}`}>
                            <Button variant="outline" className="w-full sm:w-auto">
                              View Venue
                            </Button>
                          </Link>
                          
                          {isBookingCancellable(booking) && (
                            <Button 
                              variant="destructive" 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="w-full sm:w-auto"
                            >
                              Cancel
                            </Button>
                          )}
                          
                          {booking.status === 'confirmed' && !isBookingCancellable(booking) && (
                            <div className="text-xs text-muted-foreground text-center sm:text-right">
                              Cannot cancel<br />
                              (less than 2hrs)
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      {bookings.length > 0 && (
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">
              {bookings.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Bookings</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => b.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">
              ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Bookings;