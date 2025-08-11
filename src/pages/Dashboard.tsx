import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [userRole] = useState('facility_owner'); // Mock role - could be 'user', 'facility_owner', 'admin'

  // Mock data
  const stats = [
    { title: 'Total Bookings', value: 147, change: '+12%', icon: Calendar, color: 'text-blue-600' },
    { title: 'Active Courts', value: 8, change: '+2', icon: MapPin, color: 'text-green-600' },
    { title: 'Revenue', value: '$4,250', change: '+8%', icon: DollarSign, color: 'text-purple-600' },
    { title: 'Active Users', value: 89, change: '+15%', icon: Users, color: 'text-orange-600' }
  ];

  const recentBookings = [
    { id: 1, user: 'John Smith', court: 'Tennis Court A', date: '2024-12-08', time: '14:00-15:00', status: 'confirmed' },
    { id: 2, user: 'Sarah Wilson', court: 'Basketball Court 1', date: '2024-12-08', time: '16:00-17:00', status: 'pending' },
    { id: 3, user: 'Mike Johnson', court: 'Tennis Court B', date: '2024-12-09', time: '10:00-11:00', status: 'confirmed' }
  ];

  const facilities = [
    { id: 1, name: 'Elite Sports Center', courts: 5, status: 'active', revenue: '$2,100' },
    { id: 2, name: 'Metro Sports Complex', courts: 3, status: 'active', revenue: '$1,850' }
  ];

  const courts = [
    { id: 1, name: 'Tennis Court A', sport: 'Tennis', price: 25, status: 'available' },
    { id: 2, name: 'Tennis Court B', sport: 'Tennis', price: 25, status: 'booked' },
    { id: 3, name: 'Basketball Court 1', sport: 'Basketball', price: 35, status: 'maintenance' }
  ];

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
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          {userRole === 'facility_owner' && (
            <>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="courts">Courts</TabsTrigger>
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
                  Recent Activity
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium text-sm">{booking.user}</p>
                        <p className="text-xs text-muted-foreground">{booking.court}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
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
                <div className="h-64 bg-muted rounded flex items-center justify-center">
                  <p className="text-muted-foreground">Chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Booking
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
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