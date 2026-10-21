import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";
import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { IPasswordService } from "../../interfaces/services/password.service.js";
import type { ITokenService } from "../../interfaces/services/token.service.js";
import type { LogoutDTO } from "../../dto/auth/logout.dto.js";

export class LogoutUseCase{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly passwordService:IPasswordService,
        private readonly tokenService:ITokenService,
    ){}

    async execute(input:LogoutDTO):Promise<void>{
        const payload = this.tokenService.verifyRefreshToken(input.refreshToken);
        
        const user = await this.userRepository.findById(payload.userId);

        if(!user || !user.refreshTokenHash){
            throw new AppError(HttpStatus.UNAUTHORIZED,'Invalid refresh token')
        }

        const isValid = await this.passwordService.compare(input.refreshToken,user.refreshTokenHash);

        if(!isValid){
            throw new AppError(HttpStatus.UNAUTHORIZED,'Invalid refresh token')
        }

        user.refreshTokenHash = undefined;
        user.updatedAt = new Date();

        await this.userRepository.update(user);
    }
}
