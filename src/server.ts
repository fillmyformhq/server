import express, { Application, Request, Response } from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import checkOrigin from "./middlewares/checkOrigin.middlewares";
import ipRequestLimiter from "./middlewares/ipRequestLimiter.middlewares";

const app: Application = express();

/*
 * @middlewares
 */

app.use(ipRequestLimiter);
app.use(cors());
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

app.use("/api/v1/user", [checkOrigin, userRoutes]);
app.use("/api/v1/app", [checkOrigin, appRoutes]);
app.use("/api/v1/response", responseRoutes);
app.use("/api/v1/plan", [checkOrigin, planRoutes]);

/*
 * @additionalConfig
 */

import configSettings from "./config/config";
const PORT: number = configSettings.PORT;
app.listen(PORT, () => console.log(`server is running ${PORT}`));
