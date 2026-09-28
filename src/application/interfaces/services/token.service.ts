export interface TokenPayload{
    userId:string;
    roles:string[];
}

export interface ITokenService{
    generateAccessToken(payload:TokenPayload):string;

    genereateRefreshToken(payload:TokenPayload):string;

    verifyAccessToken(token:string):TokenPayload;

    verifyRefreshToken(token:string):TokenPayload;
}