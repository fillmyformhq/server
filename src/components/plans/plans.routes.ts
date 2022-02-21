import { Router } from "express";
import checkOrigin from "../../middlewares/checkOrigin.middlewares";
import verifyToken from "../../middlewares/verifyToken.middlewares";
import { updatePlan, getUserPlanInfo } from "./plans.controllers";

const router: Router = Router();

router.patch("/:tierType", [checkOrigin, verifyToken], updatePlan);
router.get("/", [checkOrigin, verifyToken], getUserPlanInfo);

// get current plan

export default router;
