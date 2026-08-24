import { catchAsync } from "../../utils/catchAsync";
import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { authService } from "./auth.service";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await authService.createdUserIntoDB(payload)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "user registration successfully",
        data: result
    })
})

const signInUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await authService.signInUser(payload)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "user Sign In successfully",
        data: result
    })
})


export const authController = { createUser, signInUser }