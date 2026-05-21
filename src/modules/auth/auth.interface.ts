export const role = ["contributor", "maintainer"] as const;

export type Role = (typeof role)[number];

export interface IUserInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

export interface IUserDB {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

export interface IJwtPayload {
  id: number;
  name: string;
  role: Role;
}
