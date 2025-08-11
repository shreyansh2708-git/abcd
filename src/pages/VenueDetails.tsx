import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { venueService } from '@/services/mockData';
import { Venue, Court } from '@/types';
import { MapPin, Star, Clock, DollarSign, Users, Wifi, Car, Coffee, Shield, Calendar, Phone, Mail, ArrowLeft } from 'lucide-react';

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      loadVenueData(id);
    }
  }, [id]);

  const loadVenueData = async (venueId: string) => {
    try {
      const [venueData, courtsData] = await Promise.all([
        venueService.getById(venueId),
        venueService.getCourts(venueId),
      ]);
      
      if (venueData) {
        setVenue(venueData);
        setCourts(courtsData);
      } else {
        // Venue not found
        navigate('/venues');
      }
    } catch (error) {
      console.error('Error loading venue:', error);
      navigate('/venues');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${venue?.id}`);
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'Parking': Car,
      'WiFi': Wifi,
      'Cafeteria': Coffee,
      'Security': Shield,
      'Changing Rooms': Users,
      'Equipment Rental': DollarSign,
      'Air Conditioning': Users,
      'Showers': Users,
      'Pro Shop': Users,
      'Outdoor Courts': Users,
      'Scenic Views': Users,
      'Snack Bar': Coffee,
    };
    return iconMap[amenity] || Users;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Skeleton className="h-96 w-full mb-4" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20" />
              ))}
            </div>
          </div>
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-6 w-1/2" />
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
            The venue you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/venues')}>
            Browse All Venues
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="lg:w-2/3">
            <div className="mb-4">
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {venue.photos[selectedImage] ? (
                  <img 
                    src={venue.photos[selectedImage]} 
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground">No image available</span>
                )}
              </div>
            </div>
            {venue.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {venue.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${
                      selectedImage === index ? 'border-2 border-primary' : ''
                    }`}
                  >
                    <img 
                      src={photo} 
                      alt={`${venue.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
                    <span className="text-sm text-muted-foreground">
                      ({venue.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  {venue.address}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {venue.sports.map((sport) => (
                    <Badge key={sport.id} variant="secondary">
                      {sport.icon} {sport.name}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-primary" />
                    <span className="font-semibold text-lg">
                      ${venue.priceRange.min}-${venue.priceRange.max}/hr
                    </span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Available</span>
                  </div>
                </div>
                
                <Button onClick={handleBookNow} variant="hero" className="w-full mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Amenities</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {venue.amenities.map((amenity, index) => {
                      const IconComponent = getAmenityIcon(amenity);
                      return (
                        <div key={index} className="flex items-center text-sm">
                          <IconComponent className="h-4 w-4 mr-2 text-primary" />
                          {amenity}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courts">Courts</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Venue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{venue.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Operating Hours</h4>
                  <div className="space-y-2">
                    {Object.entries(venue.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="font-medium">{day}</span>
                        <span className={hours.closed ? "text-muted-foreground" : ""}>
                          {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      <span>info@{venue.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-primary mt-0.5" />
                      <span>{venue.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Courts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courts.map((court) => (
                  <Card key={court.id} className="p-4 border">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold">{court.name}</h4>
                      <Badge 
                        variant={court.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {court.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sport</span>
                        <span>{venue.sports.find(s => s.id === court.sportId)?.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">${court.pricePerHour}/hr</span>
                      </div>
                    </div>
                    
                    {court.amenities.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {court.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amenities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Facility Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {venue.amenities.map((amenity, index) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div key={index} className="flex items-center p-4 border rounded-lg">
                      <IconComponent className="h-6 w-6 mr-3 text-primary" />
                      <span className="font-medium">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mock Reviews */}
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">John Doe</p>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Excellent facilities! The courts are well-maintained and the staff is very helpful. Great location and parking availability.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b73b6d02?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Sarah Miller</p>
                          <div className="flex items-center">
                            {[1, 2, 3, 4].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="h-3 w-3 text-gray-300" />
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Good venue overall. The booking system is easy to use and the courts are clean. Could use better lighting for evening games.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback>MJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Mike Johnson</p>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Amazing tennis courts! Professional quality surfaces and excellent amenities. Will definitely book again.
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button variant="outline" size="sm">Load More Reviews</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VenueDetails;