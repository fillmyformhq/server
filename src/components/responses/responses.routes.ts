import { Router } from "express";
import checkOrigin from "../../middlewares/checkOrigin.middlewares";
import verifyToken from "../../middlewares/verifyToken.middlewares";
import {
	getResponse,
	listResponses,
	saveResponse,
} from "./responses.controllers";

const router: Router = Router();

router.post("/:appId", saveResponse); //save response
router.get("/:appId/list", [checkOrigin, verifyToken], listResponses); // list responses
router.get("/:id", [checkOrigin, verifyToken], getResponse); //get a response

export default router;
