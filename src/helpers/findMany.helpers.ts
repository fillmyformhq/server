import db from "../db/config";

const find = async (dbType: string, findObjectQuery: object) => {
	try {
		const foundObjects = await db(dbType)
			.where(findObjectQuery)
			.orderBy("created_at", "desc")
			.returning("*");
			
		if (foundObjects) {
			if (foundObjects.length === 0) {
				return { type: "error", data: "no_objects" };
			} else return { type: "success", data: foundObjects };
		} else return { type: "error", data: null };
	} catch (err) {
		return { type: "error", data: null };
	}
};

export default find;
