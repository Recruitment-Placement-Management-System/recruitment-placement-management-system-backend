import { AppError } from "../../../shared/errors/app-error.js";

import type { VerifyEmailDTO } from "../../dto/auth/verify-email.dto.js";
import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { IPasswordService } from "../../interfaces/services/password.service.js";


export class VerifyEmailUseCase{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly passwordService:IPasswordService,
    ){}

    async execute(
        input:VerifyEmailDTO,
    ):Promise<void>{
        const user = await this.userRepository.findByEmail(input.email)

        if(!user){
            throw new AppError(
                404,
                'User not found',
                'USER_NOT_FOUND',
            )
        }

        if(user.isEmailVerified){
            throw new AppError(
                400,
                'Email is already verified',
                'EMAIL_ALREADY_VERIFIED',
            )
        }

        if(!user.emailVerificationCodeHash || !user.emailVerificationExpiresAt){
            throw new AppError(
                400,
                "Verification code is not available",
                "VERIFICATION_CODE_NOT_FOUND",
            )
        }

        if(user.emailVerificationExpiresAt.getTime()<Date.now()){
            throw new AppError(
                400,
                'Verification code has expired',
                'VERIFICATION_CODE_EXPIRED'
            )
        }

        const isValid = await this.passwordService.compare(input.verificationCode,user.emailVerificationCodeHash)
        if(!isValid){
            throw new AppError(
                400,
                'Invalid verification code',
                'INVALID_VERIFICATION_CODE',
            )
        }

        user.isEmailVerified = true;
        user.status = 'active';

        user.emailVerificationCodeHash = undefined;
        user.emailVerificationExpiresAt = undefined;
        user.emailVerificationLastSentAt = undefined;

        await this.userRepository.update(user)
    }
}