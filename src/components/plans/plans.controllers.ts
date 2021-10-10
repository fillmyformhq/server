import { Request, Response, NextFunction } from "express";
import createUserPlan from "../../helpers/createUserPlan.helpers";
import find from "../../helpers/findMany.helpers";
import { IResponse } from "../../types/IResponse";
import responseHandler from "../../utils/responseHandler";

const getUserPlanInfo = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!res.locals.user) {
		const errorResponse: IResponse = responseHandler({
			statusCode: "UNAUTHORIZED",
			data: { type: "error" },
			functionName: "updatePlan",
			message: "Not authorized!",
			uniqueCode: "err_not_authorized",
		});
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	const userId: string = res.locals.user.id;

	const fetchedUserPlan: { type: string; data: any } = await find(
		"user_plans",
		{ userId: userId }
	);
	if (fetchedUserPlan.type === "error") {
		const errorObject = responseHandler({
			statusCode: "INTERNAL_SERVER_ERROR",
			data: { type: "error" },
			functionName: "getUserPlanInfo",
			message: null,
			uniqueCode: "get_user_plan_server_error",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	} else {
		const messageObject = responseHandler({
			statusCode: "SUCCESS",
			data: { type: "success", data: fetchedUserPlan.data[0] },
			functionName: "getUserPlanInfo",
			message: null,
			uniqueCode: "user_plan_fetched_success",
		});
		return res.status(messageObject.status).json({ response: messageObject });
	}
};

const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
	if (!res.locals.user) {
		const errorResponse: IResponse = responseHandler({
			statusCode: "UNAUTHORIZED",
			data: { type: "error" },
			functionName: "updatePlan",
			message: "Not authorized!",
			uniqueCode: "err_not_authorized",
		});
		return res.status(errorResponse.status).json({ response: errorResponse });
	}

	const userId: string = res.locals.user.id;
	const tierType: string = req.params.tierType;
	let paymentId: string | null = null;

	/**
	 *  TODO: Add payments
	 */

	const updateUserPlan = await createUserPlan({
		userId: userId,
		tierType: tierType,
		paymentId: paymentId,
	});

	if (updateUserPlan.type === "success") {
		const successResponse: IResponse = responseHandler({
			statusCode: "CREATED",
			data: { type: "success" },
			functionName: "updatePlan",
			message: "Plan updated successfully!",
			uniqueCode: "plan_updated_success",
		});
		return res
			.status(successResponse.status)
			.json({ response: successResponse });
	} else {
		const errorResponse: IResponse = responseHandler({
			statusCode: "INTERNAL_SERVER_ERROR",
			data: { type: "error" },
			functionName: "updatePlan",
			message: null,
			uniqueCode: "updateuserplan_server_err",
		});
		return res.status(errorResponse.status).json({ response: errorResponse });
	}
};

export { updatePlan, getUserPlanInfo };
