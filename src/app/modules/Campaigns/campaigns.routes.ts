import express, { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { campaignController } from './campaigns.controller';
import { campaignValidation } from './campaigns.validation';

const router: Router = express.Router();

// Get all campaigns
router.get('/', campaignController.getAllCampaigns);

// Get a single campaign by ID
router.get('/:id', campaignController.getCampaignById);

// Create a new campaign
router.post(
  '/',
  validateRequest(campaignValidation.createCampaignValidationSchema),
  campaignController.createCampaign,
);

// Update a campaign
router.put(
  '/:id',
  validateRequest(campaignValidation.updateCampaignValidationSchema),
  campaignController.updateCampaign,
);

// Delete a campaign
router.delete('/:id', campaignController.deleteCampaign);

export const campaignRoutes = router;
