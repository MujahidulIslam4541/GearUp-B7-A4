import type { Prisma } from "../../../prisma/generated/prisma/browser";
import { AppError } from "../../error/AppError";
import { prisma } from "../../lib"
import type { TCreateGearInput, TUpdateGearInput } from "../../schemaValidation/gearValidation"
import HttpStatus from "http-status";

const createGear = async (providerId: string, payload: TCreateGearInput) => {
    const create = await prisma.gearItem.create({
        data: {
            providerId,
            ...payload
        },
    })
    return create;

}


const getAllGearInDB = async (categoryId: string, brand: string, maxPrice: string, minPrice: string, search: string, page: string, limit: string) => {

    const andConditions: Prisma.GearItemWhereInput[] = []

    if (categoryId) {
        andConditions.push({
            category: {
                id: categoryId as string
            }
        })
    }

    if (brand) {
        andConditions.push({
            brand: {
                equals: brand as string,
                mode: "insensitive"
            }
        })
    }

    if (minPrice || maxPrice) {
        andConditions.push({
            price: {
                ...(minPrice && { gte: Number(minPrice) }),
                ...(maxPrice && { lte: Number(maxPrice) })
            }
        });
    }

    if (search) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ]
        });
    }

    const whereConditions: Prisma.GearItemWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // pagination calculation
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;


    const result = await prisma.gearItem.findMany({
        where: whereConditions,
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

    const total = await prisma.gearItem.count({
        where: whereConditions
    });

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            totalPage: Math.ceil(total / limitNumber)
        },
        data: result
    };

}

const getGearDetailsInDB = async (gearId: string) => {
    const result = await prisma.gearItem.findUniqueOrThrow({
        where: {
            id: gearId
        },
        include: {
            provider: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: {
                select: {
                    name: true
                }
            }
        }
    })

    return result;
}

const gearUpdate = async (gearId: string, providerId: string, payload: TUpdateGearInput) => {

    const gear = await prisma.gearItem.findUnique({
        where: {
            id: gearId
        }
    })

    if (!gear) {
        throw new AppError(HttpStatus.NOT_FOUND, "gear not found")
    }

    if (gear.providerId !== providerId) {
        throw new AppError(HttpStatus.FORBIDDEN, "your are not authorized for this gear update")
    }

    const result = await prisma.gearItem.update({
        where: { id: gearId },
        data: payload
    })

    return result;

}

const deleteGear = async (gearId: string, providerId: string) => {
    const gear = await prisma.gearItem.findUnique({
        where: {
            id: gearId
        }
    })

    if (!gear) {
        throw new AppError(HttpStatus.BAD_REQUEST, "not find gear")
    }

    if (gear.providerId !== providerId) {
        throw new AppError(HttpStatus.BAD_REQUEST, "you can't delete this gear")
    }

    const result = await prisma.gearItem.delete({
        where: {
            id: gearId
        }
    })

    return result;
}



export const gearService = { getAllGearInDB, getGearDetailsInDB, createGear, gearUpdate, deleteGear }