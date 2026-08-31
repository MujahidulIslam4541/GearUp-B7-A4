import { Router } from "express";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { providerController } from "./provider.controller";

const router = Router();

router.get("/orders", authMiddlewares(UserRole.PROVIDER), providerController.getAllOrders);
router.patch("/orders/:id", authMiddlewares(UserRole.PROVIDER), providerController.updateOrderStatus);

export const providerRoutes = router; 