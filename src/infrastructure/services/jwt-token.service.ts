import jwt from 'jsonwebtoken';

import type{
    ITokenService,
    TokenPayload,
} from "../../application/interfaces/services/token.service.js";

import { env } from '../../config/env.js';

export class JwtTokenService implements ITokenService{
    generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload,env.JWT_ACCESS_SECRET,{ 
            expiresIn:'15m'
        })
    }

    generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload,env.JWT_REFRESH_SECRET,{
            expiresIn:'7d'
        })
    }
    verifyAccessToken(token: string): TokenPayload {
        return jwt.verify(
            token,
            env.JWT_ACCESS_SECRET,
        )as TokenPayload;
    }
    verifyRefreshToken(token: string): TokenPayload {
        return jwt.verify(
            token,
            env.JWT_REFRESH_SECRET,
        )as TokenPayload
    }
}












