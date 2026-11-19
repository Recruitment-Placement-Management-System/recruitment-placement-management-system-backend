import type { RequestHandler } from "express";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { GetRecruiterVerificationHistoryUseCase } from "../../../application/use-cases/recruiter-verification/get-recruiter-verification-history.use-case.js";
import type { SubmitRecruiterVerificationUseCase } from "../../../application/use-cases/recruiter-verification/submit-recruiter-verification.use-case.js";
import type { RecruiterVerificationResponseMapper } from "../mappers/recruiter-verification-response.mapper.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export interface RecruiterVerificationControllerDependencies {
  getRecruiterVerificationHistoryUseCase: GetRecruiterVerificationHistoryUseCase;
  submitRecruiterVerificationUseCase: SubmitRecruiterVerificationUseCase;
  recruiterVerificationResponseMapper: RecruiterVerificationResponseMapper;
  tokenService: ITokenService;
}

export const createRecruiterVerificationController = (dependencies: RecruiterVerificationControllerDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  return {
    submit: wrap(async (req, res) => {
      const files = req.files as Express.Multer.File[];
      const request = await dependencies.submitRecruiterVerificationUseCase.execute(req.user!.userId, {
        files: files.map((file) => ({
          buffer: file.buffer,
          contentType: file.mimetype as "application/pdf" | "image/jpeg" | "image/png",
        })),
      });
      res.status(HttpStatus.CREATED).json({
        message: "Recruiter verification submitted successfully",
        verification: await dependencies.recruiterVerificationResponseMapper.toDto(request),
      });
    }),

    history: wrap(async (req, res) => {
      const requests = await dependencies.getRecruiterVerificationHistoryUseCase.execute(req.user!.userId);
      res.status(HttpStatus.OK).json({
        message: "Recruiter verification history retrieved successfully",
        history: await dependencies.recruiterVerificationResponseMapper.toHistoryDto(requests),
      });
    }),
  };
};
