import { AppError } from "../../error/AppError";
import { prisma } from "../../lib"
import HttpStatus from "http-status";

const createCategory = async (name: string) => {
    const result = await prisma.category.create({
        data: {
            name: name
        }
    })
    return result;

}

const getAllCategories = async () => {
    const result = await prisma.category.findMany()
    return result;

}

const updateCategory = async (categoryId: string, name: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })

    if (!category) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Category not found")
    }
    const result = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: {
            name
        }
    })

    return result
}

export const categoriesService = { getAllCategories, createCategory, updateCategory }