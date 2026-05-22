import jwt from "jsonwebtoken";
import type { IJwtPayload } from "../modules/auth/auth.interface";
import config from "../config";

const signToken = (payload: IJwtPayload) => {
  const accessToken = jwt.sign(payload, config.access_secret, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export default signToken;
