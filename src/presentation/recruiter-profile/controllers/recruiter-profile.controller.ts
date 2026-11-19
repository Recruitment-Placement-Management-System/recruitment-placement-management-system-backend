import type { RequestHandler } from "express";
import type { GetRecruiterProfileUseCase } from "../../../application/use-cases/recruiter-profile/get-recruiter-profile.use-case.js";
import type { UpdateRecruiterProfileUseCase } from "../../../application/use-cases/recruiter-profile/update-recruiter-profile.use-case.js";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { RecruiterProfileResponseMapper } from "../mappers/recruiter-profile-response.mapper.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export interface RecruiterProfileControllerDependencies {
  getRecruiterProfileUseCase: GetRecruiterProfileUseCase;
  updateRecruiterProfileUseCase: UpdateRecruiterProfileUseCase;
  recruiterProfileResponseMapper: RecruiterProfileResponseMapper;
  tokenService: ITokenService;
}

export const createRecruiterProfileController = (dependencies: RecruiterProfileControllerDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  return {
    get: wrap(async (req, res) => {
      const profile = await dependencies.getRecruiterProfileUseCase.execute(req.user!.userId);
      res.status(HttpStatus.OK).json({
        message: "Recruiter profile retrieved successfully",
        profile: dependencies.recruiterProfileResponseMapper.toDto(profile),
      });
    }),

    update: wrap(async (req, res) => {
      const profile = await dependencies.updateRecruiterProfileUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.OK).json({
        message: "Recruiter profile updated successfully",
        profile: dependencies.recruiterProfileResponseMapper.toDto(profile),
      });
    }),
  };
};