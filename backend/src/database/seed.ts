import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sports
  const sports = await Promise.all([
    prisma.sport.upsert({
      where: { id: 'tennis' },
      update: {},
      create: {
        id: 'tennis',
        name: 'Tennis',
        icon: '🎾',
        color: '#10B981'
      }
    }),
    prisma.sport.upsert({
      where: { id: 'basketball' },
      update: {},
      create: {
        id: 'basketball',
        name: 'Basketball',
        icon: '🏀',
        color: '#F59E0B'
      }
    }),
    prisma.sport.upsert({
      where: { id: 'football' },
      update: {},
      create: {
        id: 'football',
        name: 'Football',
        icon: '⚽',
        color: '#EF4444'
      }
    }),
    prisma.sport.upsert({
      where: { id: 'badminton' },
      update: {},
      create: {
        id: 'badminton',
        name: 'Badminton',
        icon: '🏸',
        color: '#8B5CF6'
      }
    }),
    prisma.sport.upsert({
      where: { id: 'volleyball' },
      update: {},
      create: {
        id: 'volleyball',
        name: 'Volleyball',
        icon: '🏐',
        color: '#06B6D4'
      }
    })
  ]);

  console.log('✅ Created sports');

  // Create amenities
  const amenities = await Promise.all([
    prisma.amenity.upsert({
      where: { id: 'parking' },
      update: {},
      create: {
        id: 'parking',
        name: 'Parking',
        icon: '🚗'
      }
    }),
    prisma.amenity.upsert({
      where: { id: 'wifi' },
      update: {},
      create: {
        id: 'wifi',
        name: 'WiFi',
        icon: '📶'
      }
    }),
    prisma.amenity.upsert({
      where: { id: 'cafeteria' },
      update: {},
      create: {
        id: 'cafeteria',
        name: 'Cafeteria',
        icon: '☕'
      }
    }),
    prisma.amenity.upsert({
      where: { id: 'changing-rooms' },
      update: {},
      create: {
        id: 'changing-rooms',
        name: 'Changing Rooms',
        icon: '👥'
      }
    }),
    prisma.amenity.upsert({
      where: { id: 'security' },
      update: {},
      create: {
        id: 'security',
        name: 'Security',
        icon: '🛡️'
      }
    })
  ]);

  console.log('✅ Created amenities');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        email: 'customer@example.com',
        password: hashedPassword,
        name: 'John Customer',
        phone: '+1 (555) 123-4567',
        role: 'CUSTOMER'
      }
    }),
    prisma.user.upsert({
      where: { email: 'owner@example.com' },
      update: {},
      create: {
        email: 'owner@example.com',
        password: hashedPassword,
        name: 'Sarah Owner',
        phone: '+1 (555) 234-5678',
        role: 'FACILITY_OWNER'
      }
    }),
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        phone: '+1 (555) 345-6789',
        role: 'ADMIN'
      }
    })
  ]);

  console.log('✅ Created users');

  // Create venues
  const venue1 = await prisma.venue.upsert({
    where: { id: 'venue-1' },
    update: {},
    create: {
      id: 'venue-1',
      name: 'Elite Sports Center',
      description: 'Premium sports facility with state-of-the-art courts and amenities.',
      address: '123 Sports Ave, Downtown',
      latitude: 40.7128,
      longitude: -74.0060,
      city: 'New York',
      state: 'NY',
      ownerId: users[1].id,
      rating: 4.8,
      reviewCount: 124,
      minPrice: 25,
      maxPrice: 80,
      status: 'APPROVED'
    }
  });

  const venue2 = await prisma.venue.upsert({
    where: { id: 'venue-2' },
    update: {},
    create: {
      id: 'venue-2',
      name: 'Metro Sports Complex',
      description: 'Large sports complex with multiple courts and facilities.',
      address: '456 Metro Blvd, Midtown',
      latitude: 40.7589,
      longitude: -73.9851,
      city: 'New York',
      state: 'NY',
      ownerId: users[1].id,
      rating: 4.5,
      reviewCount: 89,
      minPrice: 20,
      maxPrice: 60,
      status: 'APPROVED'
    }
  });

  console.log('✅ Created venues');

  // Link venues with sports
  await Promise.all([
    prisma.venueSport.upsert({
      where: { venueId_sportId: { venueId: venue1.id, sportId: 'tennis' } },
      update: {},
      create: { venueId: venue1.id, sportId: 'tennis' }
    }),
    prisma.venueSport.upsert({
      where: { venueId_sportId: { venueId: venue1.id, sportId: 'basketball' } },
      update: {},
      create: { venueId: venue1.id, sportId: 'basketball' }
    }),
    prisma.venueSport.upsert({
      where: { venueId_sportId: { venueId: venue2.id, sportId: 'basketball' } },
      update: {},
      create: { venueId: venue2.id, sportId: 'basketball' }
    }),
    prisma.venueSport.upsert({
      where: { venueId_sportId: { venueId: venue2.id, sportId: 'badminton' } },
      update: {},
      create: { venueId: venue2.id, sportId: 'badminton' }
    })
  ]);

  // Link venues with amenities
  await Promise.all([
    prisma.venueAmenity.upsert({
      where: { venueId_amenityId: { venueId: venue1.id, amenityId: 'parking' } },
      update: {},
      create: { venueId: venue1.id, amenityId: 'parking' }
    }),
    prisma.venueAmenity.upsert({
      where: { venueId_amenityId: { venueId: venue1.id, amenityId: 'wifi' } },
      update: {},
      create: { venueId: venue1.id, amenityId: 'wifi' }
    }),
    prisma.venueAmenity.upsert({
      where: { venueId_amenityId: { venueId: venue1.id, amenityId: 'cafeteria' } },
      update: {},
      create: { venueId: venue1.id, amenityId: 'cafeteria' }
    })
  ]);

  // Create courts
  await Promise.all([
    prisma.court.upsert({
      where: { id: 'court-1' },
      update: {},
      create: {
        id: 'court-1',
        venueId: venue1.id,
        sportId: 'tennis',
        name: 'Tennis Court A',
        pricePerHour: 50,
        amenities: ['Lighting', 'Clay Surface']
      }
    }),
    prisma.court.upsert({
      where: { id: 'court-2' },
      update: {},
      create: {
        id: 'court-2',
        venueId: venue1.id,
        sportId: 'basketball',
        name: 'Basketball Court 1',
        pricePerHour: 40,
        amenities: ['Indoor', 'Air Conditioning']
      }
    }),
    prisma.court.upsert({
      where: { id: 'court-3' },
      update: {},
      create: {
        id: 'court-3',
        venueId: venue2.id,
        sportId: 'badminton',
        name: 'Badminton Court 1',
        pricePerHour: 30,
        amenities: ['Indoor', 'Wooden Floor']
      }
    })
  ]);

  // Add venue photos
  await Promise.all([
    prisma.venuePhoto.upsert({
      where: { id: 'photo-1' },
      update: {},
      create: {
        id: 'photo-1',
        venueId: venue1.id,
        url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
        caption: 'Main entrance',
        order: 0
      }
    }),
    prisma.venuePhoto.upsert({
      where: { id: 'photo-2' },
      update: {},
      create: {
        id: 'photo-2',
        venueId: venue1.id,
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        caption: 'Tennis courts',
        order: 1
      }
    })
  ]);

  // Add operating hours
  const days = [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday
  await Promise.all(
    days.map(day => 
      prisma.operatingHour.upsert({
        where: { venueId_dayOfWeek: { venueId: venue1.id, dayOfWeek: day } },
        update: {},
        create: {
          venueId: venue1.id,
          dayOfWeek: day,
          openTime: '06:00',
          closeTime: '22:00',
          closed: false
        }
      })
    )
  );

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
