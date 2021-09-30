import db from "../db/config";

const insertOne = async (dbType: string, objectToInsert: object) => {
	try {
		const [insertedObj] = await db(dbType)
			.insert(objectToInsert)
			.returning("*");

		if (!insertedObj) return { type: "errror", data: null };
		return { type: "success", data: insertedObj };
	} catch (err) {
		return { type: "error", data: null };
	}
};

export default insertOne;
