import { IResponse } from "../types/IResponse";

interface InputParams {
	statusCode: string;
	functionName: string | null;
	message: string | null;
	data: object | null;
	uniqueCode: string;
}

const responseHandler = (responseParamObj: InputParams): IResponse => {
	const obj1 = {
		uniqueCode: responseParamObj.uniqueCode,
		functionName: responseParamObj.functionName,
		message: responseParamObj.message,
		data: responseParamObj.data,
	};

	const obj2 = generateResponse(responseParamObj.statusCode);

	return { ...obj1, ...obj2 };
};

const generateResponse = (statusCode: string) => {
	switch (statusCode) {
		case "SUCCESS":
			return {
				status: 200,
				serverMessage: "Request Success!",
			};
		case "CREATED":
			return {
				status: 201,
				serverMessage: "Request success and object created!",
			};
		case "BAD":
			return {
				status: 400,
				serverMessage: "Bad Request!",
			};
		case "UNAUTHORIZED":
			return {
				status: 401,
				serverMessage: "Request unauthorized!",
			};
		case "FORBIDDEN":
			return {
				status: 403,
				serverMessage: "Request Forbidden!",
			};
		case "NOT_FOUND":
			return {
				status: 404,
				serverMessage: "Resource Not Found!",
			};
		case "UNPROCESSABLE":
			return {
				status: 422,
				serverMessage: "Request unprocessable!",
			};
		case "INTERNAL_SERVER_ERROR":
			return {
				status: 500,
				serverMessage: "Internal server error!",
			};
		default:
			return {
				status: 2001,
				uniqueCode: "no_code",
				serverMessage: "Response doesnot exist for this code",
				message: null,
				data: null,
			};
	}
};

export default responseHandler;
