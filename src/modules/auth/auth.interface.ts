export const role = ["contributor", "maintainer"] as const;
export const type = ["bug", "feature_request"] as const;
export const status = ["open", "in_progress", "resolved"] as const;

export type Role = (typeof role)[number];
export type Type = (typeof type)[number];
export type Status = (typeof status)[number];

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
export interface IIssue {
  title: string;
  description: string;
  type: Type;
  status: Status;
  reporter_id: number;
}
