export interface IUser {
  userName: string;
  role: string;
  email: string;
  password: string;
  refreshToken?: string;

  //Methods
  // eslint-disable-next-line no-unused-vars
  verifyPassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
};
