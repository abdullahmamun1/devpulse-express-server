import { sql } from "../../db";
import type { IIssueInput, IIssueQuery } from "./issues.interface";

const createIssueintoDB = async (issue: IIssueInput) => {
  const { title, description, type, reporter_id } = issue;
  const result = await sql`
  INSERT INTO issues (title, description, type, reporter_id)
  VALUES(${title}, ${description}, ${type}, ${reporter_id})
  RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;

  return result[0];
};
const getAllIssuesfromDB = async (query: IIssueQuery) => {
  const { status, type, sort = "newest" } = query;

  const sortOrder = sort === "oldest" ? sql`ASC` : sql`DESC`;
  const result = await sql`
  SELECT * FROM issues
    WHERE ${status ? sql`status = ${status}` : sql`TRUE`}
          AND
          ${type ? sql`type=${type}` : sql`TRUE`}
    ORDER BY created_at ${sortOrder}
  `;

  return result;
};

export const issueServices = {
  createIssueintoDB,
  getAllIssuesfromDB,
};
