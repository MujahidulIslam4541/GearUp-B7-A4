
import type { UserRole, UserStatus } from "../../../prisma/generated/prisma/enums";

export interface userCreateInterface {
    name: string,
    email: string,
    password: string,
    role: UserRole,
}

export interface userLoginInterface {
    email: string,
    password: string
}