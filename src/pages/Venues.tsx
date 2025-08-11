import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { apiService } from '@/services/api';
import { Venue, Sport } from '@/types';
import { MapPin, Star, Clock, DollarSign, Search, Filter, Grid, List } from 'lucide-react';

const Venues = () => {
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    sport: 'all',
    city: '',
    priceRange: [0, 100] as [number, number],
  });

  useEffect(() => {
    loadData();
  }, []);

  // Separate effect for non-search filters to avoid unnecessary API calls
  useEffect(() => {
    if (allVenues.length > 0) {
      applyFilters();
    }
  }, [filters.sport, filters.city, filters.priceRange, allVenues]);

  const loadData = async () => {
    try {
      const [venuesResponse, sportsResponse] = await Promise.all([
        apiService.getVenues(),
        apiService.getSports(),
      ]);
      setAllVenues(venuesResponse.venues);
      setSports(sportsResponse.sports);
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    if (filters.sport === 'all' && !filters.city && filters.priceRange[0] === 0 && filters.priceRange[1] === 100) {
      // No API filters applied, just use all venues
      return;
    }
    
    setLoading(true);
    try {
      const venuesResponse = await apiService.getVenues({
        sport: filters.sport === 'all' ? undefined : filters.sport,
        city: filters.city || undefined,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
      });
      setAllVenues(venuesResponse.venues);
    } catch (error) {
      console.error('Error filtering venues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use useMemo to filter venues by search term without causing re-renders
  const filteredVenues = useMemo(() => {
    if (!filters.search.trim()) {
      return allVenues;
    }
    
    return allVenues.filter(venue => {
      const venueName = venue.name.toLowerCase();
      const venueCity = (venue as any).city || venue.location?.city || '';
      const searchTerm = filters.search.toLowerCase();
      
      return venueName.includes(searchTerm) || venueCity.toLowerCase().includes(searchTerm);
    });
  }, [allVenues, filters.search]);

  const resetFilters = () => {
    setFilters({
      search: '',
      sport: 'all',
      city: '',
      priceRange: [0, 100],
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sports Venues</h1>
        <p className="text-muted-foreground">
          Discover and book premium sports facilities near you
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search venues..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sport</label>
            <Select
              value={filters.sport}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sport: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sports</SelectItem>
                {sports.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id}>
                    {sport.icon} {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              placeholder="Enter city..."
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Actions</label>
            <Button variant="outline" onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filteredVenues.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground mb-4">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No venues found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
          <Button onClick={resetFilters}>Clear Filters</Button>
        </Card>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
};

const VenueCard = ({ venue, viewMode }: { venue: any; viewMode: 'grid' | 'list' }) => {
  // Handle different data structures from API vs mock
  const venueData = {
    ...venue,
    location: venue.location || { city: venue.city, state: venue.state },
    priceRange: venue.priceRange || { min: venue.minPrice, max: venue.maxPrice },
    photos: venue.photos || [],
    sports: venue.sports || []
  };

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden card-hover">
        <div className="md:flex">
          <div className="md:w-1/3 h-48 md:h-auto bg-muted flex items-center justify-center">
            {venueData.photos[0] ? (
              <img 
                src={typeof venueData.photos[0] === 'string' ? venueData.photos[0] : venueData.photos[0].url} 
                alt={venueData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground">No image</span>
            )}
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold mb-1">{venueData.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {venueData.address}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{venueData.rating || 0}</span>
                <span className="text-xs text-muted-foreground">
                  ({venueData.reviewCount || 0})
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {venueData.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {venueData.sports.map((sport: any) => (
                <Badge key={sport.id} variant="secondary" className="text-xs">
                  {sport.icon} {sport.name}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-1 text-primary" />
                <span className="font-medium">
                  ${venueData.priceRange.min}-${venueData.priceRange.max}/hr
                </span>
              </div>
              <Link to={`/venue/${venueData.id}`}>
                <Button variant="hero">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden card-hover">
      <div className="h-48 bg-muted flex items-center justify-center">
        {venueData.photos[0] ? (
          <img 
            src={typeof venueData.photos[0] === 'string' ? venueData.photos[0] : venueData.photos[0].url}
            alt={venueData.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground">No image</span>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold">{venueData.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{venueData.rating || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {venueData.location.city}, {venueData.location.state}
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {venueData.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {venueData.sports.slice(0, 3).map((sport: any) => (
            <Badge key={sport.id} variant="secondary" className="text-xs">
              {sport.icon} {sport.name}
            </Badge>
          ))}
          {venueData.sports.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{venueData.sports.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-1 text-primary" />
            <span className="font-medium">
              ${venueData.priceRange.min}-${venueData.priceRange.max}/hr
            </span>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Available</span>
          </div>
        </div>
        
        <Link to={`/venue/${venueData.id}`}>
          <Button variant="hero" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default Venues;