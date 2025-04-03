import { NextFunction, Request, Response } from 'express';
import { auth } from '../config/firebase';
import logger from '../app/utils/logger';

// Middleware to verify Firebase ID token
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid token format' });
    }

    try {
      // Verify the ID token using Firebase Admin
      const decodedToken = await auth.verifyIdToken(token);

      // Attach the user ID to the request for use in route handlers
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };

      next();
    } catch (error) {
      logger.error('Error verifying Firebase ID token:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to check if user is an admin
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Not authenticated' });
    }

    // Get the user document from Firestore
    const userRecord = await auth.getUser(req.user.uid);

    // Check custom claims for admin role
    const customClaims = userRecord.customClaims;

    if (customClaims && customClaims.role === 'admin') {
      req.user.role = 'admin';
      next();
    } else {
      return res
        .status(403)
        .json({ message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
