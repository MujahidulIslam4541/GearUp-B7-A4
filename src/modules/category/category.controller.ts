import { catchAsync } from "../../utils/catchAsync";
import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { categoriesService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await categoriesService.createCategory(name)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "created category",
        data: result
    })

})

const getAllCategory = catchAsync(async (req, res) => {

    const result = await categoriesService.getAllCategories()

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "all categories retrieve success",
        data: result
    })
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    const result = await categoriesService.updateCategory(categoryId as string, name)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "category updated successfully",
        data: result
    })
})

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    await categoriesService.deleteCategory(categoryId as string)
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Your Category deleted success"
    })
})


export const categoryController = { createCategory, getAllCategory, updateCategory, deleteCategory }