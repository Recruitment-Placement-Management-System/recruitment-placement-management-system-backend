import  { User } from "../../../domain/entities/user.entity.js";
import { generateVerificationCode } from "../../../shared/utils/generate-verification-code.js";

import type { RegisterCandidateDTO } from "../../dto/auth/register-candidate.dto.js";
import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { IEmailService } from "../../interfaces/services/email.service.js";
import type { IPasswordService } from "../../interfaces/services/password.service.js";



export class RegisterCandidateUseCase{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly passwordService:IPasswordService,
        private readonly emailService:IEmailService,
    ){}

    async execute(
        input: RegisterCandidateDTO,
    ):Promise<User>{
        const existingUser = await this.userRepository.findByEmail(input.email,);

        if(existingUser){
            throw new Error('Email is already registered')
        }

        const passwordHash = await this.passwordService.hash(input.password);

        const verificationCode = generateVerificationCode();

        const verificationCodeHash = await this.passwordService.hash(verificationCode)

        const verificationExpiresAt = new Date(Date.now()+10*60*1000,)

        const user = new User(
            undefined,
            input.email,
            passwordHash,
            ['candidate'],
            'pending_verification',
            false,
            input.phone,
            undefined,
            undefined,
            verificationCodeHash,
            verificationExpiresAt,
        )

        const createdUser = await this.userRepository.create(user)

        await this.emailService.sendVerificationEmail(createdUser.email,verificationCode)

        return createdUser;
    }
}