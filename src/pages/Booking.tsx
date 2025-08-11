import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, DollarSign, CreditCard } from 'lucide-react';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Mock venue data
  const venue = {
    id: 1,
    name: 'Elite Sports Center',
    location: 'Downtown District',
    courts: [
      { id: '1', name: 'Tennis Court A', sport: 'Tennis', price: 25 },
      { id: '2', name: 'Tennis Court B', sport: 'Tennis', price: 25 },
      { id: '3', name: 'Basketball Court 1', sport: 'Basketball', price: 35 }
    ]
  };

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00'
  ];

  const selectedCourtData = venue.courts.find(court => court.id === selectedCourt);
  const subtotal = selectedCourtData ? selectedCourtData.price : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleBooking = () => {
    if (!selectedDate || !selectedCourt || !selectedTimeSlot) {
      alert('Please select all required fields');
      return;
    }
    
    // Mock booking creation
    alert('Booking confirmed successfully!');
    navigate('/bookings');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book Your Court</h1>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {venue.name} - {venue.location}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Court Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Court</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {venue.courts.map((court) => (
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
                      <Badge variant="outline">{court.sport}</Badge>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-primary" />
                      <span className="font-medium">${court.price}/hour</span>
                    </div>
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

          {/* Time Slot Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Time Slot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
            </CardContent>
          </Card>
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
                      <span className="text-sm font-medium">{selectedTimeSlot}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Subtotal:</span>
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
              
              <Button 
                onClick={handleBooking}
                variant="hero" 
                className="w-full"
                disabled={!selectedDate || !selectedCourt || !selectedTimeSlot}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
              
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