import { UserStatus } from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../error/AppError";
import { prisma } from "../../lib"
import HttpStatus from "http-status";

const getAllUsers = async (page: string, limit: string) => {

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const result = await prisma.user.findMany({
        omit: {
            password: true
        },
        skip,
        take: limitNumber
    });

    const total = await prisma.user.count();

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            totalPage: Math.ceil(total / limitNumber)
        },
        data: result
    };
}

const updateUserRole = async (userId: string, status: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) {
        throw new AppError(HttpStatus.OK, "user not found")
    }

    const result = await prisma.user.update({
        where: { id: userId },
        data: { status: status as UserStatus },
        omit: {
            password: true
        }
    });

    return result;

}

const getAllGearForAdmin = async (page: string, limit: string) => {

    // pagination calculation
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const result = await prisma.gearItem.findMany({
        skip,
        take: limitNumber,
        include: {
            provider: {
                select: {
                    name: true,
                    email: true
                },
            },
            category: {
                select: {
                    name: true
                }
            }
        }
    });

    const total = await prisma.gearItem.count();

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            totalPage: Math.ceil(total / limitNumber)
        },
        data: result
    };

}

const getOrdersForAdmin = async (page: string, limit: string) => {

    // pagination calculation
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;


    const order = await prisma.rentalOrder.findMany({
        skip,
        take: limitNumber,
        include: {
            gearItem: {
                select: {
                    name: true, imageUrl: true, brand: true
                }
            },
            customer: {
                select: {
                    name: true, email: true
                }
            }
        }
    })

    const total = await prisma.rentalOrder.count()

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            totalPage: Math.ceil(total / limitNumber)
        },
        data: order
    };
}

export const adminService = { getAllUsers, updateUserRole, getAllGearForAdmin, getOrdersForAdmin }