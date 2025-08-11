import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Star, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-sports.jpg';

const Hero = () => {
  const stats = [
    { label: 'Active Venues', value: '200+' },
    { label: 'Happy Players', value: '10K+' },
    { label: 'Sports Available', value: '8+' },
    { label: 'Cities Covered', value: '25+' },
  ];

  const popularSports = [
    { name: 'Tennis', courts: 45, color: 'sport-tennis' },
    { name: 'Basketball', courts: 32, color: 'sport-basketball' },
    { name: 'Football', courts: 28, color: 'sport-football' },
    { name: 'Badminton', courts: 38, color: 'sport-badminton' },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                🏆 #1 Sports Booking Platform
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Book Your Perfect{' '}
                <span className="text-gradient">Sports Court</span>{' '}
                in Minutes
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Discover and book premium sports facilities near you. From tennis courts to football pitches - find your game today.
              </p>
            </div>

            {/* Quick Search */}
            <Card className="p-6 shadow-lg bg-card/80 backdrop-blur-sm">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Sport</label>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border bg-background">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Select sport...</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border bg-background">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Near me...</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border bg-background">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Today</span>
                  </div>
                </div>
              </div>
              <Button variant="hero" size="lg" className="w-full mt-4">
                Search Courts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="premium" size="hero" className="animate-pulse-glow">
                Explore Venues
              </Button>
              <Button variant="outline" size="hero">
                How it Works
              </Button>
            </div>
          </div>

          {/* Hero Stats & Sports */}
          <div className="space-y-8 animate-slide-in-right">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 text-center card-hover bg-card/80 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Popular Sports */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Popular Sports
              </h3>
              <div className="space-y-3">
                {popularSports.map((sport, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${sport.color}`} />
                      <span className="font-medium">{sport.name}</span>
                    </div>
                    <Badge variant="secondary">{sport.courts} courts</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;