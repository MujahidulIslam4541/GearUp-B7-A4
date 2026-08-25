import { Router } from "express";
import { authController } from "./auth.controller";
import { createUserValidationSchema, loginValidationSchema } from "../../schemaValidation/authValidation";
import validateRequest from "../../middlewares/validateRequest";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router()

router.post("/register", validateRequest(createUserValidationSchema), authController.createUser)
router.post("/login", validateRequest(loginValidationSchema), authController.signInUser)
router.get("/me", authMiddlewares(UserRole.USER), authController.myProfile)

export const authRoutes = router;