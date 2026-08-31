import { catchAsync } from "../../utils/catchAsync";
import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { providerService } from "./provider.service";

const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;

    const result = await providerService.getAllOrders(providerId);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "retrieve all orders",
        data: result
    });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;
    const { id } = req.params;
    const { status } = req.body;

    const result = await providerService.updateOrderStatus(providerId, id as string, status?.toUpperCase());

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "order status updated",
        data: result
    });
});

export const providerController = { getAllOrders, updateOrderStatus };