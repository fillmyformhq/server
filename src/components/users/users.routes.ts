import { Router } from "express";
import checkOrigin from "../../middlewares/checkOrigin.middlewares";
import { getUser, loginUser } from "./users.controllers";

const router: Router = Router();

router.post("/login", checkOrigin, loginUser);
router.get("/", checkOrigin, getUser);

export default router;
