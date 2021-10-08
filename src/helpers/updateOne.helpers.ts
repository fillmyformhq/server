import db from "../config/postgresConfig";

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

		if (!updatedObject) return { type: "error", data: null };

		return { type: "success", data: updatedObject };
	} catch (err) {
		return { type: "error", data: null };
	}
};

export default updateOne;
