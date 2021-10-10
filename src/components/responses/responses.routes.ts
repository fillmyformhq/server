import { Router } from "express";
import checkOrigin from "../../middlewares/checkOrigin.middlewares";
import ipRequestLimiter from "../../middlewares/ipRequestLimiter.middlewares";
import verifyToken from "../../middlewares/verifyToken.middlewares";
import {
	listAllResponses,
	saveResponse,
} from "./responses.controllers";

const router: Router = Router();

// make a response number limiter
router.post("/:appId", ipRequestLimiter(60, 3), saveResponse); //save response
router.get("/list", [checkOrigin, verifyToken], listAllResponses); // list responses

export default router;
