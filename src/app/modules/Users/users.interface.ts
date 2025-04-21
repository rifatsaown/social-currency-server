export interface IUser {
  fullName: string;
  role: 'admin' | 'brand' | 'influencer';
  email: string;
  instaHandle: string;
  phoneNumber: string;
  city: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  eligibleStatus: 'rejected' | 'approved' | 'suspended' | 'reApply';
  password?: string;

  //Methods
  // eslint-disable-next-line no-unused-vars
  verifyPassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
};
