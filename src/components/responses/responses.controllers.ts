import { Request, Response, NextFunction } from "express";
import find from "../../helpers/find.helpers";
import insertOne from "../../helpers/insertOne.helpers";
import { IResponse } from "../../types/IResponse";
import createNanoId from "../../utils/createNanoId";
import responseHandler from "../../utils/responseHandler";

const saveResponse = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const appId: string = req.params.appId;
	const response = req.body;
	if (!response) {
		res.writeHead(301, { Location: "https://fillmyform.xyz/message/error" });
		res.end();
	}

	const responseId = await createNanoId();
	const parsedResponse = JSON.stringify(response);

	const checkIfAppExist: any = await find("apps", { id: appId });
	if (checkIfAppExist.type === "error") {
		res.writeHead(301, { Location: "https://fillmyform.xyz/message/error" });
		res.end();
	} else {
		if (checkIfAppExist.data.length === 1) {
			const savedResponse = await insertOne("apps", {
				id: responseId,
				response: parsedResponse,
				app_id: appId,
			});

			if (savedResponse.type === "error") {
				res.writeHead(301, {
					Location: "https://fillmyform.xyz/message/error",
				});
				res.end();
			} else {
				res.writeHead(301, {
					Location: "https://fillmyform.xyz/message/success",
				});
				res.end();
			}

			res.writeHead(301, { Location: "https://fillmyform.xyz/message/error" });
			res.end();
		} else {
			res.writeHead(301, { Location: "https://fillmyform.xyz/message/error" });
			res.end();
		}
	}
};

const listResponses = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!res.locals.user) {
		const errorResponse: IResponse = responseHandler({
			statusCode: "UNAUTHORIZED",
			data: { type: "error" },
			functionName: "listResponses",
			message: "Not authorized!",
			uniqueCode: "err_not_authorized",
		});
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	const userId: string = res.locals.user.id;
	const appId: string = req.params.appId;

	const savedApp: any = await find("apps", { user_id: userId, id: appId });
	if (savedApp.type === "error") {
		const errorObject = responseHandler({
			statusCode: "INTERNAL_SERVER_ERROR",
			data: { type: "error" },
			functionName: "listResponses",
			message: null,
			uniqueCode: "saved_app_server_error",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	} else {
		if (savedApp.data.length === 1) {
			const savedResponses: any = await find("responses", { app_id: appId });
			if (savedResponses.type === "error") {
				const errorObject = responseHandler({
					statusCode: "INTERNAL_SERVER_ERROR",
					data: { type: "error" },
					functionName: "listResponses",
					message: null,
					uniqueCode: "find_responses_server_error",
				});
				return res.status(errorObject.status).json({ response: errorObject });
			} else {
				if (savedResponses.data.length === 0) {
					const errorObject = responseHandler({
						statusCode: "NOT_FOUND",
						data: { type: "error" },
						functionName: "listResponses",
						message: null,
						uniqueCode: "saved_responses_not_found",
					});
					return res.status(errorObject.status).json({ response: errorObject });
				} else {
					const errorObject = responseHandler({
						statusCode: "SUCCESS",
						data: { type: "success", data: savedResponses.data },
						functionName: "listResponses",
						message: null,
						uniqueCode: "saved_responses_found",
					});
					return res.status(errorObject.status).json({ response: errorObject });
				}
			}
		} else {
			const errorObject = responseHandler({
				statusCode: "INTERNAL_SERVER_ERROR",
				data: { type: "error" },
				functionName: "listResponses",
				message: null,
				uniqueCode: "saved_app_responses_server_error",
			});
			return res.status(errorObject.status).json({ response: errorObject });
		}
	}
};

const getResponse = async (req: Request, res: Response, next: NextFunction) => {
	if (!res.locals.user) {
		const errorResponse: IResponse = responseHandler({
			statusCode: "UNAUTHORIZED",
			data: { type: "error" },
			functionName: "listResponses",
			message: "Not authorized!",
			uniqueCode: "err_not_authorized",
		});
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	const responseId: string = req.params.id;

	const foundResponse: any = await find("responses", { id: responseId });
	if (foundResponse.type === "error") {
		const errorObject = responseHandler({
			statusCode: "INTERNAL_SERVER_ERROR",
			data: { type: "error" },
			functionName: "getResponse",
			message: null,
			uniqueCode: "get_response_server_error",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	} else {
		if (foundResponse.data.length === 0) {
			const errorObject = responseHandler({
				statusCode: "NOT_FOUND",
				data: { type: "error" },
				functionName: "getResponse",
				message: null,
				uniqueCode: "saved_response_not_found",
			});
			return res.status(errorObject.status).json({ response: errorObject });
		} else {
			const messageObject = responseHandler({
				statusCode: "SUCCESS",
				data: { type: "success", data: foundResponse.data[0] },
				functionName: "getResponse",
				message: null,
				uniqueCode: "success_get_response",
			});
			return res.status(messageObject.status).json({ response: messageObject });
		}
	}
};

export { saveResponse, listResponses, getResponse };
