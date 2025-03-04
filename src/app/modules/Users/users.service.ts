import CustomError from '../../errors/CusromError';
import { IUser } from './users.interface';
import Users from './users.model';

// generate access and refresh token
const generateAccessAndRefreshToken = async (userID: string) => {
  try {
    const user = await Users.findById(userID);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; // Save the refresh token to the DB
    await user?.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
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
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id.toString(),
  );

  //remove the password from the response
  const result = {
    ...user.toJSON(),
    accessToken,
    refreshToken,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (result as any)?.password;
  return result;
};

export const userServices = {
  getUsers,
  createUser,
  generateAccessAndRefreshToken,
};
