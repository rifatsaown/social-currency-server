import CustomError from '../../errors/CusromError';
import ActivityLog from './activityLog.model';
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

const getUsers = async () => {
  const result: IUser[] = await Users.find({});
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

const userEligibilityRequest = async (userData: IUser) => {
  const email = userData.email;
  const user = await Users.findOne({ email });
  if (!user) {
    const newUser = await Users.create(userData);

    const result = {
      ...newUser.toJSON(),
    };
    return {
      message: 'User created successfully',
      data: result,
    };
  }

  return { message: 'User already exists', data: user };
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

export const userServices = {
  getUsers,
  createUser,
  generateAccessToken,
  userEligibilityRequest,
  getUserByEmail,
  getDashboardStats,
  logUserActivity,
};
