import { AppError } from "../../error/AppError";
import { prisma } from "../../lib";
import HttpStatus from "http-status";

const createReview = async (userId: string, orderId: string, payload: { rating: number; comment: string }) => {
    const order = await prisma.rentalOrder.findUnique({
        where: { id: orderId },
        include: { review: true }
    });

    if (!order) {
        throw new AppError(HttpStatus.NOT_FOUND, "rental order not found");
    }

    if (order.customerId !== userId) {
        throw new AppError(HttpStatus.FORBIDDEN, "you can only review your own orders");
    }

    if (order.status !== "RETURNED") {
        throw new AppError(HttpStatus.BAD_REQUEST, "you can only review after the gear is returned");
    }

    if (order.review) {
        throw new AppError(HttpStatus.BAD_REQUEST, "you have already reviewed this order");
    }

    const result = await prisma.review.create({
        data: {
            rating: payload.rating,
            comment: payload.comment,
            userId,
            gearItemId: order.gearItemId,
            rentalOrderId: order.id
        }
    });

    return result;
};

const getGearReviews = async (gearItemId: string) => {
    const result = await prisma.review.findMany({
        where: { gearItemId },
        include: {
            user: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    return result;
};

export const reviewService = { createReview, getGearReviews };