import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import logger from "./middleware/logger";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import { issueRoutes } from "./modules/issues/issues.route";

const app: Application = express();

app.use(express.json());

app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is DevPulse Express Server",
    author: "Abdullah Mamun",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.use(globalErrorHandler);

export default app;
