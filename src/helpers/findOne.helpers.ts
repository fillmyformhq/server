import db from "../config/postgresConfig";
import { IHelperResponse } from "../types/IHelperResponse";

const findOne = async (
	dbType: string,
	findObjectQuery: object
): Promise<IHelperResponse> => {
	try {
		const foundObjects = await db(dbType)
			.where(findObjectQuery)
			.orderBy("created_at", "desc")
			.returning("*");

		if (foundObjects) {
			if (foundObjects.length === 0) {
				return { type: "error", data: null };
			} else {
				return { type: "success", data: foundObjects[0] };
			}
		} else return { type: "error", data: null };
	} catch (err) {
		return { type: "error", data: null };
	}
};

export default findOne;
