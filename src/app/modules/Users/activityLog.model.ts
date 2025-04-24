import mongoose, { Model, Schema } from 'mongoose';
import { IActivityLog } from './users.interface';

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
  },
  { timestamps: true },
);

const ActivityLog: Model<IActivityLog> = mongoose.model(
  'activityLog',
  activityLogSchema,
);
export default ActivityLog;
