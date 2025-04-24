import { Document, Types } from 'mongoose';

export interface ICampaign {
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'draft';
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
}

export interface CampaignModel extends ICampaign, Document {}