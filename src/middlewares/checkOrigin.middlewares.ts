import { Request, Response, NextFunction } from "express";
import configSettings from "../config/config";
import { IResponse } from "../types/IResponse";
import responseHandler from "../utils/responseHandler";

let whitelistOrigin: string =
	configSettings.ENVIRONMENT === "development" ? "localhost" : "fillmyform.xyz";

const errorObject = (): IResponse => {
	return responseHandler({
		statusCode: "UNAUTHORIZED",
		data: { type: "error" },
		functionName: null,
		message: "Not Authorized to access this route",
		uniqueCode: "origin_unauthorized",
	});
};

const checkOrigin = (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.origin) {
		const errorObj: IResponse = errorObject();
		return res.status(errorObj.status).json({ response: errorObj });
	}
	const origin: string = req.headers.origin;
	if (origin.includes(whitelistOrigin)) {
		next();
	} else {
		const errorObj: IResponse = errorObject();
		return res.status(errorObj.status).json({ response: errorObj });
	}
};

export default checkOrigin;
