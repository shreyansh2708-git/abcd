import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { venueService, bookingService } from '@/services/mockData';
import { Venue, Court } from '@/types';
import { MapPin, Clock, DollarSign, CreditCard, ArrowLeft } from 'lucide-react';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [duration, setDuration] = useState(1); // hours
  const [bookingStep, setBookingStep] = useState<'selection' | 'payment' | 'confirmation'>('selection');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (id) {
      loadBookingData(id);
    }
  }, [id, user, navigate]);

  const loadBookingData = async (venueId: string) => {
    try {
      const [venueData, courtsData] = await Promise.all([
        venueService.getById(venueId),
        venueService.getCourts(venueId),
      ]);
      
      if (venueData) {
        setVenue(venueData);
        setCourts(courtsData);
      } else {
        navigate('/venues');
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
      navigate('/venues');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const selectedCourtData = courts.find(court => court.id === selectedCourt);
  const subtotal = selectedCourtData ? selectedCourtData.pricePerHour * duration : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const getEndTime = (startTime: string, durationHours: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + durationHours;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedCourt || !selectedTimeSlot || !user || !venue) {
      toast({
        title: 'Missing information',
        description: 'Please select all required fields',
        variant: 'destructive',
      });
      return;
    }

    setBookingStep('payment');
  };

  const handlePayment = async () => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingData = {
        userId: user!.id,
        venueId: venue!.id,
        courtId: selectedCourt,
        date: selectedDate!.toISOString().split('T')[0],
        startTime: selectedTimeSlot,
        endTime: getEndTime(selectedTimeSlot, duration),
        duration,
        totalPrice: total,
        status: 'confirmed' as const,
        paymentStatus: 'paid' as const,
      };

      await bookingService.create(bookingData);
      setBookingStep('confirmation');
      
      toast({
        title: 'Booking confirmed!',
        description: 'Your court has been successfully booked.',
      });
    } catch (error) {
      toast({
        title: 'Booking failed',
        description: 'Unable to process your booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Venue Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The venue you're trying to book doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/venues')}>
            Browse All Venues
          </Button>
        </Card>
      </div>
    );
  }

  if (bookingStep === 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Your court booking has been successfully confirmed. You will receive a confirmation email shortly.
          </p>
          
          <div className="bg-muted rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-4">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Venue:</span>
                <span className="font-medium">{venue.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Court:</span>
                <span className="font-medium">{selectedCourtData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">{selectedTimeSlot} - {getEndTime(selectedTimeSlot, duration)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total Paid:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/bookings')}>
              View My Bookings
            </Button>
            <Button variant="outline" onClick={() => navigate('/venues')}>
              Book Another Court
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate(`/venue/${venue.id}`)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Venue
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {bookingStep === 'payment' ? 'Complete Payment' : 'Book Your Court'}
          </h1>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {venue.name} - {venue.address}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {bookingStep === 'selection' && (
            <>
              {/* Court Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Court</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {courts.map((court) => (
                      <div
                        key={court.id}
                        onClick={() => setSelectedCourt(court.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCourt === court.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{court.name}</h4>
                          <Badge variant="outline">
                            {venue.sports.find(s => s.id === court.sportId)?.name}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-primary" />
                          <span className="font-medium">${court.pricePerHour}/hour</span>
                        </div>
                        {court.amenities.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {court.amenities.slice(0, 2).map((amenity, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Date Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Time & Duration Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Time & Duration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Duration (hours)</label>
                    <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-3 block">Start Time</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                            selectedTimeSlot === slot 
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : 'border-border hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    {selectedTimeSlot && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Duration: {selectedTimeSlot} - {getEndTime(selectedTimeSlot, duration)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {bookingStep === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Demo Payment</p>
                  <p className="text-sm">
                    This is a demo application. No actual payment will be processed.
                    Click "Process Payment" to simulate a successful payment.
                  </p>
                </div>
                
                <Button onClick={handlePayment} variant="hero" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Process Payment (Demo)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCourtData && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Court:</span>
                    <span className="text-sm font-medium">{selectedCourtData.name}</span>
                  </div>
                  
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span className="text-sm font-medium">
                        {selectedDate.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {selectedTimeSlot && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Time:</span>
                      <span className="text-sm font-medium">
                        {selectedTimeSlot} - {getEndTime(selectedTimeSlot, duration)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="text-sm font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        ${selectedCourtData.pricePerHour}/hr × {duration}h:
                      </span>
                      <span className="text-sm font-medium">${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tax (10%):</span>
                      <span className="text-sm font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {bookingStep === 'selection' && (
                <Button 
                  onClick={handleBooking}
                  variant="hero" 
                  className="w-full"
                  disabled={!selectedDate || !selectedCourt || !selectedTimeSlot}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Continue to Payment
                </Button>
              )}
              
              <p className="text-xs text-muted-foreground text-center">
                By booking, you agree to our terms and conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;