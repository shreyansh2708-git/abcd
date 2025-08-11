import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, User } from 'lucide-react';

const Bookings = () => {
  const bookings = [
    {
      id: 1,
      venue: 'Elite Sports Center',
      court: 'Tennis Court A',
      date: 'Today',
      time: '2:00 PM - 3:00 PM',
      status: 'confirmed',
      location: 'Downtown District',
      player: 'John Doe'
    },
    {
      id: 2,
      venue: 'Metro Sports Complex',
      court: 'Basketball Court 1',
      date: 'Tomorrow',
      time: '6:00 PM - 7:00 PM',
      status: 'confirmed',
      location: 'Midtown Area',
      player: 'John Doe'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Manage your court reservations</p>
      </div>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold">{booking.venue}</h3>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{booking.court}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline">
                  View Details
                </Button>
                <Button variant="destructive">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Bookings;