import multer from "multer";
import type { RequestHandler } from "express";
import { AppError } from "../../../application/errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

const maxResumeSizeBytes = 10 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxResumeSizeBytes, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new AppError(HttpStatus.BAD_REQUEST, "Only PDF and DOCX resumes are supported", "INVALID_RESUME_TYPE"));
      return;
    }
    callback(null, true);
  },
}).single("resume");

const hasValidResumeSignature = (buffer: Buffer, mimeType: string): boolean => {
  if (mimeType === "application/pdf") {
    return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const isZip = buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
    const hasDocxFiles = buffer.includes(Buffer.from("[Content_Types].xml"))
      && buffer.includes(Buffer.from("word/document.xml"));
    return isZip && hasDocxFiles;
  }
  return false;
};

const hasMatchingExtension = (fileName: string, mimeType: string): boolean => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return mimeType === "application/pdf"
    ? extension === "pdf"
    : mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ? extension === "docx"
      : false;
};

export const uploadCandidateResume: RequestHandler = (req, res, next) => {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === "LIMIT_FILE_SIZE";
      next(new AppError(
        tooLarge ? HttpStatus.PAYLOAD_TOO_LARGE : HttpStatus.BAD_REQUEST,
        tooLarge ? "Resume must be 10 MB or smaller" : error.message,
        error.code,
      ));
      return;
    }
    if (error) {
      next(error);
      return;
    }
    if (!req.file) {
      next(new AppError(HttpStatus.BAD_REQUEST, "Upload a resume using the 'resume' field", "RESUME_REQUIRED"));
      return;
    }
    if (!hasMatchingExtension(req.file.originalname, req.file.mimetype)
      || !hasValidResumeSignature(req.file.buffer, req.file.mimetype)) {
      next(new AppError(HttpStatus.BAD_REQUEST, "The resume content and file extension must match a PDF or DOCX file", "INVALID_RESUME_CONTENT"));
      return;
    }
    next();
  });
};
