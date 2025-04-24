import { Types } from 'mongoose';

export interface IUser {
  fullName: string;
  role: 'admin' | 'brand' | 'influencer';
  email: string;
  instaHandle: string;
  phoneNumber: string;
  city: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  eligibleStatus: 'rejected' | 'approved' | 'suspended' | 'reApply' | 'pending';
  password?: string;

  // Methods
  // eslint-disable-next-line no-unused-vars
  verifyPassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IActivityLog {
  userId: Types.ObjectId;
  action: string;
  details?: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DashboardStats {
  userStats: {
    totalParticipants: number;
    activeParticipants: number;
    inactiveParticipants: number;
    influencers: number;
    brands: number;
    admins: number;
  };
  charts: {
    statusDistribution: {
      active: number;
      inactive: number;
      pending: number;
      blocked: number;
    };
    monthlyRegistrations: {
      _id: {
        month: number;
        year: number;
      };
      count: number;
    }[];
  };
  recentActivities: IActivityLog[];
}
