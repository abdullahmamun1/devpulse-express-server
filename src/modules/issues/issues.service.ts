import { sql } from "../../db";
import type { IIssueInput } from "./issues.interface";

const createIssue = async (issue: IIssueInput) => {
  const { title, description, type, reporter_id } = issue;
  const result = await sql`
  INSERT INTO issues (title, description, type, reporter_id)
  VALUES(${title}, ${description}, ${type}, ${reporter_id})
  RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;

  return result[0];
};

export const issueServices = {
  createIssue,
};
