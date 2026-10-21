import { AppError } from "../../errors/app-error.js";
import { User } from "../../../domain/entities/user.entity.js";
import { Company } from "../../../domain/entities/company.entity.js";
import { RecruiterProfile } from "../../../domain/entities/recruiter-profile.entity.js";
import { VerificationRequest } from "../../../domain/entities/verification-request.entity.js";

import { generateVerificationCode } from "../../../shared/utils/generate-verification-code.js";

import type { RegisterRecruiterDTO } from "../../dto/auth/register-recruiter.dto.js";
import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { ICompanyRepository } from "../../interfaces/repositories/company.repository.js";
import type { IRecruiterProfileRepository } from "../../interfaces/repositories/recruiter-profile.repository.js";
import type { IVerificationRequestRepository } from "../../interfaces/repositories/verification-request.repository.js";
import type { IPasswordService } from "../../interfaces/services/password.service.js";
import type { IEmailService } from "../../interfaces/services/email.service.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";


export class RegisterRecruiterUseCase {
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly companyRepository:ICompanyRepository,
        private readonly recruiterProfileRepository:IRecruiterProfileRepository,
        private readonly verificationRequestRepository:IVerificationRequestRepository,
        private readonly passwordService:IPasswordService,
        private readonly emailService:IEmailService,
    ){}

    async execute(input:RegisterRecruiterDTO):Promise<User>{
        const existingUser = await this.userRepository.findByEmail(input.email);

        if(existingUser){
            throw new AppError(
                HttpStatus.CONFLICT,
                'Email is already registered',
                'EMAIL_ALREADY_REGISTERED',
            )
        }

        const passwordHash = await this.passwordService.hash(input.password);
        const verificationCode = generateVerificationCode();
        const verificationCodeHash = await this.passwordService.hash(verificationCode)
        const verificationExpiresAt = new Date(Date.now()+10*60*1000);
        const verificationLastSent = new Date();

        const user = new User(
            undefined,
            input.email,
            passwordHash,
            ['recruiter'],
            'pending_verification',
            false,
            input.phone,
            undefined,
            undefined,
            undefined,
            verificationCodeHash,
            verificationExpiresAt,
            verificationLastSent,
        );

        const createdUser = await this.userRepository.create(user)

        let company = await this.companyRepository.findByName(input.companyName);
        if(!company){
            company = await this.companyRepository.create(
                new Company(
                    undefined,
                    input.companyName,
                    input.companyLocation,
                    input.companyWebsite,
                    'pending',
                    'pending'
                )
            )
        }

        const profile = await this.recruiterProfileRepository.create(
            new RecruiterProfile(
                undefined,
                createdUser.id!,
                company.id!,
                input.fullName,
                input.designation,
                'pending'
            )
        )

        await this.verificationRequestRepository.create(
            new VerificationRequest(
                undefined,
                profile.id!,
                'recruiter',
                createdUser.id!,
                'pending',
                'normal',
            )
        )

        await this.emailService.sendVerificationEmail(createdUser.email,verificationCode);

        return createdUser;
    }
}
