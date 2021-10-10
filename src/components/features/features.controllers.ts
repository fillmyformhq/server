import { Request, Response, NextFunction } from "express";
// import findOne from "../../helpers/findOne.helpers";
// import insertOne from "../../helpers/insertOne.helpers";
// import { IHelperResponse } from "../../types/IHelperResponse";
// import { IResponse } from "../../types/IResponse";
// import createNanoId from "../../utils/createNanoId";
// import renameObjectKeys from "../../utils/objectKeysRenamer";
// import responseHandler from "../../utils/responseHandler";

const generateCsv = async (req: Request, res: Response, next: NextFunction) => {
	const userPlanDetails = res.locals.userPlan;
	console.log(userPlanDetails);
};

export { generateCsv };
