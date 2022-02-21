import { Router } from "express";
import checkUserPlan from "../../middlewares/checkUserPlan.middlewares";
import verifyToken from "../../middlewares/verifyToken.middlewares";
import { generateCsv } from "./features.controllers";

const router: Router = Router();

router.post("/", [verifyToken, checkUserPlan(null)], generateCsv);

export default router;
