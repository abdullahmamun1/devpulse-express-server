import { sql } from "../../db";
import type { Role } from "../auth/auth.interface";
import type {
  IIssue,
  IIssueInput,
  IIssueQuery,
  IIssueUpdate,
} from "./issues.interface";

const createIssueintoDB = async (issue: IIssueInput) => {
  const { title, description, type, reporter_id } = issue;
  const result = await sql`
  INSERT INTO issues (title, description, type, reporter_id)
  VALUES(${title}, ${description}, ${type}, ${reporter_id})
  RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;

  return result[0] as IIssue | undefined;
};
const getAllIssuesfromDB = async (query: IIssueQuery) => {
  const { status, type, sort = "newest" } = query;

  const sortOrder = sort === "oldest" ? sql`ASC` : sql`DESC`;
  const issues = (await sql`
  SELECT * FROM issues
    WHERE ${status ? sql`status = ${status}` : sql`TRUE`}
          AND
          ${type ? sql`type=${type}` : sql`TRUE`}
    ORDER BY created_at ${sortOrder}
  `) as IIssue[];

  if (issues.length === 0) {
    return [];
  }
  const reporterIds = issues.map((i) => i.reporter_id);
  const reporters = await sql`
  SELECT id, name, role 
  FROM users 
  WHERE id = ANY(${reporterIds})
  `;

  return issues.map((issue) => {
    const { created_at, updated_at, reporter_id, ...rest } = issue;
    return {
      ...rest,
      reporter: reporters.find((r) => r.id === issue.reporter_id),
      created_at,
      updated_at,
    };
  });
};
const getSingleIssuefromDB = async (id: string) => {
  const result = await sql`
  SELECT * FROM issues
    WHERE id = ${id}
  `;
  const issue = result[0] as IIssue | undefined;
  if (!issue) {
    return null;
  }
  const reporter = await sql`
  SELECT id, name, role 
  FROM users 
  WHERE id = ${issue.reporter_id}
  `;
  const { created_at, updated_at, reporter_id, ...rest } = issue;
  return { ...rest, reporter: reporter[0], created_at, updated_at };
};
const updateIssueinDB = async (
  id: string,
  payload: Partial<IIssueUpdate>,
  requesterId: number,
  requesterRole: Role,
) => {
  const result = await sql`
  SELECT * FROM issues
    WHERE id = ${id}
  `;
  const issue = result[0] as IIssue | undefined;
  console.log(issue);
  if (!issue) {
    return null;
  }
  if (requesterRole === "contributor") {
    if (issue.reporter_id !== requesterId) {
      throw new Error("Forbidden!!");
    }
    if (issue.status !== "open") {
      throw new Error("Forbidden");
    }
  }

  const { title, description, type, status } = payload;
  const updated = await sql`
  UPDATE issues
  SET
    title = COALESCE(${title}, title),
    description = COALESCE(${description}, description),
    type = COALESCE(${type}, type),
    status = COALESCE(${status}, 'in_progress'),
    updated_at = NOW()
  WHERE id = ${id}
  RETURNING *
  `;
  return updated[0] as IIssue | undefined;
};
const deleteIssueFromDB = async (id: string) => {
  const result = await sql`
  DELETE FROM issues
    WHERE id = ${id}
    RETURNING *
  `;

  return result[0] as IIssue | undefined;
};

export const issueServices = {
  createIssueintoDB,
  getAllIssuesfromDB,
  getSingleIssuefromDB,
  updateIssueinDB,
  deleteIssueFromDB,
};
