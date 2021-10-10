const isPlanExpired = (planCreatedDate: Date): boolean => {
	const planExpiryDate = new Date(
		new Date(planCreatedDate).setMonth(new Date(planCreatedDate).getMonth() + 1)
	);

	const presentDate = new Date();

	if (presentDate >= planExpiryDate) return true;

	return false;
};

export default isPlanExpired;
