import { Router, Response } from 'express';
import { prisma } from '../server';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get dashboard stats
router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'CUSTOMER') {
      // Customer dashboard stats
      const [bookingCount, completedBookings, upcomingBookings] = await Promise.all([
        prisma.booking.count({
          where: { userId }
        }),
        prisma.booking.count({
          where: { userId, status: 'COMPLETED' }
        }),
        prisma.booking.count({
          where: { 
            userId, 
            status: 'CONFIRMED',
            date: { gte: new Date().toISOString().split('T')[0] }
          }
        })
      ]);

      const recentBookings = await prisma.booking.findMany({
        where: { userId },
        include: {
          venue: { select: { name: true } },
          court: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      res.json({
        totalBookings: bookingCount,
        completedBookings,
        upcomingBookings,
        recentBookings
      });

    } else if (userRole === 'FACILITY_OWNER') {
      // Facility owner dashboard stats
      const venues = await prisma.venue.findMany({
        where: { ownerId: userId },
        select: { id: true }
      });
      
      const venueIds = venues.map(v => v.id);

      const [totalRevenue, totalBookings, activeVenues] = await Promise.all([
        prisma.booking.aggregate({
          where: { venueId: { in: venueIds }, status: 'COMPLETED' },
          _sum: { totalPrice: true }
        }),
        prisma.booking.count({
          where: { venueId: { in: venueIds } }
        }),
        prisma.venue.count({
          where: { ownerId: userId, status: 'APPROVED' }
        })
      ]);

      res.json({
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalBookings,
        activeVenues,
        venueCount: venues.length
      });

    } else {
      // Admin dashboard stats
      const [totalUsers, totalVenues, totalBookings, totalRevenue] = await Promise.all([
        prisma.user.count(),
        prisma.venue.count(),
        prisma.booking.count(),
        prisma.booking.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { totalPrice: true }
        })
      ]);

      res.json({
        totalUsers,
        totalVenues,
        totalBookings,
        totalRevenue: totalRevenue._sum.totalPrice || 0
      });
    }

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
