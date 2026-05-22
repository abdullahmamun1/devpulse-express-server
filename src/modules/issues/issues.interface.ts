export const type = ["bug", "feature_request"] as const;
export const status = ["open", "in_progress", "resolved"] as const;

export type Type = (typeof type)[number];
export type Status = (typeof status)[number];

export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: Type;
  status: Status;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}
export type IIssueInput = Pick<IIssue, "title" | "description" | "type"> & {
  reporter_id: number;
};

export interface IIssueQuery {
  status?: Status;
  type?: Type;
  sort?: "newest" | "oldest";
}
