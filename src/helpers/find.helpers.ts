import db from "../db/config";

const find = async (dbType: string, findObjectQuery: object) => {
	try {
		const foundObjects = await db(dbType)
			.where(findObjectQuery)
			.orderBy("created_at", "desc")
			.returning("*");
		if (foundObjects) return { type: "success", data: foundObjects };
		else return { type: "error" };
	} catch (err) {
		return { type: "error" };
	}
};

export default find;
