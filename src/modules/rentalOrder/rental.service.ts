import { AppError } from "../../error/AppError";
import { prisma } from "../../lib";
import type { TOrderValidation } from "../../schemaValidation/orderValidation"
import HttpStatus from "http-status"

const createOrder = async (customerId: string, payload: TOrderValidation) => {
    const { gearItemId, rentalDate, returnDate } = payload;

    const gear = await prisma.gearItem.findUnique({
        where: {
            id: gearItemId
        }
    })

    if (!gear) {
        throw new AppError(HttpStatus.NOT_FOUND, "gear not found")
    }

    if (gear.quantity <= 0) {
        throw new AppError(HttpStatus.BAD_REQUEST, "gear not available")
    }

    const startDate = new Date(rentalDate)
    const endDate = new Date(returnDate)

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    if (days <= 0) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Return date must be after rental date");
    }

    const totalAmount = days * Number(gear.price)


    const result = await prisma.rentalOrder.create({
        data: {
            rentalDate: startDate,
            returnDate: endDate,
            totalAmount,
            customerId,
            gearItemId: gear.id
        }
    });

    return result;


}

const getOrders = async () => {

}

const getOrderDetails = async (orderId: string) => {

}

export const rentalOrderService = { createOrder, getOrders, getOrderDetails }