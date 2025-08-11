import { Router, Response } from 'express';
import { query, param, validationResult } from 'express-validator';
import { prisma } from '../server';
import { authenticate, AuthRequest, authorize } from '../middleware/auth';

const router = Router();

// Get all venues with filters
router.get('/', [
  query('sport').optional().isString(),
  query('city').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Validation failed', details: errors.array() });
      return;
    }

    const { sport, city, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      status: 'APPROVED'
    };

    if (sport && sport !== 'all') {
      where.sports = {
        some: {
          sport: {
            id: sport as string
          }
        }
      };
    }

    if (city) {
      where.city = {
        contains: city as string,
        mode: 'insensitive'
      };
    }

    if (minPrice || maxPrice) {
      where.AND = [];
      if (minPrice) {
        where.AND.push({ minPrice: { gte: Number(minPrice) } });
      }
      if (maxPrice) {
        where.AND.push({ maxPrice: { lte: Number(maxPrice) } });
      }
    }

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        include: {
          sports: {
            include: {
              sport: true
            }
          },
          photos: {
            orderBy: { order: 'asc' },
            take: 3
          },
          operatingHours: true,
          _count: {
            select: {
              reviews: true,
              courts: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { rating: 'desc' }
      }),
      prisma.venue.count({ where })
    ]);

    res.json({
      venues: venues.map((venue: any) => ({
        ...venue,
        sports: venue.sports.map((vs: any) => vs.sport),
        reviewCount: venue._count.reviews,
        courtCount: venue._count.courts
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get venue by ID
router.get('/:id', [
  param('id').isString()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        sports: {
          include: {
            sport: true
          }
        },
        amenities: {
          include: {
            amenity: true
          }
        },
        photos: {
          orderBy: { order: 'asc' }
        },
        courts: {
          where: { status: 'ACTIVE' },
          include: {
            sport: true
          }
        },
        operatingHours: {
          orderBy: { dayOfWeek: 'asc' }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      }
    });

    if (!venue) {
      res.status(404).json({ error: 'Venue not found' });
      return;
    }

    res.json({
      ...venue,
      sports: venue.sports.map((vs: any) => vs.sport),
      amenities: venue.amenities.map((va: any) => va.amenity),
      reviewCount: venue._count.reviews,
      bookingCount: venue._count.bookings
    });
  } catch (error) {
    console.error('Get venue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get venue courts
router.get('/:id/courts', [
  param('id').isString()
], async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const courts = await prisma.court.findMany({
      where: {
        venueId: id,
        status: 'ACTIVE'
      },
      include: {
        sport: true,
        venue: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({ courts });
  } catch (error) {
    console.error('Get venue courts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
