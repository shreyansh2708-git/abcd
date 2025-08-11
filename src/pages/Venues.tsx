import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, DollarSign } from 'lucide-react';

const Venues = () => {
  const venues = [
    {
      id: 1,
      name: 'Elite Sports Center',
      location: 'Downtown District',
      rating: 4.8,
      reviews: 156,
      sports: ['Tennis', 'Basketball', 'Badminton'],
      priceRange: '$15-45/hr',
      availability: 'Available today',
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      name: 'Metro Sports Complex',
      location: 'Midtown Area',
      rating: 4.6,
      reviews: 89,
      sports: ['Football', 'Basketball'],
      priceRange: '$20-35/hr',
      availability: 'Available tomorrow',
      image: '/api/placeholder/400/250'
    },
    // Add more venues as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Venues</h1>
        <p className="text-muted-foreground">Discover premium sports facilities near you</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden card-hover">
            <div className="h-48 bg-surface flex items-center justify-center">
              <span className="text-muted-foreground">Venue Image</span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold">{venue.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{venue.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                {venue.location}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {venue.sports.map((sport) => (
                  <Badge key={sport} variant="secondary" className="text-xs">
                    {sport}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-1 text-primary" />
                  <span className="font-medium">{venue.priceRange}</span>
                </div>
                <div className="flex items-center text-sm text-success">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{venue.availability}</span>
                </div>
              </div>
              
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => window.location.href = `/venue/${venue.id}`}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Venues;