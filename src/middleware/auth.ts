import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { sql } from "../db";
import type { IJwtPayload, Role } from "../modules/auth/auth.interface";

const auth = (...roles: Role[]) => {
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
      const decoded = jwt.verify(token, config.access_secret) as JwtPayload;
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
      req.user = user as IJwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
