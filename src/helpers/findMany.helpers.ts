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
			return { type: "success", data: foundObjects };
		} else return { type: "error", data: null };
	} catch (err) {
		return { type: "error", data: null };
	}
};

export default find;
