import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IResponse } from "../types/IResponse";
import responseHandler from "../utils/responseHandler";
import config from "../config/config";
import findOne from "../helpers/findOne.helpers";

const unauthResponseHandler = (): IResponse => {
	const errorResponse: IResponse = responseHandler({
		statusCode: "UNAUTHORIZED",
		data: { type: "error" },
		functionName: "verifyToken",
		message: "Not authorized!",
		uniqueCode: "err_not_authorized_0",
	});

	return errorResponse;
};

async function verifyToken(req: Request, res: Response, next: NextFunction) {
	const JWT_SECRET: string = config.JWT_SECRET;

	const authorization: string | undefined | null = req.headers.authorization;

	if (!authorization) {
		const errorResponse: IResponse = unauthResponseHandler();
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	const token = authorization.replace("Bearer ", "");
	if (!token) {
		const errorResponse: IResponse = unauthResponseHandler();
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	jwt.verify(token, JWT_SECRET, async (err: any, payload: any) => {
		if (err) {
			const errorResponse: IResponse = unauthResponseHandler();
			return res.status(errorResponse.status).json({ response: errorResponse });
		} else {
			const userId = payload.userData.id;
			const fetchedUser: { type: string; data: any } = await findOne("users", {
				id: userId,
			});
			if (fetchedUser.type === "success" && fetchedUser.data !== null) {
				res.locals.user = fetchedUser.data;
				next();
			} else {
				const errorResponse: IResponse = unauthResponseHandler();
				return res
					.status(errorResponse.status)
					.json({ response: errorResponse });
			}
		}
	});
}

export default verifyToken;
