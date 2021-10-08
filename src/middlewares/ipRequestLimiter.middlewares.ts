import { Request, Response, NextFunction } from "express";
import redis from "../config/redisConfig";
import { IResponse } from "../types/IResponse";
import { IResponseInputParams } from "../types/IResponseInputParams";
import responseHandler from "../utils/responseHandler";

const secondsWindow = 60;
const hitsAllowed = 15;

const ipRequestLimiter = (req: Request, res: Response, next: NextFunction) => {
	const ip = <string>req.headers["x-forwarded-for"] || req.socket.remoteAddress;

	if (!ip) {
		const responseObject: IResponseInputParams = {
			statusCode: "BAD",
			uniqueCode: "IP_NOT_FOUND",
			functionName: null,
			message: "IP not found",
			data: null,
		};
		const response: IResponse = responseHandler(responseObject);
		return res.status(response.status).json(response);
	}

	const requests: any = redis.incr(ip);

	if (requests === 1) {
		redis.expire(ip, secondsWindow);
	}

	if (requests > hitsAllowed) {
		const responseObject: IResponseInputParams = {
			statusCode: "SERVICE_UNAVAILABLE",
			functionName: null,
			message: "Too many requests",
			data: null,
			uniqueCode: "IP_REQUESTS_EXCEEDED",
		};
		const errorObject: IResponse = responseHandler(responseObject);
		return res.status(errorObject.status).json(errorObject);
	} else {
		next();
	}
};

export default ipRequestLimiter;
