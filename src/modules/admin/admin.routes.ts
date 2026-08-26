import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router()

router.get('/users', authMiddlewares(UserRole.ADMIN), adminController.getAllUsers)
router.patch("/user/:id",authMiddlewares(UserRole.ADMIN), adminController.updateUserRole)

export const adminRoutes = router;