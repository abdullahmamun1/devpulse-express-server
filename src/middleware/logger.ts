import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const log = `[${new Date().toLocaleString()}], Method -> ${req.method}, URL -> ${req.url}\n`;
  console.log(log);
  fs.appendFile("logger.txt", log, (err) => {
    if (err) {
      console.log("Error writing to log file", err);
    }
    next();
  });
};

export default logger;
