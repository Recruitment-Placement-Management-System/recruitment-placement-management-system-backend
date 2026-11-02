import { AppError } from '../../errors/app-error.js';
import { HttpStatus } from '../../../shared/constants/http-status.js';
import { generateVerificationCode } from '../../../shared/utils/generate-verification-code.js';
import type { ChangeVerificationEmailDTO } from '../../dto/auth/change-verification-email.dto.js';
import type { IUserRepository } from '../../interfaces/repositories/user.repository.js';
import type { IPasswordService } from '../../interfaces/services/password.service.js';
import type { IEmailService } from '../../interfaces/services/email.service.js';

export class ChangeVerificationEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly emailService: IEmailService,
  ) {}

  async execute(input: ChangeVerificationEmailDTO): Promise<void> {
    const currentEmail = input.currentEmail.trim().toLowerCase();
    const newEmail = input.newEmail.trim().toLowerCase();

    if (newEmail !== currentEmail) {
      const existingUser = await this.userRepository.findByEmail(newEmail);
      if (existingUser) {
        throw new AppError(HttpStatus.CONFLICT, 'Email is already registered', 'EMAIL_ALREADY_REGISTERED');
      }
    }

    const user = await this.userRepository.findByEmail(currentEmail);
    
    if (!user || user.isEmailVerified) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Pending account not found', 'PENDING_ACCOUNT_NOT_FOUND');
    }

    const verificationCode = generateVerificationCode();
    user.email = newEmail;
    user.emailVerificationCodeHash = await this.passwordService.hash(verificationCode);
    user.emailVerificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.emailVerificationLastSentAt = new Date();
    user.updatedAt = new Date();

    await this.userRepository.update(user);
    await this.emailService.sendVerificationEmail(user.email, verificationCode);
  }
}
