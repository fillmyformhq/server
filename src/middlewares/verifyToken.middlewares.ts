import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IResponse } from "../types/IResponse";
import responseHandler from "../utils/responseHandler";
import config from "../config/config";
import find from "../helpers/find.helpers";

async function verifyToken(req: Request, res: Response, next: NextFunction) {
	const JWT_SECRET: string = config.JWT_SECRET;

	const authorization: any = req.headers.authorization;

	if (authorization === null || authorization === undefined || !authorization) {
		const errorResponse: IResponse = responseHandler({
			statusCode: "UNAUTHORIZED",
			data: { type: "error" },
			functionName: "verifyToken",
			message: "Not authorized!",
			uniqueCode: "err_not_authorized",
		});
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	const token = authorization.replace("Bearer ", "");
	if (!token) {
		const errorResponse: IResponse = responseHandler({
			statusCode: "UNAUTHORIZED",
			data: { type: "error" },
			functionName: "verifyToken",
			message: "Not authorized!",
			uniqueCode: "err_not_authorized",
		});
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	jwt.verify(token, JWT_SECRET, async (err: any, payload: any) => {
		if (err) {
			const errorResponse: IResponse = responseHandler({
				statusCode: "UNAUTHORIZED",
				data: { type: "error" },
				functionName: "verifyToken",
				message: "Not authorized!",
				uniqueCode: "err_not_authorized",
			});
			return res.status(errorResponse.status).json({ response: errorResponse });
		} else {
			const userId = payload.userData.id;
			const fetchedUser: { type: string; data?: any } = await find("users", {
				id: userId,
			});
			if (fetchedUser.type === "success") {
				if (fetchedUser.data.length !== 1) {
					const errorResponse: IResponse = responseHandler({
						statusCode: "UNAUTHORIZED",
						data: { type: "error" },
						functionName: "verifyToken",
						message: "Not authorized!",
						uniqueCode: "err_not_authorized",
					});
					return res
						.status(errorResponse.status)
						.json({ response: errorResponse });
				}

				res.locals.user = fetchedUser.data[0];
				next();
			} else {
				const errorResponse: IResponse = responseHandler({
					statusCode: "INTERNAL_SERVER_ERROR",
					data: { type: "error" },
					functionName: "verifyToken",
					message: "Internal server error!",
					uniqueCode: "server_err_verifyToken",
				});
				return res
					.status(errorResponse.status)
					.json({ response: errorResponse });
			}
		}
	});
}

export default verifyToken;
