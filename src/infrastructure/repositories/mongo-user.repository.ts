import  { User } from "../../domain/entities/user.entity.js";
import type { IUserRepository } from "../../application/interfaces/repositories/user.repository.js";
import {
  UserModel,
  type UserDocument,
} from "../database/models/user.model.js";

export class MongoUserRepository implements IUserRepository {
  private toDomain(document: UserDocument): User {
    return new User(
      document._id.toString(),
      document.email,
      document.passwordHash,
      document.roles,
      document.status,
      document.isEmailVerified,
      document.phone,
      document.refreshTokenHash,
      document.lastLoginAt,
      document.emailVerificationCodeHash,
      document.emailVerificationExpiresAt,
      document.passwordResetTokenHash,
      document.passwordResetExpiresAt,
      document.createdAt,
      document.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const document = await UserModel.findById(id).exec();

    if (!document) {
      return null;
    }

    return this.toDomain(document);
  }

  async findByEmail(email: string): Promise<User | null> {
    const document = await UserModel
      .findOne({
        email: email.trim().toLowerCase(),
      })
      .exec();

    if (!document) {
      return null;
    }

    return this.toDomain(document);
  }

  async create(user: User): Promise<User> {
  const document = await UserModel.create({
    email: user.email,
    passwordHash: user.passwordHash,
    roles: user.roles,
    status: user.status,
    isEmailVerified: user.isEmailVerified,

    ...(user.phone !== undefined && {
      phone: user.phone,
    }),

    ...(user.refreshTokenHash !== undefined && {
      refreshTokenHash: user.refreshTokenHash,
    }),

    ...(user.lastLoginAt !== undefined && {
      lastLoginAt: user.lastLoginAt,
    }),

    ...(user.emailVerificationCodeHash !== undefined && {
      emailVerificationCodeHash: user.emailVerificationCodeHash,
    }),

    ...(user.emailVerificationExpiresAt !== undefined && {
      emailVerificationExpiresAt: user.emailVerificationExpiresAt,
    }),

    ...(user.passwordResetTokenHash !== undefined && {
      passwordResetTokenHash: user.passwordResetTokenHash,
    }),

    ...(user.passwordResetExpiresAt !== undefined && {
      passwordResetExpiresAt: user.passwordResetExpiresAt,
    }),
  });

  return this.toDomain(document);
}

  async update(user: User): Promise<User> {
    if (!user.id) {
      throw new Error("Cannot update a user without an id");
    }

    const document = await UserModel.findByIdAndUpdate(
      user.id,
      {
        $set:{
          email: user.email,
        passwordHash: user.passwordHash,
        roles: user.roles,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        ...(user.phone !== undefined && {phone:user.phone}),
        ...(user.refreshTokenHash !== undefined && {
          refreshTokenHash:user.refreshTokenHash,
        }),
        ...(user.lastLoginAt !== undefined && {
          lastLoginAt: user.lastLoginAt,
        }),
        ...(user.passwordResetTokenHash !== undefined && {
          passwordResetTokenHash: user.passwordResetTokenHash,
        }),
        ...(user.passwordResetExpiresAt !== undefined && {
          passwordResetExpiresAt: user.passwordResetExpiresAt,
        }),
        },
        $unset:{
          ...(user.emailVerificationCodeHash === undefined && {
            emailVerificationCodeHash:1,
          }),
          ...(user.emailVerificationExpiresAt === undefined && {
            emailVerificationExpiresAt:1,
          })
        }
      },
      {
        new:true,
        runValidators:true
      },
    ).exec()

    if (!document) {
      throw new Error("User not found");
    }

    return this.toDomain(document);
  }
}