import { Router } from "express";
import { categoryController } from "./category.controller";
import { categoryValidation } from "../../schemaValidation/categoryValidation";
import validateRequest from "../../middlewares/validateRequest";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router()

router.post("/", authMiddlewares(UserRole.ADMIN), validateRequest(categoryValidation), categoryController.createCategory)

router.get('/', categoryController.getAllCategory)

router.put("/:id", authMiddlewares(UserRole.ADMIN), categoryController.updateCategory)

export const categoryRoutes = router