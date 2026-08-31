import { Router } from "express";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { paymentController } from "./payment.controller";
import { UserRole } from "../../../prisma/generated/prisma/enums";


const router=Router()

router.post("/create", authMiddlewares(UserRole.USER), paymentController.createPaymentSession);
router.get("/", authMiddlewares(UserRole.USER), paymentController.getMyPayments);
router.get("/:id", authMiddlewares(UserRole.USER), paymentController.getPaymentDetails);

export const paymentRoutes=router