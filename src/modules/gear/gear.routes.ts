import { Router } from "express";
import { gearController } from "./gear.controller";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { createGearValidation } from "../../schemaValidation/gearValidation";

const router = Router()

router.post("/create", validateRequest(createGearValidation), authMiddlewares(UserRole.PROVIDER), gearController.createGear)

router.get("/", gearController.getAllGear)
router.get("/:id", gearController.getGearDetails)

export const gearRoutes = router;