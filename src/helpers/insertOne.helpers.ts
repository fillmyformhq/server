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

		if (!insertedObj) return { type: "error", data: null };
		return { type: "success", data: insertedObj };
	} catch (err) {
		return { type: "error", data: null };
	}
};

export default insertOne;
