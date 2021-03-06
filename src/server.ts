import express, { Application, Request, Response } from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import slowDown from "express-slow-down";
import cookieParser from "cookie-parser";
import checkOrigin from "./middlewares/checkOrigin.middlewares";
import ipRequestLimiter from "./middlewares/ipRequestLimiter.middlewares";

const app: Application = express();

/*
 * @middlewares
 */

const speedLimiter = slowDown({
	windowMs: 15 * 60 * 1000, // 15 minutes
	delayAfter: 100, // allow 100 requests per 15 minutes, then...
	delayMs: 500, // begin adding 500ms of delay per request above 100
});

app.use(speedLimiter);
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.enable("trust proxy"); //To log IP Address of the requests
app.use(
	logger(
		":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"
	)
);

/*
 * @routes
 */

app.get("/", (req: Request, res: Response) => {
	return res.json("Hello there you user!!");
});

import userRoutes from "./components/users/users.routes";
import appRoutes from "./components/apps/apps.routes";
import responseRoutes from "./components/responses/responses.routes";
import planRoutes from "./components/plans/plans.routes";
import featureRoutes from "./components/features/features.routes";

app.use("/api/v1/user", [checkOrigin, ipRequestLimiter(60, 20), userRoutes]);
app.use("/api/v1/app", [checkOrigin, ipRequestLimiter(60, 20), appRoutes]);
app.use("/api/v1/response", responseRoutes);
app.use("/api/v1/plan", [ipRequestLimiter(60, 20), planRoutes]);
app.use(
	"/api/v1/feature",
	[checkOrigin, ipRequestLimiter(60, 20)],
	featureRoutes
);

/*
 * @additionalConfig
 */

import configSettings from "./config/config";
const PORT: number = configSettings.PORT;
app.listen(PORT, () => console.log(`server is running ${PORT}`));
