import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken.middlewares";
import { getUser, loginUser } from "./users.controllers";

const router: Router = Router();

router.post("/login", loginUser);
router.get("/", verifyToken, getUser);

export default router;
