import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { SearchPublishedJobsUseCase } from "../../../application/use-cases/jobs/search-published-jobs.use-case.js";
import type { GetJobDetailsUseCase } from "../../../application/use-cases/jobs/get-job-details.use-case.js";
import type { GetRelatedJobsUseCase } from "../../../application/use-cases/jobs/get-related-jobs.use-case.js";
import type { JobResponseMapper } from "../mappers/job-response.mapper.js";
import { AppError } from "../../../application/errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";
import { jobIdSchema, publishedJobSearchQuerySchema } from "../validators/job.validator.js";

export interface CandidateJobsControllerDependencies {
  searchPublishedJobsUseCase: SearchPublishedJobsUseCase;
  getJobDetailsUseCase: GetJobDetailsUseCase;
  getRelatedJobsUseCase: GetRelatedJobsUseCase;
  jobResponseMapper: JobResponseMapper;
  tokenService: ITokenService;
}

const parse = <TOutput>(schema: ZodType<TOutput>, input: unknown): TOutput => {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(HttpStatus.BAD_REQUEST, "Invalid job search parameters", "INVALID_JOB_SEARCH_PARAMETERS");
  return result.data;
};

export const createCandidateJobsController = (dependencies: CandidateJobsControllerDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  return {
    browse: wrap(async (req, res) => {
      const page = await dependencies.searchPublishedJobsUseCase.execute(parse(publishedJobSearchQuerySchema, req.query));
      res.status(HttpStatus.OK).json({ message: "Available jobs retrieved successfully", ...dependencies.jobResponseMapper.toPageDto(page) });
    }),
    details: wrap(async (req, res) => {
      const id = parse(jobIdSchema, req.params.jobId);
      const job = await dependencies.getJobDetailsUseCase.execute(id);
      res.status(HttpStatus.OK).json({ message: "Job details retrieved successfully", job: dependencies.jobResponseMapper.toDto(job) });
    }),
    related: wrap(async (req, res) => {
      const id = parse(jobIdSchema, req.params.jobId);
      const jobs = await dependencies.getRelatedJobsUseCase.execute(id);
      res.status(HttpStatus.OK).json({ message: "Related jobs retrieved successfully", jobs: jobs.map((job) => dependencies.jobResponseMapper.toDto(job)) });
    }),
  };
};
