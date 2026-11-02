import { randomBytes } from "node:crypto";

import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { IEmailService } from "../../interfaces/services/email.service.js";
import type { ForgotPasswordDTO } from "../../dto/auth/forgot-password.dto.js";
import { hashResetToken } from "../../../shared/utils/hash-reset-token.js";

export class ForgotPasswordUseCase{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly emailService:IEmailService,
    ){}

    async execute(input:ForgotPasswordDTO):Promise<void>{
        const user = await this.userRepository.findByEmail(input.email);

        if(!user)return;

        const resetToken = randomBytes(32).toString('hex');

        user.passwordResetTokenHash = await hashResetToken(resetToken)
        user.passwordResetExpiresAt = new Date(Date.now()+15*60*1000);
        user.updatedAt = new Date();

        await this.userRepository.update(user);

        await this.emailService.sendPasswordResetEmail(user.email,resetToken)
    }
}