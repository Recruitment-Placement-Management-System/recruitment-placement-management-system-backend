import { AppError } from "../../application/errors/app-error.js";
import type { Request,Response,NextFunction } from "express";
import type { ITokenService } from "../../application/interfaces/services/token.service.js";

export const createAuthenticate = (tokenService: ITokenService) => (
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
