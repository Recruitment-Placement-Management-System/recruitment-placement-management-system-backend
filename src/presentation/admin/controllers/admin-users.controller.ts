import type { Request,Response,NextFunction } from "express";
import { listUsersUseCase } from "../../../DI/admin.container.js";

export const adminListUsers = async(
    req:Request,
    res:Response,
    next:NextFunction,
):Promise<void>=>{
    try{
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        

        const result = await listUsersUseCase.execute({
            page,
            limit,
        });

        const safeUsers = result.users.map((user)=>({
            id: user.id,
            fullName:user.fullName, 
      email: user.email,
      roles: user.roles,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      phone: user.phone,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
        }))

        res.status(200).json({
            message:'Users retrieved successfully',
            users:safeUsers,
            pagination:{
                total:result.total,
                page:result.page,
                limit:result.limit,
                pages:result.pages,
            },
        });
    }catch(error:unknown){
        next(error)
    }
}