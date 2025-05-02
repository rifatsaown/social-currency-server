import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config';
import admin from '../config/firebase';
import CustomError from '../errors/CusromError';
import Users from '../modules/Users/users.model';
import { ApiResponse } from '../utils/ApiResponse';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new CustomError('Unauthorized Request', 401);
    }

    // Check if the token is a Firebase token or a JWT token
    if (token.length > 500) {
      // Likely a Firebase token - verify with Firebase Admin
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Get email from Firebase token
        const email = decodedToken.email;
        if (!email) {
          throw new CustomError('Invalid token - no email found', 401);
        }

        // Find user by email instead of ID
        const user = await Users.findOne({ email }).select(
          '-password -refreshToken',
        );

        if (!user) {
          throw new CustomError('User not found', 401);
        }

        req.user = user.toObject();
        next();
      } catch (firebaseError: any) {
        console.error('Firebase token verification failed:', firebaseError);
        throw new CustomError('Invalid or expired Firebase token', 401);
      }
    } else {
      // Regular JWT token - verify with our secret
      const decodedToken = jwt.verify(
        token,
        config.accessTokenSecret as Secret,
      ) as JwtPayload;

      const user = await Users.findById(decodedToken._id).select(
        '-password -refreshToken',
      );

      if (!user) {
        throw new CustomError('Token is invalid', 401);
      }

      req.user = user.toObject();
      next();
    }
  } catch (error: any) {
    console.error(
      'Auth middleware error:',
      error.message || 'Unknown auth error',
    );
    res
      .status(401)
      .send(new ApiResponse(401, {}, 'Access token is expired or invalid'));
  }
};

export default authMiddleware;
