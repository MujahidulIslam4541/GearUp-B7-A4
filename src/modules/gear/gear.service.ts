import { prisma } from "../../lib"
import type { TCreateGearInput } from "../../schemaValidation/gearValidation"

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



export const gearService = { getAllGearInDB, getGearDetailsInDB, createGear }