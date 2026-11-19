import multer from "multer";
import type { RequestHandler } from "express";
import { AppError } from "../../../application/errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new AppError(HttpStatus.BAD_REQUEST, "Verification evidence must be PDF, JPEG, or PNG", "INVALID_VERIFICATION_DOCUMENT_TYPE"));
      return;
    }
    callback(null, true);
  },
}).array("documents", 5);

const hasValidSignature = (buffer: Buffer, mimeType: string): boolean => {
  if (mimeType === "application/pdf") return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  if (mimeType === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === "image/png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  return false;
};

export const uploadRecruiterVerificationDocuments: RequestHandler = (req, res, next) => {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === "LIMIT_FILE_SIZE";
      next(new AppError(
        tooLarge ? HttpStatus.PAYLOAD_TOO_LARGE : HttpStatus.BAD_REQUEST,
        tooLarge ? "Each verification document must be 10 MB or smaller" : error.message,
        error.code,
      ));
      return;
    }
    if (error) {
      next(error);
      return;
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) {
      next(new AppError(HttpStatus.BAD_REQUEST, "Upload one to five files using the 'documents' field", "VERIFICATION_DOCUMENTS_REQUIRED"));
      return;
    }
    if (files.some((file) => !hasValidSignature(file.buffer, file.mimetype))) {
      next(new AppError(HttpStatus.BAD_REQUEST, "One or more verification documents have invalid file content", "INVALID_VERIFICATION_DOCUMENT_CONTENT"));
      return;
    }
    next();
  });
};
