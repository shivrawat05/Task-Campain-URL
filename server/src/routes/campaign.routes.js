import { Router } from 'express';
import { CampaignController } from '../controllers/campaign.controller.js';
import { validateCreateCampaign, validateUpdateCampaign } from '../middlewares/validator.js';

const router = Router();

router.get('/overview/stats', CampaignController.getOverviewStats);
router.get('/', CampaignController.getAll);
router.get('/:id', CampaignController.getById);
router.post('/', validateCreateCampaign, CampaignController.create);
router.put('/:id', validateUpdateCampaign, CampaignController.update);
router.patch('/:id/status', CampaignController.toggleStatus);
router.delete('/:id', CampaignController.delete);
router.get('/:id/analytics', CampaignController.getAnalytics);

export default router;
