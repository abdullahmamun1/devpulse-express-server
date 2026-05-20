import { sql } from "../../db";
import bcrypt from "bcrypt";
import type { IUserDB, IUserInput } from "./auth.interface";

const createUser = async (user: IUserInput) => {
  const { name, email, role, password } = user;
  const hash = await bcrypt.hash(password, 10);
  const result = await sql`
  INSERT INTO users (name, email, role, password)
  VALUES(${name}, ${email}, COALESCE(${role}, 'contributor'), ${hash})
  RETURNING id, name, email, role, created_at, updated_at
  `;

  return result[0];
};
const validateUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const result = await sql`
  SELECT * from users 
  WHERE email = ${email}
  `;
  if (!result.length) {
    return null;
  }
  const dbUser = result[0] as IUserDB;
  const isValid = await bcrypt.compare(password, dbUser.password);

  if (!isValid) return null;
  const { password: _, ...user } = dbUser;
  return user;
};

export const authService = {
  createUser,
  validateUser,
};
