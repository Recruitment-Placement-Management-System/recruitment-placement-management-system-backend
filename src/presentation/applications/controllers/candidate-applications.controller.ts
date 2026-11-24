import type { RequestHandler } from "express";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { SubmitJobApplicationUseCase } from "../../../application/use-cases/applications/submit-job-application.use-case.js";
import type { ListCandidateApplicationsUseCase } from "../../../application/use-cases/applications/list-candidate-applications.use-case.js";
import type { GetJobApplicationUseCase } from "../../../application/use-cases/applications/get-job-application.use-case.js";
import type { WithdrawJobApplicationUseCase } from "../../../application/use-cases/applications/withdraw-job-application.use-case.js";
import type { JobApplicationResponseMapper } from "../mappers/job-application-response.mapper.js";
import type { IFileStorageService } from "../../../application/interfaces/services/file-storage.service.js";
import { applicationListQuerySchema, jobApplicationIdSchema, submitJobApplicationSchema } from "../validators/job-application.validator.js";
import { AppError } from "../../../application/errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export interface CandidateApplicationsDependencies {
  submitJobApplicationUseCase: SubmitJobApplicationUseCase;
  listCandidateApplicationsUseCase: ListCandidateApplicationsUseCase;
  getJobApplicationUseCase: GetJobApplicationUseCase;
  withdrawJobApplicationUseCase: WithdrawJobApplicationUseCase;
  responseMapper: JobApplicationResponseMapper;
  fileStorage: IFileStorageService;
  tokenService: ITokenService;
}

const parse = <T>(schema: { safeParse(input: unknown): { success: true; data: T } | { success: false } }, input: unknown): T => {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(HttpStatus.BAD_REQUEST, "Invalid application request", "INVALID_APPLICATION_REQUEST");
  return result.data;
};

export const createCandidateApplicationsController = (dependencies: CandidateApplicationsDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
  return {

    submit: wrap(async (req, res) => {
      const jobId = parse(jobApplicationIdSchema, req.params.jobId);
      const body = parse(submitJobApplicationSchema, req.body);
      const application = await dependencies.submitJobApplicationUseCase.execute(req.user!.userId, { ...body, jobId });
      res.status(HttpStatus.CREATED).json({ message: "Application submitted successfully", application: { ...dependencies.responseMapper.toDto(application), resume: { ...dependencies.responseMapper.toDto(application).resume, downloadUrl: await dependencies.fileStorage.getDownloadUrl(application.resume.storageKey) } } });
    }),

    list: wrap(async (req, res) => {
      const page = await dependencies.listCandidateApplicationsUseCase.execute(req.user!.userId, parse(applicationListQuerySchema, req.query));
      res.status(HttpStatus.OK).json({ message: "Applications retrieved successfully", ...dependencies.responseMapper.toPageDto(page) });
    }),

    get: wrap(async (req, res) => {
      const id = parse(jobApplicationIdSchema, req.params.applicationId);
      const application = await dependencies.getJobApplicationUseCase.execute(id, req.user!.userId, "candidate");
      res.status(HttpStatus.OK).json({ message: "Application retrieved successfully", application: { ...dependencies.responseMapper.toDto(application), resume: { ...dependencies.responseMapper.toDto(application).resume, downloadUrl: await dependencies.fileStorage.getDownloadUrl(application.resume.storageKey) } } });
    }),

    withdraw: wrap(async (req, res) => {
      const id = parse(jobApplicationIdSchema, req.params.applicationId);
      const application = await dependencies.withdrawJobApplicationUseCase.execute(id, req.user!.userId);
      res.status(HttpStatus.OK).json({ message: "Application withdrawn successfully", application: { ...dependencies.responseMapper.toDto(application), resume: { ...dependencies.responseMapper.toDto(application).resume, downloadUrl: await dependencies.fileStorage.getDownloadUrl(application.resume.storageKey) } } });
    }),
    
  };
};
