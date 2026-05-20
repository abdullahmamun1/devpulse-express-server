import dotenv from "dotenv";
import { env } from "process";
dotenv.config({ quiet: true });

const config = {
  port: env.PORT,
  connection_string: env.CONNECTION_STRING as string,
  access_secret: env.JWT_SECRET as string,
  refresh_secret: env.REFRESH_SECRET as string,
};

export default config;
