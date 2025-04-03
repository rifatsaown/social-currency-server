import mongoose, { Document, Model, Schema } from 'mongoose';

// User role types
export type UserRole = 'admin' | 'participant';

// Define interface for Firebase User document
export interface IFirebaseUser extends Document {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create schema
const firebaseUserSchema = new Schema<IFirebaseUser>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'participant'],
      default: 'participant',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Create model
const FirebaseUser: Model<IFirebaseUser> = mongoose.model(
  'firebase_users',
  firebaseUserSchema,
);

export default FirebaseUser;
