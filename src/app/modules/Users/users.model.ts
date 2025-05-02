import mongoose, { Model, Schema } from 'mongoose';
import { IUser } from './users.interface';

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
      default: 'user',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    instaHandle: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'pending', 'blocked'],
      default: 'pending',
    },
    eligibleStatus: {
      type: String,
      required: true,
      enum: ['rejected', 'approved', 'suspended', 'reApply', 'pending'],
      default: 'pending',
    },
    password: {
      type: String,
    },
    coinBalance: {
      type: Number,
      default: 0,
    },
    firebaseUid: {
      type: String,
    },
  },
  { timestamps: true },
);

const Users: Model<IUser> = mongoose.model('users', userSchema);
export default Users;
