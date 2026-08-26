import { catchAsync } from "../../utils/catchAsync";
import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { gearService } from "./gear.service";


const createGear = catchAsync(async (req: Request, res: Response) => {
    const providerId = req.user?.id;
    const payload = req.body;

    const result = await gearService.createGear(providerId as string, payload)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "Created your gear",
        data: result
    })
})


const getAllGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await gearService.getAllGearInDB()

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "all gear retrieve success",
        data: result
    })

})

const getGearDetails = catchAsync(async (req: Request, res: Response) => {
    const gearId = req.params.id;

    const result = await gearService.getGearDetailsInDB(gearId as string)
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "specific gear retrieve success",
        data: result
    })
})


export const gearController = { getAllGear, getGearDetails ,createGear}