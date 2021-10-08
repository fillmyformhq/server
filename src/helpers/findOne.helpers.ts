import db from "../config/postgresConfig";

const findOne = async (dbType: string, findObjectQuery: object) => {
	try {
		const foundObjects = await db(dbType)
			.where(findObjectQuery)
			.orderBy("created_at", "desc")
			.returning("*");

		if (foundObjects) {
			if (foundObjects.length === 1) {
				return { type: "success", data: foundObjects[0] };
			} else if (foundObjects.length === 0) {
				return { type: "success", data: null };
			} else {
				return { type: "error", data: null };
			}
		} else return { type: "error", data: null };
	} catch (err) {
		return { type: "error", data: null };
	}
};

export default findOne;
