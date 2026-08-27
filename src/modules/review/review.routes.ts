import { Router } from "express";
import { reviewController } from "./review.controller";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post(
    "/rentals/:orderId/reviews",
    authMiddlewares(UserRole.USER),
    reviewController.createReview
);

router.get(
    "/gear/:gearItemId/reviews",
    reviewController.getGearReviews
);


export const reviewRoutes = router;