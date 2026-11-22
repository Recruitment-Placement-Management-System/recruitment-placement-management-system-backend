import type { RequestHandler } from "express";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { ListCandidateSavedJobsUseCase } from "../../../application/use-cases/jobs/list-candidate-saved-jobs.use-case.js";
import type { SaveCandidateJobUseCase } from "../../../application/use-cases/jobs/save-candidate-job.use-case.js";
import type { RemoveCandidateSavedJobUseCase } from "../../../application/use-cases/jobs/remove-candidate-saved-job.use-case.js";
import type { JobResponseMapper } from "../mappers/job-response.mapper.js";
import { jobIdSchema } from "../validators/job.validator.js";
import { AppError } from "../../../application/errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export interface CandidateSavedJobsControllerDependencies {
  listCandidateSavedJobsUseCase: ListCandidateSavedJobsUseCase;
  saveCandidateJobUseCase: SaveCandidateJobUseCase;
  removeCandidateSavedJobUseCase: RemoveCandidateSavedJobUseCase;
  jobResponseMapper: JobResponseMapper;
  tokenService: ITokenService;
}

const parseJobId = (input: unknown) => {
  const result = jobIdSchema.safeParse(input);
  if (!result.success) throw new AppError(HttpStatus.BAD_REQUEST, "Invalid job ID", "INVALID_JOB_ID");
  return result.data;
};

export const createCandidateSavedJobsController = (dependencies: CandidateSavedJobsControllerDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  return {
    list: wrap(async (req, res) => {
      const savedJobs = await dependencies.listCandidateSavedJobsUseCase.execute(req.user!.userId);
      res.status(HttpStatus.OK).json({
        message: "Saved jobs retrieved successfully",
        savedJobs: savedJobs.map(({ job, savedAt }) => ({
          job: dependencies.jobResponseMapper.toDto(job),
          savedAt: savedAt.toISOString(),
        })),
      });
    }),
    save: wrap(async (req, res) => {
      const savedJob = await dependencies.saveCandidateJobUseCase.execute(req.user!.userId, parseJobId(req.params.jobId));
      res.status(HttpStatus.CREATED).json({ message: "Job saved successfully", savedJob: { jobId: savedJob.jobId, savedAt: savedJob.createdAt.toISOString() } });
    }),
    remove: wrap(async (req, res) => {
      await dependencies.removeCandidateSavedJobUseCase.execute(req.user!.userId, parseJobId(req.params.jobId));
      res.status(HttpStatus.OK).json({ message: "Saved job removed successfully" });
    }),
  };
};
