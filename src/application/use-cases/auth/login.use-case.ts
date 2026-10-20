import { AppError } from "../../errors/app-error.js";

import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { IPasswordService } from "../../interfaces/services/password.service.js";
import type { ITokenService } from "../../interfaces/services/token.service.js";
import type { LoginDTO } from "../../dto/auth/login.dto.js";

export class LoginUseCase{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly passwordService:IPasswordService,
        private readonly tokenService:ITokenService,
    ){}

    async execute(input:LoginDTO){
        const user = await this.userRepository.findByEmail(input.email);

        if(!user){
            throw new AppError(
                401,
                'Invalid email or password',
                'INVALID_CREDENTIALS',
            )
        }

        const isPasswordValid = await this.passwordService.compare(input.password,user.passwordHash)

        if (!isPasswordValid) {
      throw new AppError(
        401,
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    if (!user.isEmailVerified) {
      throw new AppError(
        403,
        "Please verify your email before logging in",
        "EMAIL_NOT_VERIFIED",
      );
    }

    if (user.status !== "active") {
      throw new AppError(
        403,
        "Your account is not active",
        "ACCOUNT_NOT_ACTIVE",
      );
    }

    if (!user.id) {
      throw new AppError(500, "User ID is missing", "USER_ID_MISSING");
    }

    const accessToken = this.tokenService.generateAccessToken({userId:user.id,roles:user.roles})

    const refreshToken = this.tokenService.generateRefreshToken({userId:user.id,roles:user.roles})

    user.refreshTokenHash = await this.passwordService.hash(refreshToken);
    user.lastLoginAt = new Date();

    await this.userRepository.update(user);

    return {
        accessToken,
        refreshToken,
        user:{
            id:user.id,
            email:user.email,
            roles:user.roles,
        }
    }
    }
}
