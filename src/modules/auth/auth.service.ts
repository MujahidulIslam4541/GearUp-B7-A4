import type { userCreateInterface, userLoginInterface } from "./auth.Interface"

const createdUserIntoDB = async (payload: userCreateInterface) => {

}

const signInUser=async(payload:userLoginInterface)=>{

}

export const authService = { createdUserIntoDB ,signInUser}

