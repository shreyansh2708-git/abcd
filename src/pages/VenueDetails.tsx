import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, DollarSign, Users, Wifi, Car, Coffee, Shield } from 'lucide-react';

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock venue data - in real app, fetch based on id
  const venue = {
    id: 1,
    name: 'Elite Sports Center',
    location: 'Downtown District',
    rating: 4.8,
    reviews: 156,
    sports: ['Tennis', 'Basketball', 'Badminton'],
    priceRange: '$15-45/hr',
    description: 'Premium sports facility with state-of-the-art equipment and professional-grade courts. Perfect for both casual players and serious athletes.',
    amenities: [
      { name: 'Free WiFi', icon: Wifi },
      { name: 'Parking', icon: Car },
      { name: 'Cafeteria', icon: Coffee },
      { name: 'Security', icon: Shield }
    ],
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400'
    ],
    courts: [
      { id: 1, name: 'Tennis Court A', sport: 'Tennis', price: 25 },
      { id: 2, name: 'Tennis Court B', sport: 'Tennis', price: 25 },
      { id: 3, name: 'Basketball Court 1', sport: 'Basketball', price: 35 }
    ],
    venueReviews: [
      { id: 1, user: 'John Smith', rating: 5, comment: 'Excellent facilities and very clean courts!' },
      { id: 2, user: 'Sarah Johnson', rating: 4, comment: 'Great location and friendly staff.' }
    ]
  };

  const handleBookNow = () => {
    navigate(`/booking/${venue.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="lg:w-2/3">
            <div className="mb-4">
              <div className="h-96 bg-surface rounded-lg flex items-center justify-center overflow-hidden">
                <span className="text-muted-foreground">Venue Image {selectedImage + 1}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {venue.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 bg-surface rounded-lg flex items-center justify-center ${
                    selectedImage === index ? 'border-2 border-primary' : ''
                  }`}
                >
                  <span className="text-xs text-muted-foreground">{index + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Venue Info */}
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <CardTitle className="text-2xl">{venue.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{venue.rating}</span>
                    <span className="text-sm text-muted-foreground">({venue.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  {venue.location}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {venue.sports.map((sport) => (
                    <Badge key={sport} variant="secondary">
                      {sport}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-primary" />
                    <span className="font-semibold text-lg">{venue.priceRange}</span>
                  </div>
                  <div className="flex items-center text-success">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Available today</span>
                  </div>
                </div>
                
                <Button onClick={handleBookNow} variant="hero" className="w-full mb-4">
                  Book Now
                </Button>
                
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Amenities
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <amenity.icon className="h-4 w-4 mr-2 text-primary" />
                        {amenity.name}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About This Venue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{venue.description}</p>
        </CardContent>
      </Card>

      {/* Available Courts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Available Courts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venue.courts.map((court) => (
              <Card key={court.id} className="p-4">
                <h4 className="font-semibold mb-2">{court.name}</h4>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{court.sport}</Badge>
                  <span className="font-medium">${court.price}/hr</span>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {venue.venueReviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.user}</span>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VenueDetails;