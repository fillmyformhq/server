import db from "../config/postgresConfig";
import { IHelperResponse } from "../types/IHelperResponse";

const find = async (
	dbType: string,
	findObjectQuery: object
): Promise<IHelperResponse> => {
	try {
		const foundObjects = await db(dbType)
			.where(findObjectQuery)
			.orderBy("created_at", "desc")
			.returning("*");

		if (foundObjects) {
			return {
				type: "success",
				data: foundObjects,
				uniqueCode: "found_many_success",
			};
		} else return { type: "error", data: null, uniqueCode: "server_error_0" };
	} catch (err) {
		return { type: "error", data: null, uniqueCode: "server_error_0" };
	}
};

export default find;
