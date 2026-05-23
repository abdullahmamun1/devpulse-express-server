import type { NextFunction, Request, Response } from "express";
import { issueServices } from "./issues.service";
import sendResponse from "../../utils/sendResponse";
import type { IIssue, IIssueUpdate, Status, Type } from "./issues.interface";
const createIssue = async (
  req: Request<
    Record<string, never>,
    unknown,
    Pick<IIssue, "title" | "description" | "type">
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, type, sort = "newest" } = req.query;
    const issues = await issueServices.getAllIssuesfromDB({
      ...(status && { status: status as Status }),
      ...(type && { type: type as Type }),
      sort: sort as "newest" | "oldest",
    });
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};
const getSingleIssues = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const issue = await issueServices.getSingleIssuefromDB(id);
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
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};
const updateIssue = async (
  req: Request<{ id: string }, unknown, Partial<IIssueUpdate>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized!!",
      });
    }
    const issue = await issueServices.updateIssueinDB(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role,
    );
    if (!issue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found!!",
      });
    }
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};
const deleteIssue = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await issueServices.deleteIssueFromDB(id);
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
  } catch (error) {
    next(error);
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssues,
  updateIssue,
  deleteIssue,
};
