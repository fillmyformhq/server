import tiers from "./tiers.json";

const getTierId = (tierType: string) => {
	const selectedTier = tiers.find((tier) => tier.type === tierType)?.id;
	return selectedTier;
};

export default getTierId;
