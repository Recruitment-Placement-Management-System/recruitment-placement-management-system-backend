import type {Response} from 'express';
import type { IAuthCookieService } from '../../application/interfaces/services/auth-cookie.service.js';
import { env } from '../../config/env.js';

export class ExpressAuthCookieService implements IAuthCookieService{
    setRefreshTokenCookie(res: Response, refreshToken: string): void {
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:env.NODE_ENV === 'production',
            sameSite:'lax',
            maxAge:7*24*60*60*1000,
            path:'/api/auth',
        })
    }

    clearRefreshTokenCookie(res: Response): void {
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:env.NODE_ENV === 'production',
            sameSite:'lax',
            path:'/api/auth'
        })
    }
}