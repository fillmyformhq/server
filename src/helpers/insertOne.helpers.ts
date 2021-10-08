import db from "../db/config";

const insertOne = async (dbType: string, objectToInsert: object) => {
	try {
		const [insertedObj] = await db(dbType)
			.insert(objectToInsert)
			.returning("*");

		if (!insertedObj) return { type: "error", data: null };
		return { type: "success", data: insertedObj };
	} catch (err) {
		console.log(err);
		return { type: "error", data: null };
	}
};

export default insertOne;
