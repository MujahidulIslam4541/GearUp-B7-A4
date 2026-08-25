import { Router } from "express";
import { authController } from "./auth.controller";
import { createUserValidationSchema } from "../../schemaValidation/authValidation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router()

router.post("/register", validateRequest(createUserValidationSchema), authController.createUser)
router.post("/login",  authController.signInUser)
router.get("/me", authController.myProfile)

export const authRoutes = router;