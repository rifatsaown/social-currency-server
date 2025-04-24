import mongoose, { Model, Schema } from 'mongoose';

export interface IEligibilityCheck {
  fullName: string;
  email: string;
  instagramHandle: string;
  mobileNumber: string;
  city: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

const eligibilityCheckSchema = new Schema<IEligibilityCheck>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    instagramHandle: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const EligibilityCheck: Model<IEligibilityCheck> = mongoose.model(
  'eligibilityChecks',
  eligibilityCheckSchema,
);
export default EligibilityCheck;
