import { ApiResponse } from '../../utils/ApiResponse';
import catchAsync from '../../utils/catchAsync';
import Users from './users.model';
import { userServices } from './users.service';

const getAllusers = catchAsync(async (req, res) => {
  const result = await userServices.getUsers();
  res.status(200).json(new ApiResponse(200, result));
});

const createUser = catchAsync(async (req, res) => {
  const data = req.body;

  const createdUser = await userServices.createUser(data);

  res.status(200).json(new ApiResponse(200, createdUser));
});

const userEligibilityRequest = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await userServices.userEligibilityRequest(data);

  res
    .status(200)
    .send(
      new ApiResponse(
        200,
        result.data ? result.data : null,
        result.message ? result.message : 'User not found',
      ),
    );
});

const getUserByEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await userServices.getUserByEmail(email);
  res.status(200).json(new ApiResponse(200, result));
});

const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await userServices.getDashboardStats();
  res.status(200).json(new ApiResponse(200, stats));
});

const logUserActivity = catchAsync(async (req, res) => {
  const { userId, action, details } = req.body;
  const activity = await userServices.logUserActivity(userId, action, details);
  res.status(201).json(new ApiResponse(201, activity));
});

const getAllEligibilityChecks = catchAsync(async (req, res) => {
  const eligibilityChecks = await userServices.getAllEligibilityChecks();
  res.status(200).json(new ApiResponse(200, eligibilityChecks));
});

const processEligibilityCheck = catchAsync(async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status || !['approved', 'rejected'].includes(status)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, 'Invalid request parameters'));
  }

  const result = await userServices.processEligibilityCheck(id, status);
  res.status(200).json(new ApiResponse(200, result.data, result.message));
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { userId, status } = req.body;

  if (!userId || !status || !['active', 'inactive'].includes(status)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, 'Invalid request parameters'));
  }

  const result = await userServices.updateUserStatus(userId, status);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'User status updated successfully'));
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, 'User ID is required'));
  }

  const result = await userServices.deleteUser(id);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

const getAllParticipants = catchAsync(async (req, res) => {
  // Get all users with role 'user' (participants)
  const participants = await Users.find({ role: 'user' })
    .select('-password -refreshToken')
    .sort({
      createdAt: -1,
    });
  res.status(200).json(new ApiResponse(200, participants));
});

// New endpoints for user dashboard
const getUserCampaigns = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, 'User ID is required'));
  }

  const campaigns = await userServices.getUserCampaigns(id);
  res.status(200).json(new ApiResponse(200, campaigns));
});

const updateCoinBalance = catchAsync(async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || amount === undefined || isNaN(amount)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, 'Invalid request parameters'));
  }

  const user = await userServices.updateCoinBalance(userId, Number(amount));
  res
    .status(200)
    .json(new ApiResponse(200, user, 'Coin balance updated successfully'));
});

const getUserDashboardData = catchAsync(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, 'User not authenticated'));
  }

  const dashboardData = await userServices.getUserDashboardData(userId);
  res.status(200).json(new ApiResponse(200, dashboardData));
});

export const userController = {
  getAllusers,
  createUser,
  userEligibilityRequest,
  getUserByEmail,
  getDashboardStats,
  logUserActivity,
  getAllEligibilityChecks,
  processEligibilityCheck,
  updateUserStatus,
  deleteUser,
  getAllParticipants,
  getUserCampaigns,
  updateCoinBalance,
  getUserDashboardData,
};
