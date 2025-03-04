import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config';
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

    req.user = user.toObject(); // Now TypeScript knows about the 'user' property
    next();
  } catch (error: any) {
    res
      .status(401)
      .send(new ApiResponse(401, error, 'Access token is expired or invalid'));
  }
};

export default authMiddleware;
