import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import logger from "./middleware/logger";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(globalErrorHandler);
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is DevPulse Express Server",
    author: "Abdullah Mamun",
  });
});

export default app;
