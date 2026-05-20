export const role = ["contributor ", "maintainer"] as const;
export const type = ["bug ", "feature_request"] as const;
export const status = ["open ", "in_progress", "resolved"] as const;

type Role = (typeof role)[number];
type Type = (typeof type)[number];
type Status = (typeof status)[number];

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
};

export type RUser = Omit<User, "id" | "password" | "created_at" | "updated_at">;

export type Issue = {
  id: number;
  title: string;
  description: string;
  type: Type;
  status: Status;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
};
