import type { Request, Response } from "express";
import { issueServices } from "./issues.service";
import sendResponse from "../../utils/sendResponse";
import type { Status, Type } from "./issues.interface";
const createIssue = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized!!",
    });
  }
  const issue = await issueServices.createIssueintoDB({
    ...req.body,
    reporter_id: req.user.id,
  });
  if (!issue) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Failed to create issue",
    });
  }
  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Issue created successfully",
    data: issue,
  });
};
const getAllIssues = async (req: Request, res: Response) => {
  const { status, type, sort = "newest" } = req.query;
  const issues = await issueServices.getAllIssuesfromDB({
    status: status as Status,
    type: type as Type,
    sort: sort as "newest" | "oldest",
  });
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issues fetched successfully",
    data: issues,
  });
};
const getSingleIssues = async (req: Request, res: Response) => {
  const { id } = req.params;
  const issue = await issueServices.getSingleIssuefromDB(id as string);
  console.log(issue);
  if (!issue) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No issue found",
    });
  }
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issue fetched successfully",
    data: issue,
  });
};
const updateIssue = async (req: Request, res: Response) => {};
const deleteIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await issueServices.deleteIssueFromDB(id as string);
  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No issue found",
    });
  }
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issue deleted successfully",
  });
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssues,
  updateIssue,
  deleteIssue,
};
