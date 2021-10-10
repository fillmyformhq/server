import { Request, Response, NextFunction } from "express";
import findOne from "../../helpers/findOne.helpers";
import insertOne from "../../helpers/insertOne.helpers";
import { IHelperResponse } from "../../types/IHelperResponse";
import { IResponse } from "../../types/IResponse";
import createNanoId from "../../utils/createNanoId";
import renameObjectKeys from "../../utils/objectKeysRenamer";
import responseHandler from "../../utils/responseHandler";

const getApp = async (req: Request, res: Response, next: NextFunction) => {
	const userId: string = res.locals.user.id;

	const fetchedApp: IHelperResponse = await findOne("apps", {
		user_id: userId,
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
				data: { type: "success", data: renameObjectKeys([fetchedApp.data])[0] },
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
	let { appName, description, website } = req.body;
	const appId = await createNanoId();

	let appNameRegex: RegExp = /^[A-Za-z0-9]+$/;

	if (
		!website ||
		!appName ||
		!description ||
		!website.trim() ||
		!appName.trim() ||
		!description.trim() ||
		appName.length > 16 ||
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

	let partsOfUrl = website.split(".");
	if (
		partsOfUrl.length < 2 ||
		partsOfUrl[0].includes("www") ||
		partsOfUrl[0].includes("http")
	) {
		const errorObject: IResponse = responseHandler({
			statusCode: "UNPROCESSABLE",
			data: { type: "error" },
			functionName: "createApp",
			message: "website url invalid",
			uniqueCode: "create_app_website_not_valid",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	}

	const appData = {
		id: appId,
		name: appName.trim(),
		description: description.trim(),
		website: website.toLowerCase().trim(),
		user_id: userId,
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
			data: { type: "success", data: renameObjectKeys([createdApp.data])[0] },
			functionName: "createApp",
			message: null,
			uniqueCode: "app_created",
		});
		return res.status(messageObject.status).json({ response: messageObject });
	}
};

export { createApp, getApp };
