import { catchAsync } from "../../utils/catchAsync";
import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const {limit,page}=req.query;

    const result = await adminService.getAllUsers(limit as string,page as string)


    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "get all users retrieve success",
        data: result.data,
        metaData:result.meta
    })

})

export const adminController = { getAllUsers }