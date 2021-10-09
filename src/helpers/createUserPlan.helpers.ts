import { IUserPlan } from "../types/IUserPlan";
import createNanoId from "../utils/createNanoId";
import insertOne from "./insertOne.helpers";
import updateOne from "./updateOne.helpers";
import { getTierId } from "../utils/getTierInfo";
import { IHelperResponse } from "../types/IHelperResponse";

/**
 * Create a new row in user_plans table
 * Update the plan expiry date in users table
 */

/**
 * * Updates plan expiration date in user table
 */
const updateUserPlanDate = async (
	userId: string,
	planType: string
): Promise<IHelperResponse> => {
	const updatedUser = await updateOne(
		"users",
		{ id: userId },
		{
			tier_expires_at:
				planType === "free"
					? null
					: new Date(new Date().setMonth(new Date().getMonth() + 1)),
		}
	);

	return updatedUser;
};

const createUserPlan = async (data: IUserPlan): Promise<IHelperResponse> => {
	let tierId = getTierId(data.tierType);

	if (!tierId) {
		return {
			type: "error",
			data: null,
			uniqueCode: "invalid_tier_type",
		};
	}

	let planData = {
		id: await createNanoId(),
		user_id: data.userId,
		tier_id: tierId,
		payment_id: data.paymentId,
	};

	const userPlan = await insertOne("user_plans", planData);
	if (userPlan.type === "success") {
		const updatedUser = await updateUserPlanDate(data.userId, data.tierType);
		return updatedUser;
	} else {
		return userPlan;
	}
};

export default createUserPlan;
