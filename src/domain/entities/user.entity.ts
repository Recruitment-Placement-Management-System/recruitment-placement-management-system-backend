export type UserRole = "candidate" | "recruiter" | "admin";

export type UserStatus =
  | "pending_verification"
  | "active"
  | "suspended"
  | "blocked";

export class User {
  constructor(
    public readonly id: string | undefined,
    public email: string,
    public passwordHash: string,
    public roles: UserRole[],
    public status: UserStatus,
    public isEmailVerified: boolean,
    public phone?: string,
    public fullName?:string,
    public refreshTokenHash?: string,
    public lastLoginAt?: Date,
    public emailVerificationCodeHash?: string,
    public emailVerificationExpiresAt?: Date,
    public emailVerificationLastSentAt?:Date,
    public passwordResetTokenHash?: string,
    public passwordResetExpiresAt?: Date,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}