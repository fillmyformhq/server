import { Request, Response, NextFunction } from "express";
const ObjectsToCsv = require("objects-to-csv");
import { getTierType } from "../../utils/getTierInfo";
import { IResponse } from "../../types/IResponse";
import responseHandler from "../../utils/responseHandler";
import { IResponseInputParams } from "../../types/IResponseInputParams";
import find from "../../helpers/findMany.helpers";
import renameObjectKeys from "../../utils/objectKeysRenamer";

const generateCsv = async (req: Request, res: Response, next: NextFunction) => {
	const userPlanDetails = res.locals.userPlan;
	const userPlanType = getTierType(userPlanDetails.tierId);

	if (!userPlanType) {
		const errorObject = responseHandler({
			statusCode: "INTERNAL_SERVER_ERROR",
			data: { type: "error" },
			functionName: "generateCsv",
			message: null,
			uniqueCode: "user_plan_server_error",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	}

	if (userPlanType === "free") {
		const errorObject: IResponseInputParams = {
			data: { type: "error" },
			functionName: "generateCsv",
			message: "Plan doesn't support this feature",
			statusCode: "FORBIDDEN",
			uniqueCode: "generate_csv_forbidden",
		};
		const errorMessage: IResponse = responseHandler(errorObject);
		return res.status(errorMessage.status).json({ response: errorMessage });
	} else {
		const responseData = await find("responses", {
			user_id: userPlanDetails.userId,
		});
		if (responseData.type === "error") {
			const errorObject = responseHandler({
				statusCode: "INTERNAL_SERVER_ERROR",
				data: { type: "error" },
				functionName: "getApp",
				message: null,
				uniqueCode: "find_responses_server_error",
			});
			return res.status(errorObject.status).json({ response: errorObject });
		}

		const responsesArray = renameObjectKeys(responseData.data);

		if (responsesArray.length === 0) {
			const errorObject = responseHandler({
				statusCode: "NOT_FOUND",
				data: { type: "error" },
				functionName: "generateCsv",
				message: null,
				uniqueCode: "responses_not_found",
			});
			return res.status(errorObject.status).json({ response: errorObject });
		}

		const responses = responsesArray.map((i: any) => {
			let item = {};
			let response = JSON.parse(i.response);
			item = { ...response, createdAt: new Date(i.createdAt).toString() };
			return item;
		});

		const newCsvData = new ObjectsToCsv(responses);
		const csvData = await newCsvData.toString();

		const messageObject = responseHandler({
			statusCode: "SUCCESS",
			data: { type: "success", data: csvData },
			functionName: "generateCsv",
			message: null,
			uniqueCode: "csv_generate_success",
		});
		return res.status(messageObject.status).json({ response: messageObject });
	}
};

export { generateCsv };
