import { Router } from "express";
import { categoryController } from "./category.controller";
import { categoryValidation } from "../../schemaValidation/categoryValidation";
import validateRequest from "../../middlewares/validateRequest";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router()

router.post("/", validateRequest(categoryValidation), authMiddlewares(UserRole.ADMIN), categoryController.createCategory)

export const categoryRoutes = router