import type { Request,Response,NextFunction } from "express";
import { listUsersUseCase } from "../../../DI/admin.container.js";

export const adminListUsers = async(
    req:Request,
    res:Response,
    next:NextFunction,
):Promise<void>=>{
    try{
        const users = await listUsersUseCase.execute()

        const safeUsers = users.map((user)=>({
            id:user.id,
            email:user.email,
            roles:user.roles,
            staus:user.status,
            isEmailVerified:user.isEmailVerified,
            phone:user.phone,
            lastLoginAt:user.lastLoginAt,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt,
        }))

        res.status(200).json({
            message:'Users retrieved successfully',
            safeUsers,
        })
    }catch(error:unknown){
        next(error)
    }
}