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

		if (!updatedObject)
			return { type: "error", data: null, uniqueCode: "server_error_0" };

		return {
			type: "success",
			data: updatedObject,
			uniqueCode: "update_success",
		};
	} catch (err) {
		return { type: "error", data: null, uniqueCode: "server_error_1" };
	}
};

export default updateOne;
