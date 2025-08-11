import { Router, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../server';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user bookings (alias endpoint for compatibility)
router.get('/user', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.id },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true
          }
        },
        court: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user bookings
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.id },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true
          }
        },
        court: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create booking
router.post('/', authenticate, [
  body('venueId').isString(),
  body('courtId').isString(),
  body('date').isISO8601(),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('duration').isInt({ min: 1, max: 8 }),
  body('totalPrice').isFloat({ min: 0 })
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Validation failed', details: errors.array() });
      return;
    }

    const { venueId, courtId, date, startTime, endTime, duration, totalPrice, notes } = req.body;

    // Check if court exists and is available
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: { venue: true }
    });

    if (!court || court.status !== 'ACTIVE') {
      res.status(400).json({ error: 'Court not available' });
      return;
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        courtId,
        date,
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    });

    if (conflictingBooking) {
      res.status(400).json({ error: 'Time slot not available' });
      return;
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: req.user!.id,
        venueId,
        courtId,
        date,
        startTime,
        endTime,
        duration,
        totalPrice,
        notes
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true
          }
        },
        court: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel booking
router.patch('/:id/cancel', authenticate, [
  param('id').isString()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.userId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    if (booking.status !== 'CONFIRMED') {
      res.status(400).json({ error: 'Cannot cancel this booking' });
      return;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
