import { catchAsync } from "../../utils/catchAsync";
import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { orderId } = req.params;
    const payload = req.body;

    const result = await reviewService.createReview(userId, orderId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "review created successfully",
        data: result
    });
});

const getGearReviews = catchAsync(async (req: Request, res: Response) => {
    const { gearItemId } = req.params;

    const result = await reviewService.getGearReviews(gearItemId as string);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "gear reviews retrieve success",
        data: result
    });
});

export const reviewController = { createReview, getGearReviews };