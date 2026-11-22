import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { CreateJobUseCase } from "../../../application/use-cases/jobs/create-job.use-case.js";
import type { UpdateJobUseCase } from "../../../application/use-cases/jobs/update-job.use-case.js";
import type { DeleteJobUseCase } from "../../../application/use-cases/jobs/delete-job.use-case.js";
import type { SetJobPublicationUseCase } from "../../../application/use-cases/jobs/set-job-publication.use-case.js";
import type { GetRecruiterJobDetailsUseCase } from "../../../application/use-cases/jobs/get-recruiter-job-details.use-case.js";
import type { ListRecruiterJobsUseCase } from "../../../application/use-cases/jobs/list-recruiter-jobs.use-case.js";
import type { JobResponseMapper } from "../mappers/job-response.mapper.js";
import { AppError } from "../../../application/errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";
import { jobIdSchema, recruiterJobListQuerySchema } from "../validators/job.validator.js";

export interface RecruiterJobsControllerDependencies {
  createJobUseCase: CreateJobUseCase;
  updateJobUseCase: UpdateJobUseCase;
  deleteJobUseCase: DeleteJobUseCase;
  setJobPublicationUseCase: SetJobPublicationUseCase;
  getRecruiterJobDetailsUseCase: GetRecruiterJobDetailsUseCase;
  listRecruiterJobsUseCase: ListRecruiterJobsUseCase;
  jobResponseMapper: JobResponseMapper;
  tokenService: ITokenService;
}

const parse = <TOutput>(schema: ZodType<TOutput>, input: unknown): TOutput => {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(HttpStatus.BAD_REQUEST, "Invalid query parameters", "INVALID_QUERY_PARAMETERS");
  return result.data;
};

const parseJobId = (value: unknown) => {
  const result = jobIdSchema.safeParse(value);
  if (!result.success) throw new AppError(HttpStatus.BAD_REQUEST, "Invalid job ID", "INVALID_JOB_ID");
  return result.data;
};

export const createRecruiterJobsController = (dependencies: RecruiterJobsControllerDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  return {
    create: wrap(async (req, res) => {
      const job = await dependencies.createJobUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.CREATED).json({ message: "Job created successfully as a draft", job: dependencies.jobResponseMapper.toDto(job) });
    }),
    list: wrap(async (req, res) => {
      const page = await dependencies.listRecruiterJobsUseCase.execute(
        req.user!.userId,
        parse(recruiterJobListQuerySchema, req.query),
      );
      res.status(HttpStatus.OK).json({ message: "Jobs retrieved successfully", ...dependencies.jobResponseMapper.toPageDto(page) });
    }),
    get: wrap(async (req, res) => {
      const job = await dependencies.getRecruiterJobDetailsUseCase.execute(parseJobId(req.params.jobId), req.user!.userId);
      res.status(HttpStatus.OK).json({ message: "Job retrieved successfully", job: dependencies.jobResponseMapper.toDto(job) });
    }),
    update: wrap(async (req, res) => {
      const job = await dependencies.updateJobUseCase.execute(parseJobId(req.params.jobId), req.user!.userId, req.body);
      res.status(HttpStatus.OK).json({ message: "Job updated successfully", job: dependencies.jobResponseMapper.toDto(job) });
    }),
    delete: wrap(async (req, res) => {
      await dependencies.deleteJobUseCase.execute(parseJobId(req.params.jobId), req.user!.userId);
      res.status(HttpStatus.OK).json({ message: "Job deleted successfully" });
    }),
    publish: wrap(async (req, res) => {
      const job = await dependencies.setJobPublicationUseCase.execute(parseJobId(req.params.jobId), req.user!.userId, true);
      res.status(HttpStatus.OK).json({ message: "Job published successfully", job: dependencies.jobResponseMapper.toDto(job) });
    }),
    unpublish: wrap(async (req, res) => {
      const job = await dependencies.setJobPublicationUseCase.execute(parseJobId(req.params.jobId), req.user!.userId, false);
      res.status(HttpStatus.OK).json({ message: "Job unpublished successfully", job: dependencies.jobResponseMapper.toDto(job) });
    }),
  };
};
