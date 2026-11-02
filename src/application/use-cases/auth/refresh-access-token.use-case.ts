import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";
import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { IPasswordService } from "../../interfaces/services/password.service.js";
import type { ITokenService } from "../../interfaces/services/token.service.js";
import type { RefreshAccessTokenDTO } from "../../dto/auth/refresh-access-token.dto.js";

export class RefreshAccessTokenUseCase{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly passwordService:IPasswordService,
        private readonly tokenService:ITokenService,
    ){}

    async execute(
  input: RefreshAccessTokenDTO
): Promise<{
  accessToken: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}> {
  const payload = this.tokenService.verifyRefreshToken(
    input.refreshToken
  );

  const user = await this.userRepository.findById(payload.userId);

  if (!user || !user.refreshTokenHash) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }

  const isValid = await this.passwordService.compare(
    input.refreshToken,
    user.refreshTokenHash
  );

  if (!isValid) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }

  if (!user.id) {
    throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, "User ID is missing", "USER_ID_MISSING");
  }

  const accessToken = this.tokenService.generateAccessToken({
    userId: user.id,
    roles: user.roles,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      roles: user.roles,
    },
  };
}
}
