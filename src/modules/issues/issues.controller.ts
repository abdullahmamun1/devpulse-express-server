import type { Request, Response } from "express";
const createIssue = async (req: Request, res: Response) => {};
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
