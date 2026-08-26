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

const gearUpdate = catchAsync(async (req: Request, res: Response) => {
    const gearId = req.params.id;
    const providerId = req.user?.id;
    const payload = req.body;

    const result = await gearService.gearUpdate(gearId as string, providerId as string, payload)


    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "your gear updated success",
        data: result
    })
})

const deleteGear = catchAsync(async (req: Request, res: Response) => {
    const gearId = req.params.id;
    const providerId = req.user?.id;

    await gearService.deleteGear(gearId as string, providerId as string)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "your gear deleted successfully"
    })
})


export const gearController = { getAllGear, getGearDetails, createGear, gearUpdate ,deleteGear}