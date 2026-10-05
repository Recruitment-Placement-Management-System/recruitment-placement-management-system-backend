import { AppError } from "../../shared/errors/app-error.js";
import type { Request,Response,NextFunction } from "express";
import {tokenService} from '../../DI/container.js';

export const authenticate = (
    req:Request,
    _res:Response,
    next:NextFunction,
):void=>{
    try{
        const authorization = req.headers.authorization;

        if(!authorization){
            throw new AppError(401,'Access token is required');
        }

        const [scheme,token] = authorization.split(" ");

        if(scheme !== "Bearer" || !token){
            throw new AppError(401,'Invalid authorization header');
        }

        const payload = tokenService.verifyAccessToken(token);

        req.user = {
            userId:payload.userId,
            roles:payload.roles,
        }

        next();
    }catch(error:unknown){
        next(error)
    }
}