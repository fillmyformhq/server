import { Request, Response, NextFunction } from "express";
import configSettings from "../config/config";
import redis from "../config/redisConfig";
import { IResponse } from "../types/IResponse";
import { IResponseInputParams } from "../types/IResponseInputParams";
import responseHandler from "../utils/responseHandler";

const ipRequestLimiter = (
	secondsWindowParam: number,
	hitsAllowedParam: number
) => {
	const secondsWindow =
		configSettings.ENVIRONMENT === "development" ? 60 : secondsWindowParam;

	const hitsAllowed =
		configSettings.ENVIRONMENT === "development" ? 60 : hitsAllowedParam;

	return async (req: Request, res: Response, next: NextFunction) => {
		const ip =
			<string>req.headers["x-forwarded-for"] || req.socket.remoteAddress;

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

		let requests: number;

		redis.incr(ip, (err, val) => {
			if (err) {
				const responseObject: IResponseInputParams = {
					statusCode: "INTERNAL_SERVER_ERROR",
					functionName: null,
					message: null,
					data: null,
					uniqueCode: "redis_incr_error",
				};
				const errorObject: IResponse = responseHandler(responseObject);
				return res.status(errorObject.status).json(errorObject);
			}
			requests = val;

			if (!requests) {
				const responseObject: IResponseInputParams = {
					statusCode: "INTERNAL_SERVER_ERROR",
					functionName: null,
					message: null,
					data: null,
					uniqueCode: "redis_incr_error",
				};
				const errorObject: IResponse = responseHandler(responseObject);
				return res.status(errorObject.status).json(errorObject);
			}

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
		});
	};
};

export default ipRequestLimiter;
