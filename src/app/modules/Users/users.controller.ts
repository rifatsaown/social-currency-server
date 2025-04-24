import { ApiResponse } from '../../utils/ApiResponse';
import catchAsync from '../../utils/catchAsync';
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

export const userController = {
  getAllusers,
  createUser,
  userEligibilityRequest,
  getUserByEmail,
  getDashboardStats,
  logUserActivity,
  getAllEligibilityChecks,
  processEligibilityCheck,
};
