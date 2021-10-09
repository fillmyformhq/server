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
				return { type: "success", data: null, uniqueCode: "no_item" };
			} else {
				return {
					type: "success",
					data: foundObjects[0],
					uniqueCode: "found_item",
				};
			}
		} else return { type: "error", data: null, uniqueCode: "server_error_0" };
	} catch (err) {
		return { type: "error", data: null, uniqueCode: "server_error_1" };
	}
};

export default findOne;
