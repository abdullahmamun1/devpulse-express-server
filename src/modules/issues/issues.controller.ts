import type { Request, Response } from "express";
import { issueServices } from "./issues.service";
import sendResponse from "../../utils/sendResponse";
const createIssue = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized!!",
    });
  }
  const issue = await issueServices.createIssue({
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
const getAllIssues = async (req: Request, res: Response) => {};
const getSingleIssues = async (req: Request, res: Response) => {};
const updateIssue = async (req: Request, res: Response) => {};
const deleteIssue = async (req: Request, res: Response) => {};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssues,
  updateIssue,
  deleteIssue,
};
