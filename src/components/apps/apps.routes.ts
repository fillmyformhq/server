import { Router } from "express";
import checkOrigin from "../../middlewares/checkOrigin.middlewares";
import verifyToken from "../../middlewares/verifyToken.middlewares";
import { createApp, disableApp, listApps } from "./apps.controllers";

const router: Router = Router();

router.post("/", [checkOrigin, verifyToken], createApp);
router.get("/list", [checkOrigin, verifyToken], listApps);
router.patch("/:id", [checkOrigin, verifyToken], disableApp);

export default router;
