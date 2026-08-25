import type { UserRole } from "../../../prisma/generated/prisma/enums";
import config from "../../config";
import { AppError } from "../../error/AppError";
import { prisma } from "../../lib";
import type { userCreateInterface, userLoginInterface } from "./auth.Interface"
import bcrypt from "bcrypt"
import HttpStatus from "http-status"

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

}

const getMyProfile = async (userId: string) => {

}

export const authService = { createdUserIntoDB, signInUser, getMyProfile }

