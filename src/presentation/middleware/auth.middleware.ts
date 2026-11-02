import { AppError } from "../../application/errors/app-error.js";
import type { Request,Response,NextFunction } from "express";
import type { ITokenService } from "../../application/interfaces/services/token.service.js";
import { HttpStatus } from "../../shared/constants/http-status.js";

export const createAuthenticate = (tokenService: ITokenService) => (
    req:Request,
    _res:Response,
    next:NextFunction,
):void=>{
    try{
        const authorization = req.headers.authorization;

        if(!authorization){
            throw new AppError(HttpStatus.UNAUTHORIZED,'Access token is required');
        }

        const [scheme,token] = authorization.split(" ");

        if(scheme !== "Bearer" || !token){
            throw new AppError(HttpStatus.UNAUTHORIZED,'Invalid authorization header');
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
