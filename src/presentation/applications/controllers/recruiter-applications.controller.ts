import type { RequestHandler } from "express";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { ListRecruiterApplicationsUseCase } from "../../../application/use-cases/applications/list-recruiter-applications.use-case.js";
import type { GetJobApplicationUseCase } from "../../../application/use-cases/applications/get-job-application.use-case.js";
import type { UpdateApplicationStatusUseCase } from "../../../application/use-cases/applications/update-application-status.use-case.js";
import type { JobApplicationResponseMapper } from "../mappers/job-application-response.mapper.js";
import type { IFileStorageService } from "../../../application/interfaces/services/file-storage.service.js";
import { applicationListQuerySchema, applicationStatusSchema, jobApplicationIdSchema } from "../validators/job-application.validator.js";
import { AppError } from "../../../application/errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export interface RecruiterApplicationsDependencies {
  listRecruiterApplicationsUseCase: ListRecruiterApplicationsUseCase;
  getJobApplicationUseCase: GetJobApplicationUseCase;
  updateApplicationStatusUseCase: UpdateApplicationStatusUseCase;
  responseMapper: JobApplicationResponseMapper;
  fileStorage: IFileStorageService;
  tokenService: ITokenService;
}

const parse = <T>(schema: { safeParse(input: unknown): { success: true; data: T } | { success: false } }, input: unknown): T => {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(HttpStatus.BAD_REQUEST, "Invalid application request", "INVALID_APPLICATION_REQUEST");
  return result.data;
};

export const createRecruiterApplicationsController = (dependencies: RecruiterApplicationsDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
  return {

    list: wrap(async (req, res) => {
      const page = await dependencies.listRecruiterApplicationsUseCase.execute(req.user!.userId, parse(applicationListQuerySchema, req.query));
      res.status(HttpStatus.OK).json({ message: "Applications retrieved successfully", ...dependencies.responseMapper.toPageDto(page) });
    }),

    get: wrap(async (req, res) => {
      const id = parse(jobApplicationIdSchema, req.params.applicationId);
      const application = await dependencies.getJobApplicationUseCase.execute(id, req.user!.userId, "recruiter");
      const dto = dependencies.responseMapper.toDto(application);
      res.status(HttpStatus.OK).json({ message: "Application retrieved successfully", application: { ...dto, resume: { ...dto.resume, downloadUrl: await dependencies.fileStorage.getDownloadUrl(application.resume.storageKey) } } });
    }),

    updateStatus: wrap(async (req, res) => {
      const id = parse(jobApplicationIdSchema, req.params.applicationId);
      const { status } = parse(applicationStatusSchema, req.body);
      const application = await dependencies.updateApplicationStatusUseCase.execute(id, req.user!.userId, status);
      res.status(HttpStatus.OK).json({ message: "Application status updated successfully", application: dependencies.responseMapper.toDto(application) });
    }),
    
  };
};
