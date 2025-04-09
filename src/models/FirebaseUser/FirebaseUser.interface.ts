import { Document } from "mongoose";

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
