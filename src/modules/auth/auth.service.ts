import type { UserRole } from "../../../prisma/generated/prisma/enums";
import config from "../../config";
import { AppError } from "../../error/AppError";
import { prisma } from "../../lib";
import type { userCreateInterface, userLoginInterface } from "./auth.Interface"
import bcrypt from "bcrypt"
import HttpStatus from "http-status"
import jwt, { type SignOptions } from "jsonwebtoken"

const createdUserIntoDB = async (payload: userCreateInterface) => {
    const { name, email, password, role } = payload;

    const isExisting = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isExisting) {
        throw new AppError(HttpStatus.BAD_REQUEST, "User already exist.please login now")
    }


    const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    const createdUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashPassword,
            role: role.toUpperCase() as UserRole,
        }, omit: {
            password: true
        }
    })

    return createdUser;


}

const signInUser = async (payload: userLoginInterface) => {
    const { email, password } = payload;
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }
    })

    if (user.status !== "ACTIVE") {
        throw new AppError(HttpStatus.BAD_REQUEST, "your status ic inactive please contact us our support and active er user")
    }

    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) {
        throw new AppError(HttpStatus.BAD_REQUEST, "your credential don't match please provide a valid credential")
    }

    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role
    }

    const accessToken = jwt.sign((jwtPayload), config.jwt_access_token_secret, {
        expiresIn: config.jwt_access_token_expiredIn
    } as SignOptions)

    const refreshToken = jwt.sign((jwtPayload), config.jwt_refresh_token_secret, {
        expiresIn: config.jwt_refresh_token_expiredIn
    } as SignOptions)

    return {
        accessToken,
        refreshToken
    }

}

const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        omit:{
            password:true
        }
    })

    if (!user) {
        throw new AppError(HttpStatus.BAD_REQUEST, "user not found please provide valid credential")
    }

    return user;

}

export const authService = { createdUserIntoDB, signInUser, getMyProfile }

