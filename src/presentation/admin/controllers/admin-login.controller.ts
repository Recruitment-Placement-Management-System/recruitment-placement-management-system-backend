import { AppError } from "../../../shared/errors/app-error.js";
import type { Request,Response,NextFunction } from "express";
import  { loginUseCase } from "../../../DI/container.js";
import { authCookieService } from "../../../DI/container.js";
export const adminLogin = async(
    req:Request,
    res:Response,
    next:NextFunction,
):Promise<void>=>{
    try{
        const result = await loginUseCase.execute(req.body);

        if(!result.user.roles.includes('admin')){
            throw new AppError(403,'Admin access required')
        }

        authCookieService.setRefreshTokenCookie(
            res,
            result.refreshToken
        );

        res.status(200).json({
            message:'Admin login successful',
            accessToken:result.accessToken,
            user:result.user,
        })
    }catch(error:unknown){
        next(error)
    }
}