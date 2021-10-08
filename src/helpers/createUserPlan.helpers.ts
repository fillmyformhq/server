import { IUserPlan } from "../types/IUserPlan";
import createNanoId from "../utils/createNanoId";
import insertOne from "./insertOne.helpers";
import tiers from "../utils/tiers.json";
import updateOne from "./updateOne.helpers";

/**
 * * Updates plan expiration date in user table
 */
const updateUserPlanDate = async (userId: string, planType: string) => {
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

const createUserPlan = async (data: IUserPlan) => {
	const tierType: string = tiers.filter((i) => i.type === data.tier_type)[0].id;

	let planData = {
		user_id: data.user_id,
		id: await createNanoId(),
		tier_id: tierType,
		payment_id: data.payment_id,
	};

	const userPlan = await insertOne("user_plans", planData);
	if (userPlan.type === "success") {
		const updatedUser = await updateUserPlanDate(data.user_id, data.tier_type);
		return updatedUser;
	} else {
		return userPlan;
	}
};

export default createUserPlan;
