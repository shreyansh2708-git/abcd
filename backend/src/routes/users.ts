import { Router, Response } from 'express';
import { prisma } from '../server';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user statistics
router.get('/stats', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Get user's bookings
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        venue: {
          select: { name: true }
        },
        court: {
          select: { name: true }
        }
      }
    });

    const totalBookings = bookings.length;
    const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED').length;
    const upcomingBookings = bookings.filter((b: any) => 
      b.status === 'CONFIRMED' && new Date(b.date) >= new Date()
    ).length;
    
    const totalSpent = bookings
      .filter((b: any) => b.status === 'COMPLETED')
      .reduce((sum: number, booking: any) => sum + booking.totalPrice, 0);

    // Get favorite venues (most booked)
    const venueBookings = bookings.reduce((acc: any, booking: any) => {
      const venueName = booking.venue.name;
      acc[venueName] = (acc[venueName] || 0) + 1;
      return acc;
    }, {});

    const favoriteVenues = Object.entries(venueBookings)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([name, count]) => ({ name, bookings: count }));

    // Get recent activity (last 10 bookings)
    const recentActivity = bookings
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((booking: any) => ({
        id: booking.id,
        venue: booking.venue.name,
        court: booking.court.name,
        date: booking.date,
        status: booking.status,
        createdAt: booking.createdAt
      }));

    res.json({
      totalBookings,
      completedBookings,
      upcomingBookings,
      totalSpent,
      favoriteVenues,
      recentActivity
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users (admin only)
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
