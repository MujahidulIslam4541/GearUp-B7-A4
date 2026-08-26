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

}

const getSingleGearInDB = async (gearId: string) => {

}



export const gearService = { getAllGearInDB, getSingleGearInDB, createGear }