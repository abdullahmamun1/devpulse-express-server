import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import signToken from "../../utils/jwt";
import type { ILoginInput, IUserInput } from "./auth.interface";

const signup = async (
  req: Request<Record<string, never>, unknown, IUserInput>,
  res: Response,
) => {
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
};
const login = async (
  req: Request<Record<string, never>, unknown, ILoginInput>,
  res: Response,
) => {
  const user = await authService.validateUser(req.body);
  if (!user) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid Credentials",
    });
  }

  const { accessToken, refreshToken } = signToken({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: { token: accessToken, user },
  });
};

export const authController = {
  signup,
  login,
};
