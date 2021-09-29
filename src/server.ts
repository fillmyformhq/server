import { config } from "dotenv";
config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";

const app: Application = express();

/**
 * @middlewares
 */
app.use(cors());
app.use(helmet());
app.use(express.json());
app.enable("trust proxy"); //To log IP Address of the requests
app.use(
	logger(
		":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"
	)
);

/**
 * @routes
 */
app.get("/", (req: Request, res: Response) => {
	return res.json("Hello there you user!!");
});

import configSettings from "./config/config";
const PORT: number = configSettings.PORT;
app.listen(PORT, () => console.log(`server is running ${PORT}`));
