import db from "../db/config";

const updateOne = async (
	dbType: string,
	conditionObject: object,
	toUpdateObject: object
) => {
	try {
		const [updatedObject] = await db(dbType)
			.update(toUpdateObject)
			.where(conditionObject)
			.returning("*");

		if (!updatedObject) return { type: "error" };

		return { type: "success", data: updatedObject };
	} catch (err) {
		return { type: "error" };
	}
};

export default updateOne;
