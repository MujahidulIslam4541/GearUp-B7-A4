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


const getAllGearInDB = async () => {
    const result = await prisma.gearItem.findMany({
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
    })
    return result;

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



export const gearService = { getAllGearInDB, getGearDetailsInDB, createGear, gearUpdate }