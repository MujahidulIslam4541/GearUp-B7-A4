import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router()

router.get('/', authMiddlewares(UserRole.ADMIN), adminController.getAllUsers)

export const adminRoutes = router;