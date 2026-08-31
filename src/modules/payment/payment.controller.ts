import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import HttpStatus from "http-status";
import type { Request, Response, NextFunction } from "express";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;
    const { orderId } = req.body;

    const result = await paymentService.createPaymentSession(customerId, orderId);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "payment session created",
        data: result
    });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;

    const result = await paymentService.confirmPayment(req.body, signature);

    res.status(HttpStatus.OK).json(result);
});


export const paymentController = { createPaymentSession, confirmPayment }