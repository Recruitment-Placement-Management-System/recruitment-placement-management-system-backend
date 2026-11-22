import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import type { SearchPublishedJobsUseCase } from "../../../application/use-cases/jobs/search-published-jobs.use-case.js";
import type { GetJobDetailsUseCase } from "../../../application/use-cases/jobs/get-job-details.use-case.js";
import type { JobResponseMapper } from "../mappers/job-response.mapper.js";
import { AppError } from "../../../application/errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";
import { jobIdSchema, publishedJobSearchQuerySchema } from "../validators/job.validator.js";

export interface PublishedJobsControllerDependencies {
  searchPublishedJobsUseCase: SearchPublishedJobsUseCase;
  getJobDetailsUseCase: GetJobDetailsUseCase;
  jobResponseMapper: JobResponseMapper;
}

const parse = <TOutput>(schema: ZodType<TOutput>, input: unknown): TOutput => {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(HttpStatus.BAD_REQUEST, "Invalid search parameters", "INVALID_JOB_SEARCH_PARAMETERS");
  return result.data;
};

export const createPublishedJobsController = (dependencies: PublishedJobsControllerDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  return {
    search: wrap(async (req, res) => {
      const page = await dependencies.searchPublishedJobsUseCase.execute(parse(publishedJobSearchQuerySchema, req.query));
      res.status(HttpStatus.OK).json({ message: "Jobs retrieved successfully", ...dependencies.jobResponseMapper.toPageDto(page) });
    }),
    get: wrap(async (req, res) => {
      const id = parse(jobIdSchema, req.params.jobId);
      const job = await dependencies.getJobDetailsUseCase.execute(id);
      res.status(HttpStatus.OK).json({ message: "Job retrieved successfully", job: dependencies.jobResponseMapper.toDto(job) });
    }),
  };
};
