import { Request, Response } from 'express';
import logger from '../app/utils/logger';
import * as firebaseUserService from '../services/firebaseUserService';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    // Validate required fields
    if (!userData.uid || !userData.email || !userData.displayName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (uid, email, displayName)',
      });
    }

    const newUser = await firebaseUserService.createUser(userData);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    logger.error('Error in createUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await firebaseUserService.getAllUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    logger.error('Error in getAllUsers controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all participants
export const getAllParticipants = async (req: Request, res: Response) => {
  try {
    const participants = await firebaseUserService.getAllParticipants();

    return res.status(200).json({
      success: true,
      data: participants,
    });
  } catch (error) {
    logger.error('Error in getAllParticipants controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get user by UID
export const getUserByUid = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const user = await firebaseUserService.getUserByUid(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Error in getUserByUid controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const updatedUser = await firebaseUserService.updateUser(uid, updateData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    logger.error('Error in updateUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const isDeleted = await firebaseUserService.deleteUser(uid);

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error('Error in deleteUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
