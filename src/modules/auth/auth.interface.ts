export const role = ["contributor", "maintainer"] as const;

export type Role = (typeof role)[number];

export interface IUserDB {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

export type IUser = Omit<IUserDB, "password">;

export type IUserInput = Pick<IUserDB, "name" | "email" | "password"> & {
  role?: Role;
};

export type ILoginInput = Pick<IUserDB, "email" | "password">;

export type IJwtPayload = Pick<IUserDB, "id" | "name" | "role">;
