import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()

router.post("/register", authController.createUser)
router.post("/login", authController.signInUser)
router.get("/me", authController.myProfile)

export const authRoutes = router;