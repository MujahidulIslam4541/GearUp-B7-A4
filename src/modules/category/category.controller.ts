import { catchAsync } from "../../utils/catchAsync";
import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { categoriesService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {

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


export const categoryController = { createCategory ,getAllCategory}