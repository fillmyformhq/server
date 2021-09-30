import { Request, Response, NextFunction } from "express";
import { IResponse } from "../types/IResponse";
import responseHandler from "../utils/responseHandler";

let whitelist =
	process.env.NODE_ENV === "development"
		? ["http://localhost:8080"]
		: ["https://www.fillmyform.xyz", "https://fillmyform.xyz"];

const errorObject = (): IResponse => {
	return responseHandler({
		statusCode: "UNAUTHORIZED",
		data: { type: "error" },
		functionName: null,
		message: "Not Authorized to access this route",
		uniqueCode: "not_authorized",
	});
};

const checkOrigin = (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.origin) {
		const errorObj: IResponse = errorObject();
		return res.status(errorObj.status).json({ response: errorObj });
	}
	let origin = req.headers.origin;
	if (whitelist.indexOf(origin) > -1) {
		next();
	} else {
		const errorObj: IResponse = errorObject();
		return res.status(errorObj.status).json({ response: errorObj });
	}
};

export default checkOrigin;
