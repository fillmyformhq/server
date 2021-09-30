import { Request, Response, NextFunction } from "express";
import find from "../../helpers/find.helpers";
import insertOne from "../../helpers/insertOne.helpers";
import { IResponse } from "../../types/IResponse";
import createNanoId from "../../utils/createNanoId";
import responseHandler from "../../utils/responseHandler";
import signJwt from "../../utils/signJwt";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	let { fullName, email, planType } = req.body;
	const userId: string = await createNanoId();

	if (!fullName || !email || !planType) {
		const errorObject: IResponse = responseHandler({
			statusCode: "UNPROCESSABLE",
			data: { type: "error" },
			functionName: "loginUser",
			message: "One of email, fullName, planType not present",
			uniqueCode: "login_user_data_not_valid",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	}

	fullName = fullName.trim().toLowerCase();
	email = email.trim().toLowerCase();

	let emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (!emailRegex.test(email)) {
		const errorObject: IResponse = responseHandler({
			statusCode: "UNPROCESSABLE",
			data: { type: "error" },
			functionName: "loginUser",
			message: "email not valid",
			uniqueCode: "invalid_register_email",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	}

	if (planType !== 1 && planType !== 2) {
		const errorObject: IResponse = responseHandler({
			statusCode: "UNPROCESSABLE",
			data: { type: "error" },
			functionName: "loginUser",
			message: "planType not equal to 1 or 2",
			uniqueCode: "invalid_plan_type",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	}

	const userToSave = {
		email,
		id: userId,
		full_name: fullName,
		plan: planType,
	};

	const findSavedUser: { type: string; data?: any } = await find("users", {
		email: email,
	});
	if (findSavedUser.type === "success") {
		if (findSavedUser.data.length === 0) {
			const saveUser = await insertOne("users", userToSave);
			if (saveUser.type === "error") {
				const errorObject = responseHandler({
					statusCode: "INTERNAL_SERVER_ERROR",
					data: { type: "error" },
					functionName: "loginUser",
					message: null,
					uniqueCode: "insert_new_user_server_error",
				});
				return res.status(errorObject.status).json({ response: errorObject });
			} else {
				const userId: string = saveUser.data.id;
				const jwtToken: string = signJwt(userId);
				const messageObject = responseHandler({
					statusCode: "CREATED",
					data: { type: "success", token: jwtToken },
					functionName: "loginUser",
					message: null,
					uniqueCode: "user_saved_logged_in",
				});
				return res
					.status(messageObject.status)
					.json({ response: messageObject });
			}
		} else if (findSavedUser.data.length === 1) {
			const userId: string = findSavedUser.data[0].id;
			const jwtToken: string = signJwt(userId);
			const messageObject = responseHandler({
				statusCode: "SUCCESS",
				data: { type: "success", token: jwtToken },
				functionName: "loginUser",
				message: null,
				uniqueCode: "user_found_logged_in",
			});
			return res.status(messageObject.status).json({ response: messageObject });
		} else {
			const errorObject = responseHandler({
				statusCode: "INTERNAL_SERVER_ERROR",
				data: { type: "error" },
				functionName: "loginUser",
				message: null,
				uniqueCode: "find_saved_user_server_error",
			});
			return res.status(errorObject.status).json({ response: errorObject });
		}
	} else {
		const errorObject = responseHandler({
			statusCode: "INTERNAL_SERVER_ERROR",
			data: { type: "error" },
			functionName: "loginUser",
			message: null,
			uniqueCode: "find_saved_user_server_error",
		});
		return res.status(errorObject.status).json({ response: errorObject });
	}
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
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

	const user = res.locals.user;

	const messageResponse: IResponse = responseHandler({
		statusCode: "SUCCESS",
		data: { type: "success", data: user },
		functionName: "getUser",
		message: null,
		uniqueCode: "user_authorized",
	});
	return res.status(messageResponse.status).json({ response: messageResponse });
};

export { loginUser, getUser };
