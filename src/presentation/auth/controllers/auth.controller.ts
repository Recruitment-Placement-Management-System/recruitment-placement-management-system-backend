import type { NextFunction,Request,Response } from "express";
import { registerCandidateUseCase } from "../../../DI/container.js";

export const registerCandidate = async(
    req:Request,
    res:Response,
    next:NextFunction,
):Promise<void>=>{
    try{
        const user = await registerCandidateUseCase.execute(req.body)

        res.status(201).json({
            message:'Registration successful. Please verify your email.',
            user:{
                id:user.id,
                email:user.email,
                roles:user.roles,
                status:user.status,
                isEmailVerified:user.isEmailVerified,
                phone:user.phone,
                createdAt:user.createdAt,
            },
        })
    }catch(error:unknown){
        next(error)
    }
}