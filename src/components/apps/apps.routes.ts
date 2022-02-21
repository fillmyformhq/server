import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken.middlewares";
import { createApp, getApp } from "./apps.controllers";

const router: Router = Router();

router.post("/", [verifyToken], createApp);
router.get("/", [verifyToken], getApp);

export default router;
