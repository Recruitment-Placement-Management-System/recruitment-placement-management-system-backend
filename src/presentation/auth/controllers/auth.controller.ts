import type { NextFunction,Request,Response } from "express";
import { registerCandidateUseCase } from "../../../DI/container.js";
import {verifyEmailUseCase} from '../../../DI/container.js'
import {resendVerificationEmailUseCase} from '../../../DI/container.js'
import {registerRecruiterUseCase} from '../../../DI/container.js'
import { loginUseCase,authCookieService } from "../../../DI/container.js";

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


export const verifyEmail = async(
    req:Request,
    res:Response,
    next:NextFunction,
):Promise<void>=>{
    try{
        await verifyEmailUseCase.execute(req.body)

        res.status(200).json({
            message:'Email verified successfully',
        })
    }catch(error){
        next(error)
    }
}


export const  resendVerificatioEmail = async(
    req:Request,
    res:Response,
    next:NextFunction,
):Promise<void>=>{
    try{
        await resendVerificationEmailUseCase.execute(req.body)

        res.status(200).json({
            message:'"If the account requires email verification, a verification email has been sent.',
        });
    }catch(error){
        next(error)
    }
}


export const registerRecruiter = async(
    req:Request,
    res:Response,
    next:NextFunction,
):Promise<void>=>{
    try{
        const recruiter = await registerRecruiterUseCase.execute(req.body);

        res.status(201).json({
            message:'Recruiter registered successfully. Please verify your email',
            userId:recruiter.id,
        });
    }catch(error:unknown){
        next(error)
    }
}


export const login = async(
    req:Request,
    res:Response,
    next:NextFunction,
):Promise<void>=>{
    try{
        const result = await loginUseCase.execute(req.body);

        authCookieService.setRefreshTokenCookie(res,result.refreshToken);

        res.status(200).json({
            message:'Login successful',
            accessToken:result.accessToken,
            user:result.user,
        })
    }catch(error:unknown){
        next(error)
    }
}