import { Types } from 'mongoose';
import Users from '../Users/users.model';
import Campaign from './campaigns.model';

// Get all campaigns
const getAllCampaigns = async () => {
  const campaigns = await Campaign.find()
    .populate({
      path: 'participants',
      select: 'fullName email status instaHandle',
    })
    .populate({
      path: 'createdBy',
      select: 'fullName email',
    })
    .sort({ createdAt: -1 });

  return campaigns;
};

// Get a single campaign by ID
const getCampaignById = async (id: string) => {
  const campaign = await Campaign.findById(id)
    .populate({
      path: 'participants',
      select: 'fullName email status instaHandle',
    })
    .populate({
      path: 'createdBy',
      select: 'fullName email',
    });

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  return campaign;
};

// Create a new campaign
const createCampaign = async (campaignData: {
  name: string;
  description?: string;
  participants: string[];
  status?: 'active' | 'completed' | 'draft';
  createdBy: string;
}) => {
  // Verify that all participants exist
  const participantIds = campaignData.participants.map(
    (id) => new Types.ObjectId(id),
  );
  const participantCount = await Users.countDocuments({
    _id: { $in: participantIds },
  });

  if (participantCount !== participantIds.length) {
    throw new Error('One or more participants do not exist');
  }

  // Create the campaign
  const newCampaign = await Campaign.create({
    ...campaignData,
    createdBy: new Types.ObjectId(campaignData.createdBy),
    participants: participantIds,
    status: campaignData.status || 'draft',
  });

  // Populate the campaign with participant and creator details before returning
  const populatedCampaign = await Campaign.findById(newCampaign._id)
    .populate({
      path: 'participants',
      select: 'fullName email status instaHandle',
    })
    .populate({
      path: 'createdBy',
      select: 'fullName email',
    });

  return populatedCampaign;
};

// Update a campaign
const updateCampaign = async (
  id: string,
  updateData: {
    name?: string;
    description?: string;
    participants?: string[];
    status?: 'active' | 'completed' | 'draft';
  },
) => {
  // Check if campaign exists
  const existingCampaign = await Campaign.findById(id);
  if (!existingCampaign) {
    throw new Error('Campaign not found');
  }

  // If updating participants, verify they exist
  if (updateData.participants && updateData.participants.length > 0) {
    const participantIds = updateData.participants.map(
      (participantId) => new Types.ObjectId(participantId),
    );
    const participantCount = await Users.countDocuments({
      _id: { $in: participantIds },
    });

    if (participantCount !== participantIds.length) {
      throw new Error('One or more participants do not exist');
    }

    // Update participantIds in updateData
    updateData.participants = participantIds.map((participantId) =>
      participantId.toString(),
    );
  }

  // Update and return
  const updatedCampaign = await Campaign.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate({
      path: 'participants',
      select: 'fullName email status instaHandle',
    })
    .populate({
      path: 'createdBy',
      select: 'fullName email',
    });

  return updatedCampaign;
};

// Delete a campaign
const deleteCampaign = async (id: string) => {
  const result = await Campaign.findByIdAndDelete(id);

  if (!result) {
    throw new Error('Campaign not found');
  }

  return { message: 'Campaign deleted successfully' };
};

export const campaignServices = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
