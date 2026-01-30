import express, { Router } from "express";
import authController from "../../controller/api/auth.controller";

const router: Router = express.Router();

router.get("/login", authController.login);
router.post("/signup", authController.signup);

export default router;
