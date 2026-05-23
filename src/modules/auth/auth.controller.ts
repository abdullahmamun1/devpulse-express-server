import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import signToken from "../../utils/jwt";
import type { ILoginInput, IUserInput } from "./auth.interface";

const signup = async (
  req: Request<Record<string, never>, unknown, IUserInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.createUser(req.body);
    if (!user) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Failed to create user",
      });
    }
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
const login = async (
  req: Request<Record<string, never>, unknown, ILoginInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.validateUser(req.body);
    if (!user) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid Credentials",
      });
    }

    const { accessToken } = signToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: { token: accessToken, user },
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  signup,
  login,
};
