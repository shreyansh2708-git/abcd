import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Shield, 
  CreditCard, 
  MapPin, 
  Star, 
  Calendar,
  Smartphone,
  Users,
  Zap
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Clock,
      title: 'Instant Booking',
      description: 'Book courts in real-time with instant confirmation. No waiting, no hassle.',
      badge: 'Fast',
      color: 'text-blue-500'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your payments are protected with bank-level security and encryption.',
      badge: 'Safe',
      color: 'text-green-500'
    },
    {
      icon: MapPin,
      title: 'Location Finder',
      description: 'Find courts near you with precise location mapping and directions.',
      badge: 'Smart',
      color: 'text-purple-500'
    },
    {
      icon: Star,
      title: 'Quality Venues',
      description: 'All venues are verified and rated by our community of players.',
      badge: 'Verified',
      color: 'text-yellow-500'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Book for today or plan ahead. Cancel or reschedule easily.',
      badge: 'Flexible',
      color: 'text-indigo-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Book on the go with our responsive mobile-first design.',
      badge: 'Mobile',
      color: 'text-pink-500'
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'For Players',
      points: [
        'Discover new venues in your area',
        'Real-time availability and pricing',
        'Secure online payments',
        'Community reviews and ratings'
      ]
    },
    {
      icon: Zap,
      title: 'For Venue Owners',
      points: [
        'Increase bookings and revenue',
        'Manage courts and schedules',
        'Analytics and insights',
        'Automated payment processing'
      ]
    }
  ];

  return (
    <section className="py-24 bg-surface/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            ⚡ Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="text-gradient">Play Your Game</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            QuickCourt brings together players and venues with cutting-edge technology 
            and a seamless booking experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 card-hover group">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
              </div>
              <ul className="space-y-3">
                {benefit.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;