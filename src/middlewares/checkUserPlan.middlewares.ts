import { Request, Response, NextFunction } from "express";
import responseHandler from "../utils/responseHandler";
import findOne from "../helpers/findOne.helpers";
import { IHelperResponse } from "../types/IHelperResponse";
import renameObjectKeys from "../utils/objectKeysRenamer";
import { IResponseInputParams } from "../types/IResponseInputParams";
import { IResponse } from "../types/IResponse";
import isPlanExpired from "../utils/isPlanExpired";
import createUserPlan from "../helpers/createUserPlan.helpers";
import { IUserPlan } from "../types/IUserPlan";

const checkUserPlan = (user_id: string | null) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const userId: string = res.locals.user.id || user_id;

		if (!userId) {
			const errorObj: IResponseInputParams = {
				data: { type: "error" },
				functionName: "checkUserPlan",
				message: null,
				statusCode: "UNAUTHORIZED",
				uniqueCode: "check_user_plan_not_auth",
			};
			const errorMessage: IResponse = responseHandler(errorObj);
			return res.status(errorMessage.status).json({ response: errorMessage });
		}

		const currentUserPlan: IHelperResponse = await findOne("user_plans", {
			user_id: userId,
		});
		if (
			currentUserPlan.type === "error" ||
			(currentUserPlan.type === "success" && currentUserPlan.data === null)
		) {
			const errorObject = responseHandler({
				statusCode: "INTERNAL_SERVER_ERROR",
				data: { type: "error" },
				functionName: "checkUserPlan",
				message: null,
				uniqueCode: "check_user_plan_server_error",
			});
			return res.status(errorObject.status).json({ response: errorObject });
		}

		const userPlan: any = renameObjectKeys([currentUserPlan.data])[0];
		const planCreateDate = userPlan.createdAt;

		const checkPlanExpired: boolean = isPlanExpired(planCreateDate);

		let finalUserPlan = userPlan;

		if (checkPlanExpired) {
			const userPlanData: IUserPlan = {
				paymentId: null,
				tierType: "free",
				userId: userId,
			};
			const newUserPlan: IHelperResponse = await createUserPlan(userPlanData);
			if (newUserPlan.type === "error") {
				const errorObject = responseHandler({
					statusCode: "INTERNAL_SERVER_ERROR",
					data: { type: "error" },
					functionName: "checkUserPlan",
					message: null,
					uniqueCode: "check_user_plan_server_error_1",
				});
				return res.status(errorObject.status).json({ response: errorObject });
			} else {
				finalUserPlan = renameObjectKeys([newUserPlan.data])[0];
			}
		}

		res.locals.userPlan = finalUserPlan;
		next();
	};
};

export default checkUserPlan;
