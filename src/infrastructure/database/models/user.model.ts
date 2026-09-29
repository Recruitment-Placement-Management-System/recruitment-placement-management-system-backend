import { model, Schema, type Document } from 'mongoose'

import type{
    UserRole,
    UserStatus,
} from '../../../domain/entities/user.entity.js'

export interface UserDocument extends Document{
    email:string;
    passwordHash:string;
    roles:UserRole[];
    phone?:string;
    status:UserStatus;
    isEmailVerified:boolean;
    refreshTokenHash?:string;
    lastLoginAt?:Date;

    emailVerificationCodeHash?: string;
  emailVerificationExpiresAt?: Date;

  passwordResetTokenHash?: string;
  passwordResetExpiresAt?: Date;

  emailVerificationLastSentAt?: Date;

  settings?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    roles: {
      type: [
        {
          type: String,
          enum: ["candidate", "recruiter", "admin"],
        },
      ],
      required: true,
      default: [],
    },

    phone: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending_verification",
        "active",
        "suspended",
        "blocked",
      ],
      default: "pending_verification",
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    refreshTokenHash: {
      type: String,
    },

    lastLoginAt: {
      type: Date,
    },

    emailVerificationCodeHash: {
      type: String,
    },

    emailVerificationExpiresAt: {
      type: Date,
    },

    passwordResetTokenHash: {
      type: String,
    },

    passwordResetExpiresAt: {
      type: Date,
    },

    emailVerificationLastSentAt: {
      type: Date,
    },

    settings: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = model<UserDocument>("User",userSchema)