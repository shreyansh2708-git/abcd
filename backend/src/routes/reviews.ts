import { Router, Response } from 'express';
import { prisma } from '../server';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get venue reviews
router.get('/:venueId', async (req: AuthRequest, res: Response) => {
  try {
    const { venueId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { venueId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
