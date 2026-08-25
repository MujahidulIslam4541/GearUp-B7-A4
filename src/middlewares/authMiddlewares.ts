import jwt, { type JwtPayload } from "jsonwebtoken";
import { AppError } from "../error/AppError";
import { catchAsync } from "../utils/catchAsync"
import type { Request, Response, NextFunction } from "express"
import HttpStatus from "http-status";
import config from "../config";
import type { UserRole } from "../../prisma/generated/prisma/enums";
import { sendResponse } from "../utils/sendResponse";
import { prisma } from "../lib";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                email: string,
                role: string
            }
        }
    }
}

export const authMiddlewares = (...RequiredRole: UserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw new AppError(HttpStatus.BAD_REQUEST, "your are not logged in please login and access this resource")
        }

        const verifyToken = jwt.verify(accessToken, config.jwt_access_token_secret)

        if (!verifyToken) {
            throw new AppError(HttpStatus.BAD_REQUEST, "please provide a valid credential")
        }

        const { email, id, role } = verifyToken as JwtPayload;

        if (RequiredRole.length && !RequiredRole.includes(role)) {
            throw new AppError(HttpStatus.FORBIDDEN, "You don't have permission to access this resource");
        }

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            throw new AppError(HttpStatus.UNAUTHORIZED, "This user no longer exists");
        }

        if (user?.status === "SUSPENDED") {
            throw new AppError(HttpStatus.FORBIDDEN, "Your account is not active please contact our support")
        }

        req.user = {
            id,
            email,
            role
        }

        next()

    })

}