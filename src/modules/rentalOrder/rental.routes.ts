import { Router } from "express";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { rentalOrder } from "./rental.controller";
import validateRequest from "../../middlewares/validateRequest";
import { orderValidation } from "../../schemaValidation/orderValidation";

const router = Router()

router.post("/", validateRequest(orderValidation), authMiddlewares(UserRole.USER), rentalOrder.createOrder)

router.get("/", authMiddlewares(UserRole.USER), rentalOrder.getOrders)
router.get("/:id", authMiddlewares(UserRole.USER), rentalOrder.getOrderDetails)

export const orderRoutes = router