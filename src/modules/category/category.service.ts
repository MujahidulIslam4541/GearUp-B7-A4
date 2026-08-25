import { prisma } from "../../lib"

const createCategory = async (name: string) => {
    const result = await prisma.category.create({
        data: {
            name: name
        }
    })
    return result;

}

const getAllCategories = async () => {

}

export const categoriesService = { getAllCategories, createCategory }