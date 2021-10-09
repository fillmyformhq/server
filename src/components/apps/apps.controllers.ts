import { Request, Response, NextFunction } from "express";
import findOne from "../../helpers/findOne.helpers";
import insertOne from "../../helpers/insertOne.helpers";
import { IHelperResponse } from "../../types/IHelperResponse";
import { IResponse } from "../../types/IResponse";
import createNanoId from "../../utils/createNanoId";
import responseHandler from "../../utils/responseHandler";

const getApp = async (req: Request, res: Response, next: NextFunction) => {
	const userId: string = res.locals.user.id;

	const fetchedApp: IHelperResponse = await findOne("apps", {
		created_by: userId,
	});
	if (fetchedApp.type === "error") {
		const errorObject = responseHandler({
			statusCode: "INTERNAL_SERVER_ERROR",
			data: { type: "error" },
			functionName: "getApp",
			message: null,
			uniqueCode: "get_app_server_error",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	} else {
		if (fetchedApp.data === null) {
			const errorObject = responseHandler({
				statusCode: "NOT_FOUND",
				data: { type: "error" },
				functionName: "getApp",
				message: null,
				uniqueCode: "get_app_not_found",
			});
			return res.status(errorObject.status).json({ response: errorObject });
		} else {
			const messageObject = responseHandler({
				statusCode: "SUCCESS",
				data: { type: "success", data: fetchedApp.data },
				functionName: "getApp",
				message: null,
				uniqueCode: "app_fetched_success",
			});
			return res.status(messageObject.status).json({ response: messageObject });
		}
	}
};

const createApp = async (req: Request, res: Response, next: NextFunction) => {
	const userId: string = res.locals.user.id;
	const { appName, description, website } = req.body;
	const appId = await createNanoId();

	let appNameRegex: RegExp = /^[A-Za-z0-9]+$/;

	if (
		!website ||
		!appName ||
		!description ||
		description.split(" ").length > 16 ||
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
		name: appName,
		description,
		website,
		created_by: userId,
	};
	const createdApp: IHelperResponse = await insertOne("apps", appData);
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
			data: { type: "success", data: createdApp },
			functionName: "createApp",
			message: null,
			uniqueCode: "app_created",
		});
		return res.status(messageObject.status).json({ response: messageObject });
	}
};

export { createApp, getApp };
