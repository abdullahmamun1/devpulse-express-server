export const type = ["bug", "feature_request"] as const;
export const status = ["open", "in_progress", "resolved"] as const;

export type Type = (typeof type)[number];
export type Status = (typeof status)[number];

export interface IIssueInput {
  title: string;
  description: string;
  type: Type;
  reporter_id: string;
}

export interface IIssueQuery {
  status?: Status;
  type?: Type;
  sort?: "newest" | "oldest";
}

// export interface IIssue {
//   title: string;
//   description: string;
//   type: Type;
//   status: Status;
//   reporter_id: number;
// }
