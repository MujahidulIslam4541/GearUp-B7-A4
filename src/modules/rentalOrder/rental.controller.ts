import { catchAsync } from "../../utils/catchAsync";
import type { Request, Response } from "express";
import { rentalOrderService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user?.id;
    const payload = req.body;

    const result = await rentalOrderService.createOrder(customerId as string, payload)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "order Created successfully",
        data: result
    })

})


const getOrders = catchAsync(async (req: Request, res: Response) => {

    const result = await rentalOrderService.getOrders()

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "orders retrieve successfully",
        data: result
    })

})

const getOrderDetails = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id

    const result = await rentalOrderService.getOrderDetails(orderId as string)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "order retrieve successfully",
        data: result
    })

})


export const rentalOrder = { createOrder, getOrders, getOrderDetails }