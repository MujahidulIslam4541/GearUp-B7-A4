import { Router } from "express";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { rentalOrder } from "./rental.controller";

const router = Router()

router.post("/", authMiddlewares(UserRole.USER), rentalOrder.createOrder)
router.get("/", authMiddlewares(UserRole.USER), rentalOrder.getOrders)
router.get("/:id", authMiddlewares(UserRole.USER), rentalOrder.getOrderDetails)

export const orderRoutes = router