import { Router } from "express";
import checkOrigin from "../../middlewares/checkOrigin.middlewares";
import verifyToken from "../../middlewares/verifyToken.middlewares";
import { createApp, getApp } from "./apps.controllers";

const router: Router = Router();

router.post("/", [checkOrigin, verifyToken], createApp);
router.get("/", [checkOrigin, verifyToken], getApp);

export default router;
