import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IResponse } from "../types/IResponse";
import responseHandler from "../utils/responseHandler";
import config from "../config/config";
import findOne from "../helpers/findOne.helpers";
import { IHelperResponse } from "../types/IHelperResponse";

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

	if (!req.cookies["AuthToken"]) {
		const errorResponse: IResponse = unauthResponseHandler();
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	const token: string = req.cookies["AuthToken"];

	jwt.verify(token, JWT_SECRET, async (err: any, payload: any) => {
		if (err) {
			const errorResponse: IResponse = unauthResponseHandler();
			return res.status(errorResponse.status).json({ response: errorResponse });
		} else {
			const userId = payload.id;
			const fetchedUser: IHelperResponse = await findOne("users", {
				id: userId,
			});
			if (fetchedUser.type === "success") {
				if (fetchedUser.uniqueCode === "no_item") {
					const errorResponse: IResponse = unauthResponseHandler();
					return res
						.status(errorResponse.status)
						.json({ response: errorResponse });
				}

				res.locals.user = fetchedUser.data;
				if (!res.locals.user) {
					const errorResponse: IResponse = unauthResponseHandler();
					return res
						.status(errorResponse.status)
						.json({ response: errorResponse });
				}
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
