import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { IPasswordService } from "../../interfaces/services/password.service.js";
import type { ResetPasswordDTO } from "../../dto/auth/reset-password.dto.js";
import { hashResetToken } from "../../../shared/utils/hash-reset-token.js";

export class ResetPasswordUseCase{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly passwordService:IPasswordService,
    ){}

    async execute(input:ResetPasswordDTO):Promise<void>{
        const tokenHash = hashResetToken(input.token);

        const user = await this.userRepository.findByPasswordResetTokenHash(tokenHash);

        if(!user || !user.passwordResetExpiresAt){
            throw new AppError(HttpStatus.BAD_REQUEST,'Invalid or expired reset token')
        }

        if(user.passwordResetExpiresAt.getTime()<=Date.now()){
            throw new AppError(HttpStatus.BAD_REQUEST,'Invalid or expired reset token');
        }

        user.passwordHash = await this.passwordService.hash(input.newPassword);

        user.passwordResetTokenHash = undefined;
        user.passwordResetExpiresAt = undefined;
        user.updatedAt = new Date();

        await this.userRepository.update(user);
    }
}
