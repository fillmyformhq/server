import { Request, Response, NextFunction } from "express";
import find from "../../helpers/find.helpers";
import insertOne from "../../helpers/insertOne.helpers";
import updateOne from "../../helpers/updateOne.helpers";
import { IResponse } from "../../types/IResponse";
import createNanoId from "../../utils/createNanoId";
import responseHandler from "../../utils/responseHandler";

const createApp = async (req: Request, res: Response, next: NextFunction) => {
	if (!res.locals.user) {
		const errorResponse: IResponse = responseHandler({
			statusCode: "UNAUTHORIZED",
			data: { type: "error" },
			functionName: "createApp",
			message: "Not authorized!",
			uniqueCode: "err_not_authorized",
		});
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	const userId: string = res.locals.user.id;
	const { appName, description } = req.body;
	const appId = await createNanoId();

	let appNameRegex: RegExp = /^[A-Za-z0-9\_]+$/;

	if (
		!appName ||
		!description ||
		description.split(" ").length > 32 ||
		!appNameRegex.test(appName)
	) {
		const errorObject: IResponse = responseHandler({
			statusCode: "UNPROCESSABLE",
			data: { type: "error" },
			functionName: "createApp",
			message: "Appname or description not valid!",
			uniqueCode: "create_app_data_not_valid",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	}

	const appData = {
		id: appId,
		app_name: appName,
		description,
		user_id: userId,
	};
	const createdApp = await insertOne("apps", appData);
	if (createdApp.type === "error") {
		const errorObject = responseHandler({
			statusCode: "INTERNAL_SERVER_ERROR",
			data: { type: "error" },
			functionName: "createApp",
			message: null,
			uniqueCode: "create_new_app_server_error",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	} else {
		const messageObject = responseHandler({
			statusCode: "CREATED",
			data: { type: "success" },
			functionName: "createApp",
			message: null,
			uniqueCode: "app_created",
		});
		return res.status(messageObject.status).json({ response: messageObject });
	}
};

const listApps = async (req: Request, res: Response, next: NextFunction) => {
	if (!res.locals.user) {
		const errorResponse: IResponse = responseHandler({
			statusCode: "UNAUTHORIZED",
			data: { type: "error" },
			functionName: "listApps",
			message: "Not authorized!",
			uniqueCode: "err_not_authorized",
		});
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	const userId: string = res.locals.user.id;

	const foundApps: any = await find("apps", { user_id: userId, active: true });
	if (foundApps.type === "error") {
		const errorObject = responseHandler({
			statusCode: "INTERNAL_SERVER_ERROR",
			data: { type: "error" },
			functionName: "listApps",
			message: null,
			uniqueCode: "list_apps_server_error",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	} else {
		if (foundApps.data.length === 0) {
			const errorObject = responseHandler({
				statusCode: "NOT_FOUND",
				data: { type: "error" },
				functionName: "listApps",
				message: null,
				uniqueCode: "list_apps_not_found",
			});
			return res.status(errorObject.status).json({ response: errorObject });
		} else {
			const responseObject = responseHandler({
				statusCode: "SUCCESS",
				data: { type: "success", data: foundApps.data },
				functionName: "listApps",
				message: null,
				uniqueCode: "list_apps_success",
			});
			return res
				.status(responseObject.status)
				.json({ response: responseObject });
		}
	}
};

const disableApp = async (req: Request, res: Response, next: NextFunction) => {
	if (!res.locals.user) {
		const errorResponse: IResponse = responseHandler({
			statusCode: "UNAUTHORIZED",
			data: { type: "error" },
			functionName: "disableApp",
			message: "Not authorized!",
			uniqueCode: "err_not_authorized",
		});
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	const userId: string = res.locals.user.id;
	const appId: string = req.params.id;

	const updatedApp = await updateOne(
		"apps",
		{ active: true, id: appId, user_id: userId },
		{ active: false }
	);

	if (updatedApp.type === "error" || updatedApp.data.id !== appId) {
		const errorObject = responseHandler({
			statusCode: "INTERNAL_SERVER_ERROR",
			data: { type: "error" },
			functionName: "disableApp",
			message: null,
			uniqueCode: "disable_app_server_err",
		});

		return res.status(errorObject.status).json({ response: errorObject });
	} else {
		const responseObject = responseHandler({
			statusCode: "SUCCESS",
			data: { type: "success" },
			functionName: "disableApp",
			message: null,
			uniqueCode: "disable_app_success",
		});

		return res.status(responseObject.status).json({ response: responseObject });
	}
};

export { createApp, listApps, disableApp };
