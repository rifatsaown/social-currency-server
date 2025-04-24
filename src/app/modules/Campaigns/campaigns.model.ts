import { Schema, model } from 'mongoose';
import { ICampaign } from './campaigns.interface';

const campaignSchema = new Schema<ICampaign>(
  {
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'draft'],
      default: 'draft',
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users', // Changed from 'User' to 'users' to match the actual model name
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users', // Changed from 'User' to 'users' to match the actual model name
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const Campaign = model('Campaign', campaignSchema);

export default Campaign;
