import { ApiResponse } from '../../utils/ApiResponse';
import catchAsync from '../../utils/catchAsync';
import { userServices } from './users.service';

export const getAllusers = catchAsync(async (req, res) => {
  const result = await userServices.getUsers();
  res.status(200).json(new ApiResponse(200, result));
});

export const createUser = catchAsync(async (req, res) => {
  const data = req.body;

  const createdUser = await userServices.createUser(data);

  res.status(200).json(new ApiResponse(200 , createdUser));
});
