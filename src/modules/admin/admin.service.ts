import {  UserStatus } from "../../../prisma/generated/prisma/enums";
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

export const adminService = { getAllUsers, updateUserRole }