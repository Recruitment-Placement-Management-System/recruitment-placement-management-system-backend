import type { Response } from "express";

export interface IAuthCookieService{
    setRefreshTokenCookie(res:Response,refreshToken:string,):void;

    clearRefreshTokenCookie(res:Response):void;
}