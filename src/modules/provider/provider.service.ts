import { prisma } from "../../lib";
import HttpStatus from "http-status";
import type { RentalStatus } from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../error/AppError";

const VALID_PROVIDER_TRANSITIONS: Record<string, string[]> = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PAID", "CANCELLED"],
    PAID: ["PICKED_UP", "CANCELLED"],
    PICKED_UP: ["RETURNED"],
};

const getAllOrders = async (providerId: string) => {
    const result = await prisma.rentalOrder.findMany({
        where: {
            gearItem: {
                providerId: providerId
            }
        },
        include: {
            customer: {
                select: { name: true, email: true }
            },
            gearItem: {
                select: { name: true, imageUrl: true, brand: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return result;
};

const updateOrderStatus = async (providerId: string, orderId: string, newStatus: string) => {

    const order = await prisma.rentalOrder.findUnique({
        where: { id: orderId },
        include: { gearItem: true }
    });

    if (!order) {
        throw new AppError(HttpStatus.NOT_FOUND, "rental order not found");
    }


    if (order.gearItem.providerId !== providerId) {
        throw new AppError(HttpStatus.FORBIDDEN, "you can only update orders for your own gear");
    }

    const allowedNextStatuses = VALID_PROVIDER_TRANSITIONS[order.status] || [];

    if (!allowedNextStatuses.includes(newStatus)) {
        throw new AppError(
            HttpStatus.BAD_REQUEST,
            `cannot change status from ${order.status} to ${newStatus}`
        );
    }

    const result = await prisma.rentalOrder.update({
        where: { id: orderId },
        data: { status: newStatus as RentalStatus }
    });

    if (newStatus === "RETURNED") {
        await prisma.gearItem.update({
            where: { id: order.gearItemId },
            data: { quantity: { increment: 1 } }
        });
    }

    return result;
};

export const providerService = { getAllOrders, updateOrderStatus };