import { User } from "../../domain/entities/user.entity.js";
import type { UserDocument } from "../database/models/user.model.js";

type UserCreateData = Omit<Partial<UserDocument>, "_id" | "id"> &
  Pick<UserDocument, "email" | "passwordHash" | "roles" | "status" | "isEmailVerified">;

export class UserMapper {
  static toDomain(document: UserDocument): User {
    return new User(
      document._id.toString(), document.email, document.passwordHash,
      document.roles, document.status, document.isEmailVerified,
      document.phone, document.fullName, document.refreshTokenHash,
      document.lastLoginAt, document.emailVerificationCodeHash,
      document.emailVerificationExpiresAt, document.emailVerificationLastSentAt,
      document.passwordResetTokenHash, document.passwordResetExpiresAt,
      document.createdAt, document.updatedAt,
    );
  }

  static toCreateData(user: User): UserCreateData {
    const data: Record<string, unknown> = {
      email: user.email,
      passwordHash: user.passwordHash,
      roles: user.roles,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
    };
    const optionalFields = {
      phone: user.phone, fullName: user.fullName,
      refreshTokenHash: user.refreshTokenHash, lastLoginAt: user.lastLoginAt,
      emailVerificationCodeHash: user.emailVerificationCodeHash,
      emailVerificationExpiresAt: user.emailVerificationExpiresAt,
      emailVerificationLastSentAt: user.emailVerificationLastSentAt,
      passwordResetTokenHash: user.passwordResetTokenHash,
      passwordResetExpiresAt: user.passwordResetExpiresAt,
    };
    for (const [field, value] of Object.entries(optionalFields)) {
      if (value !== undefined) data[field] = value;
    }
    return data as UserCreateData;
  }

  // Missing optional values intentionally become $unset operations.
  static toUpdateOperations(user: User): {
    $set: Record<string, unknown>;
    $unset: Record<string, 1>;
  } {
    const optionalFields = {
      phone: user.phone,
      fullName: user.fullName,
      refreshTokenHash: user.refreshTokenHash,
      lastLoginAt: user.lastLoginAt,
      emailVerificationCodeHash: user.emailVerificationCodeHash,
      emailVerificationExpiresAt: user.emailVerificationExpiresAt,
      emailVerificationLastSentAt: user.emailVerificationLastSentAt,
      passwordResetTokenHash: user.passwordResetTokenHash,
      passwordResetExpiresAt: user.passwordResetExpiresAt,
    };
    const $set: Record<string, unknown> = {
      email: user.email,
      passwordHash: user.passwordHash,
      roles: user.roles,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
    };
    const $unset: Record<string, 1> = {};

    for (const [field, value] of Object.entries(optionalFields)) {
      if (value === undefined) $unset[field] = 1;
      else $set[field] = value;
    }

    return { $set, $unset };
  }
}
