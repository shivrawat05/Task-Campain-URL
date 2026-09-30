import { Router } from 'express';
import campaignRoutes from './campaign.routes.js';
import redirectRoutes from './redirect.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Campaign URL Manager API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.use('/api/v1/campaigns', campaignRoutes);
router.use('/r', redirectRoutes);

export default router;
