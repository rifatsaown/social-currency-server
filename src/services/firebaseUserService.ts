import logger from '../app/utils/logger';
import FirebaseUser, { IFirebaseUser, UserRole } from '../models/FirebaseUser';

// Create a new user
export const createUser = async (userData: {
  uid: string;
  email: string;
  displayName: string;
  role?: UserRole;
  isActive?: boolean;
}): Promise<IFirebaseUser> => {
  try {
    const newUser = new FirebaseUser(userData);
    return await newUser.save();
  } catch (error) {
    logger.error('Error creating user in MongoDB:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async (): Promise<IFirebaseUser[]> => {
  try {
    return await FirebaseUser.find();
  } catch (error) {
    logger.error('Error fetching all users from MongoDB:', error);
    throw error;
  }
};

// Get all participants
export const getAllParticipants = async (): Promise<IFirebaseUser[]> => {
  try {
    return await FirebaseUser.find({ role: 'participant' });
  } catch (error) {
    logger.error('Error fetching participants from MongoDB:', error);
    throw error;
  }
};

// Get user by UID
export const getUserByUid = async (
  uid: string,
): Promise<IFirebaseUser | null> => {
  try {
    return await FirebaseUser.findOne({ uid });
  } catch (error) {
    logger.error(`Error fetching user with UID ${uid} from MongoDB:`, error);
    throw error;
  }
};

// Update user
export const updateUser = async (
  uid: string,
  updateData: Partial<IFirebaseUser>,
): Promise<IFirebaseUser | null> => {
  try {
    return await FirebaseUser.findOneAndUpdate({ uid }, updateData, {
      new: true,
    });
  } catch (error) {
    logger.error(`Error updating user with UID ${uid} in MongoDB:`, error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (uid: string): Promise<boolean> => {
  try {
    const result = await FirebaseUser.deleteOne({ uid });
    return result.deletedCount > 0;
  } catch (error) {
    logger.error(`Error deleting user with UID ${uid} from MongoDB:`, error);
    throw error;
  }
};
