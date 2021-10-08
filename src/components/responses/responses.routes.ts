import { Router } from "express";
import checkOrigin from "../../middlewares/checkOrigin.middlewares";
import verifyToken from "../../middlewares/verifyToken.middlewares";
import {
	getResponse,
	listAllResponses,
	saveResponse,
} from "./responses.controllers";

const router: Router = Router();

router.post("/:appId", saveResponse); //save response
router.get("/list/all", [checkOrigin, verifyToken], listAllResponses); // list responses
router.get("/:id", [checkOrigin, verifyToken], getResponse); //get a response

export default router;
