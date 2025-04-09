import mongoose, {  Model, Schema } from 'mongoose';
import { IFirebaseUser } from './FirebaseUser.interface';



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
