import multer from "multer";
import type { RequestHandler } from "express";
import { AppError } from "../../../application/errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new AppError(HttpStatus.BAD_REQUEST, "Only JPEG, PNG, and WebP images are supported", "INVALID_PROFILE_PHOTO_TYPE"));
      return;
    }
    callback(null, true);
  },
}).single("photo");

const hasValidImageSignature = (buffer: Buffer, mimeType: string): boolean => {
  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimeType === "image/webp") {
    return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
};

export const uploadCandidateProfilePhoto: RequestHandler = (req, res, next) => {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const status = error.code === "LIMIT_FILE_SIZE" ? HttpStatus.PAYLOAD_TOO_LARGE : HttpStatus.BAD_REQUEST;
      next(new AppError(status, error.code === "LIMIT_FILE_SIZE" ? "Profile photo must be 5 MB or smaller" : error.message, error.code));
      return;
    }
    if (error) {
      next(error);
      return;
    }
    if (!req.file) {
      next(new AppError(HttpStatus.BAD_REQUEST, "Upload a photo using the 'photo' field", "PROFILE_PHOTO_REQUIRED"));
      return;
    }
    if (!hasValidImageSignature(req.file.buffer, req.file.mimetype)) {
      next(new AppError(HttpStatus.BAD_REQUEST, "The uploaded file is not a valid JPEG, PNG, or WebP image", "INVALID_PROFILE_PHOTO_CONTENT"));
      return;
    }
    next();
  });
};
