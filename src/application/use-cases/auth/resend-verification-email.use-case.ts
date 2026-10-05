import { generateVerificationCode } from "../../../shared/utils/generate-verification-code.js";
import type { ResendVerificationEmailDTO } from "../../dto/auth/resend-verification-email.dto.js";
import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { IPasswordService } from "../../interfaces/services/password.service.js";
import type { IEmailService } from "../../interfaces/services/email.service.js";

export class ResendVerificationEmailUseCase {
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly passwordService:IPasswordService,
        private readonly emailService:IEmailService,
    ){}

    async execute(
        input:ResendVerificationEmailDTO,
    ):Promise<void>{
        const user = await this.userRepository.findByEmail(input.email);

        if(!user || user.isEmailVerified){
            return ;
        }

        if(user.emailVerificationLastSentAt){
            const elapsed = Date.now() - user.emailVerificationLastSentAt.getTime();

            if(elapsed<60*1000){
                return;
            }
        }

        const verificationCode = generateVerificationCode();

        const verificationCodeHash = await this.passwordService.hash(verificationCode);

        const verificationExpiresAt = new Date(Date.now()+10*60*1000)

        user.emailVerificationCodeHash = verificationCodeHash;
        user.emailVerificationExpiresAt = verificationExpiresAt;
        user.emailVerificationLastSentAt = new Date();

        await this.userRepository.update(user);

        await this.emailService.sendVerificationEmail(input.email,verificationCode)
    }
}