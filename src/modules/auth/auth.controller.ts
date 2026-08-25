import { catchAsync } from "../../utils/catchAsync";
import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { authService } from "./auth.service";
import config from "../../config";

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

    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        sameSite: config.node_env === "production" ? "none" : "lax",
        secure: config.node_env === "production",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: config.node_env === "production" ? "none" : "lax",
        secure: config.node_env === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "user Sign In successfully",
        data: result
    })
})

const myProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId=req.user?.id;

    const result = await authService.getMyProfile(userId as string)
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "profile retrieve success",
        data: result
    })
})


export const authController = { createUser, signInUser, myProfile }