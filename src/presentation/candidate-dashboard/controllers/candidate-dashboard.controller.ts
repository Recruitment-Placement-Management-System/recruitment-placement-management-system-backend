import type { RequestHandler } from "express";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { GetCandidateDashboardUseCase } from "../../../application/use-cases/candidate-dashboard/get-candidate-dashboard.use-case.js";
import type { JobResponseMapper } from "../../jobs/mappers/job-response.mapper.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export interface CandidateDashboardControllerDependencies {
  getCandidateDashboardUseCase: GetCandidateDashboardUseCase;
  jobResponseMapper: JobResponseMapper;
  tokenService: ITokenService;
}

export const createCandidateDashboardController = (dependencies: CandidateDashboardControllerDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  return {
    get: wrap(async (req, res) => {
      const dashboard = await dependencies.getCandidateDashboardUseCase.execute(req.user!.userId);
      res.status(HttpStatus.OK).json({ message: "Candidate dashboard retrieved successfully", dashboard: {
        ...dashboard,
        recommendedJobs: dashboard.recommendedJobs.map((job) => dependencies.jobResponseMapper.toDto(job)),
      } });
    }),
  };
};
