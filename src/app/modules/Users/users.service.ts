import mongoose from 'mongoose';
import CustomError from '../../errors/CusromError';
import ActivityLog from './activityLog.model';
import EligibilityCheck from './eligibilityCheck.model';
import { IUser } from './users.interface';
import Users from './users.model';

// generate access and refresh token
const generateAccessToken = async (userID: string) => {
  try {
    const user = await Users.findById(userID);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    const accessToken = user.generateAccessToken();

    await user?.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomError(error.message, 500);
    } else {
      throw new CustomError('Something went wrong while Generating Token', 500);
    }
  }
};

const logUserActivity = async (
  userId: string,
  action: string,
  details: string = '',
) => {
  try {
    const activity = await ActivityLog.create({
      userId,
      action,
      details,
      timestamp: new Date(),
    });

    return activity;
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomError(error.message, 500);
    } else {
      throw new CustomError('Failed to log activity', 500);
    }
  }
};

const getUsers = async () => {
  const result: IUser[] = await Users.find({ role: 'user' })
    .select('-password')
    .sort({
      createdAt: -1,
    });
  return result;
};

const createUser = async (userData: IUser) => {
  const user = await Users.create(userData);
  //generate access and refresh token
  const { accessToken } = await generateAccessToken(user._id.toString());

  //remove the password from the response
  const result = {
    ...user.toJSON(),
    accessToken,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (result as any)?.password;
  return result;
};

const userEligibilityRequest = async (userData: {
  fullName: string;
  instagramHandle: string;
  mobileNumber: string;
  email: string;
  city: string;
}) => {
  // Check if the user already exists in eligibilityChecks
  const existingCheck = await EligibilityCheck.findOne({
    email: userData.email,
  });
  if (existingCheck) {
    return {
      message:
        'You have already submitted an eligibility request. Please wait for approval.',
      data: existingCheck,
    };
  }

  // Check if the user already exists in the users collection
  const existingUser = await Users.findOne({ email: userData.email });
  if (existingUser) {
    return {
      message: 'User already exists',
      data: existingUser,
    };
  }

  // Create a new eligibility check entry
  const eligibilityCheck = await EligibilityCheck.create({
    fullName: userData.fullName,
    email: userData.email,
    instagramHandle: userData.instagramHandle,
    mobileNumber: userData.mobileNumber,
    city: userData.city,
    status: 'pending',
  });

  return {
    message: 'Eligibility check request submitted successfully',
    data: eligibilityCheck,
  };
};

const getAllEligibilityChecks = async () => {
  const eligibilityChecks = await EligibilityCheck.find().sort({
    createdAt: -1,
  });
  return eligibilityChecks;
};

const processEligibilityCheck = async (
  id: string,
  status: 'approved' | 'rejected',
) => {
  const eligibilityCheck = await EligibilityCheck.findById(id);
  if (!eligibilityCheck) {
    throw new CustomError('Eligibility check not found', 404);
  }

  // Update the eligibility check status
  eligibilityCheck.status = status;
  await eligibilityCheck.save();

  // If approved, create a user in the users collection
  if (status === 'approved') {
    const newUser = await Users.create({
      fullName: eligibilityCheck.fullName,
      email: eligibilityCheck.email,
      instaHandle: eligibilityCheck.instagramHandle,
      phoneNumber: eligibilityCheck.mobileNumber,
      city: eligibilityCheck.city,
      role: 'user',
      status: 'active',
      eligibleStatus: 'approved',
      // Generate a random temporary password
      password: Math.random().toString(36).slice(-8),
    });

    // Log the activity
    await logUserActivity(
      newUser._id.toString(),
      'User approved and created from eligibility check',
      `User ${newUser.fullName} was approved and created from eligibility check process`,
    );

    return {
      message: 'User has been approved and account has been created',
      data: newUser,
    };
  }

  return {
    message: 'User has been rejected',
    data: eligibilityCheck,
  };
};

const getUserByEmail = async (email: string) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  return user;
};

const getDashboardStats = async () => {
  // Get user statistics
  const users = await Users.find({});

  const totalParticipants = users.length;
  const activeParticipants = users.filter(
    (user) => user.status === 'active',
  ).length;
  const inactiveParticipants = users.filter(
    (user) => user.status !== 'active',
  ).length;

  // Get user counts by role
  const userCount = users.filter((user) => user.role === 'user').length;
  const admins = users.filter((user) => user.role === 'admin').length;

  // Get status distribution data for charts
  const statusDistribution = {
    active: users.filter((user) => user.status === 'active').length,
    inactive: users.filter((user) => user.status === 'inactive').length,
    pending: users.filter((user) => user.status === 'pending').length,
    blocked: users.filter((user) => user.status === 'blocked').length,
  };

  // Get monthly registration data for the past 6 months
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const monthlyRegistrations = await Users.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo, $lte: today },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);

  // Get recent activities
  const recentActivities = await ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('userId', 'fullName email');

  return {
    userStats: {
      totalParticipants,
      activeParticipants,
      inactiveParticipants,
      userCount,
      admins,
    },
    charts: {
      statusDistribution,
      monthlyRegistrations,
    },
    recentActivities,
  };
};

const updateUserStatus = async (
  userId: string,
  status: 'active' | 'inactive',
) => {
  const user = await Users.findById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  user.status = status;
  await user.save();

  // Log the activity
  await logUserActivity(
    userId,
    `User status updated to ${status}`,
    `User status was changed to ${status}`,
  );

  return user;
};

const deleteUser = async (userId: string) => {
  const user = await Users.findById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  // Log the activity before deletion
  await logUserActivity(
    userId,
    'User deleted',
    `User ${user.fullName} (${user.email}) was deleted from the system`,
  );

  await Users.findByIdAndDelete(userId);
  return { message: 'User deleted successfully' };
};

const getUserCampaigns = async (userId: string) => {
  // Find all campaigns where the user is a participant
  const Campaign = mongoose.model('Campaign');
  const campaigns = await Campaign.find({
    participants: { $in: [userId] },
  })
    .select('name description status createdAt')
    .sort({ createdAt: -1 });

  return campaigns;
};

// Add function to update user's coin balance
const updateCoinBalance = async (userId: string, amount: number) => {
  const user = await Users.findById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  // Add the amount to the existing balance (or 0 if not set)
  const currentBalance = user.coinBalance || 0;
  user.coinBalance = currentBalance + amount;
  await user.save();

  // Log the activity
  await logUserActivity(
    userId,
    `Coin balance updated`,
    `${amount >= 0 ? 'Added' : 'Deducted'} ${Math.abs(amount)} coins, new balance: ${user.coinBalance}`,
  );

  return user;
};

// Add function to get user dashboard data
const getUserDashboardData = async (userId: string) => {
  const user = await Users.findById(userId).select('-password');
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const campaigns = await getUserCampaigns(userId);

  // Get recent activity for this user
  const recentActivities = await ActivityLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    user,
    campaigns,
    recentActivities,
  };
};

export const userServices = {
  getUsers,
  createUser,
  generateAccessToken,
  userEligibilityRequest,
  getUserByEmail,
  getDashboardStats,
  logUserActivity,
  getAllEligibilityChecks,
  processEligibilityCheck,
  updateUserStatus,
  deleteUser,
  getUserCampaigns,
  updateCoinBalance,
  getUserDashboardData,
};
