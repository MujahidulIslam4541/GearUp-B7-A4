
import type { UserRole } from "../../../prisma/generated/prisma/enums";


export type CreateUserRole = Exclude<UserRole, "ADMIN">;
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