import { Request, Response, NextFunction } from "express";
import { getTierType } from "../../utils/getTierInfo";
import { IResponse } from "../../types/IResponse";
import responseHandler from "../../utils/responseHandler";
import { IResponseInputParams } from "../../types/IResponseInputParams";

const generateCsv = async (req: Request, res: Response, next: NextFunction) => {
	const userPlanDetails = res.locals.userPlan;
	const userPlan = getTierType(userPlanDetails.tierId);

	if (userPlan === "free") {
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
	}
};

export { generateCsv };
