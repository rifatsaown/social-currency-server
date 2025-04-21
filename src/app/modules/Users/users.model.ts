import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import mongoose, { Model, Schema } from 'mongoose';
import config from '../../config';
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
      enum: ['admin', 'brand', 'influencer'],
      default: 'influencer',
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
      enum: ['rejected', 'approved', 'suspended', 'reApply'],
      default: 'reApply',
    },
    password: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // hashing password and save into DB
  this.password = await bcrypt.hash(
      this.password as string,
      Number(config.bcryptSaltRounds),
  );
  next();
});

userSchema.methods.verifyPassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// json web token generation method for access token
userSchema.methods.generateAccessToken = function (): string {
  const secret: Secret = config.accessTokenSecret || '';
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    secret,
    {
      expiresIn: config.accessTokenExpiry,
    },
  );
};

// json web token generation method for refresh token
userSchema.methods.generateRefreshToken = function (): string {
  const secret: Secret = config.refreshTokenSecret || '';
  return jwt.sign({
    _id: this._id,
  }, secret, {
    expiresIn: config.refreshTokenExpiry,
  });
};

const Users: Model<IUser> = mongoose.model('users', userSchema);
export default Users;
