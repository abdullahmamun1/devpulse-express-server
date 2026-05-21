import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types";
import sendResponse from "../utils/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { sql } from "../db";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access!!",
        });
      }
      const decoded = jwt.verify(
        token as string,
        config.access_secret as string,
      ) as JwtPayload;
      const userData = await sql`
      SELECT * from users
      WHERE id = ${decoded.id}
      `;
      const user = userData[0];
      if (!user) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "User not found!!",
        });
      }

      if (roles.length && !roles.includes(user.role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden!!",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
