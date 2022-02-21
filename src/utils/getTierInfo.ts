import tiers from "./tiers";

interface ITierDetails {
	type: string;
	id: string;
	responsesPerHour: number;
	responsesPerMonth: number;
	price: number;
	isCsvAllowed: boolean;
	isEmailAllowed: boolean;
}

const getTierId = (tierType: string): string | undefined => {
	const selectedTier = tiers.find((tier) => tier.type === tierType)?.id;
	return selectedTier;
};

const getTierType = (tierId: string): string | undefined => {
	const selectedTier = tiers.find((tier) => tier.id === tierId)?.type;
	return selectedTier;
};

const getTierDetails = (tierIdOrType: string): ITierDetails | undefined => {
	const selectedTier = tiers.find(
		(tier) => tier.id === tierIdOrType || tier.type === tierIdOrType
	);
	return selectedTier;
};

export { getTierId, getTierType, getTierDetails };
