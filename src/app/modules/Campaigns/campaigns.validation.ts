import { z } from 'zod';

const createCampaignValidationSchema = z.object({
  name: z.string({
    required_error: 'Campaign name is required',
  }),
  description: z.string().optional(),
  participants: z.array(z.string(), {
    required_error: 'At least one participant is required',
    invalid_type_error: 'Participants must be an array of IDs',
  }),
  status: z.enum(['active', 'completed', 'draft']).optional(),
});

const updateCampaignValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  participants: z.array(z.string()).optional(),
  status: z.enum(['active', 'completed', 'draft']).optional(),
});

export const campaignValidation = {
  createCampaignValidationSchema,
  updateCampaignValidationSchema,
};
