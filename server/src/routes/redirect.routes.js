import { Router } from 'express';
import { RedirectController } from '../controllers/redirect.controller.js';

const router = Router();

router.get('/:campaignId', RedirectController.handleRedirect);

export default router;
