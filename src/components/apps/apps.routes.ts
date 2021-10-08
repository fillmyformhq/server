import { Router } from "express";
import checkOrigin from "../../middlewares/checkOrigin.middlewares";
import verifyToken from "../../middlewares/verifyToken.middlewares";
import { createApp, getApp, updateApp } from "./apps.controllers";

const router: Router = Router();

router.post("/", [checkOrigin, verifyToken], createApp);
router.get("/", [checkOrigin, verifyToken], getApp);
router.patch("/", [checkOrigin, verifyToken], updateApp);

export default router;
