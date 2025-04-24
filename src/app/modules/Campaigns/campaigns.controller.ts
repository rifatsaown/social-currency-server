import { ApiResponse } from '../../utils/ApiResponse';
import catchAsync from '../../utils/catchAsync';
import { campaignServices } from './campaigns.service';

// Get all campaigns
const getAllCampaigns = catchAsync(async (req, res) => {
  const campaigns = await campaignServices.getAllCampaigns();
  res.status(200).json(new ApiResponse(200, campaigns));
});

// Get a single campaign by ID
const getCampaignById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campaign = await campaignServices.getCampaignById(id);
  res.status(200).json(new ApiResponse(200, campaign));
});

// Create a new campaign
const createCampaign = catchAsync(async (req, res) => {
  // Add the current user as the creator
  const campaignData = {
    ...req.body,
    createdBy: req.user?._id,
  };

  const newCampaign = await campaignServices.createCampaign(campaignData);
  res.status(201).json(new ApiResponse(201, newCampaign));
});

// Update a campaign
const updateCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedCampaign = await campaignServices.updateCampaign(id, updateData);
  res.status(200).json(new ApiResponse(200, updatedCampaign));
});

// Delete a campaign
const deleteCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await campaignServices.deleteCampaign(id);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

export const campaignController = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
