import db from "../config/postgresConfig";
import { IHelperResponse } from "../types/IHelperResponse";

const insertOne = async (
	dbType: string,
	objectToInsert: object
): Promise<IHelperResponse> => {
	try {
		const [insertedObj] = await db(dbType)
			.insert(objectToInsert)
			.returning("*");

		if (!insertedObj)
			return { type: "error", data: null, uniqueCode: "server_error_0" };
		return { type: "success", data: insertedObj, uniqueCode: "insert_success" };
	} catch (err) {
		return { type: "error", data: null, uniqueCode: "server_error_1" };
	}
};

export default insertOne;
