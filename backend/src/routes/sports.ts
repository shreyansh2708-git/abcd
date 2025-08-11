import { Router, Response } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Get all sports
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const sports = await prisma.sport.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({ sports });
  } catch (error) {
    console.error('Get sports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
