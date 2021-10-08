import db from "../config/postgresConfig";
import { IHelperResponse } from "../types/IHelperResponse";

const updateOne = async (
	dbType: string,
	conditionObject: object,
	toUpdateObject: object
): Promise<IHelperResponse> => {
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
