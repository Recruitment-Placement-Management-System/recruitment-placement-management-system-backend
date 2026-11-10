import type { RequestHandler } from "express";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { CreateCandidateProfileUseCase } from "../../../application/use-cases/candidate-profile/create-candidate-profile.use-case.js";
import type { GetCandidateProfileUseCase } from "../../../application/use-cases/candidate-profile/get-candidate-profile.use-case.js";
import type { UpdateCandidateProfileUseCase } from "../../../application/use-cases/candidate-profile/update-candidate-profile.use-case.js";
import type { UpdateCandidatePersonalInformationUseCase } from "../../../application/use-cases/candidate-profile/update-candidate-personal-information.use-case.js";
import type { CandidateProfile } from "../../../domain/entities/candidate-profile.entity.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export interface CandidateProfileControllerDependencies {
  createCandidateProfileUseCase: CreateCandidateProfileUseCase;
  getCandidateProfileUseCase: GetCandidateProfileUseCase;
  updateCandidateProfileUseCase: UpdateCandidateProfileUseCase;
  updateCandidatePersonalInformationUseCase: UpdateCandidatePersonalInformationUseCase;
  tokenService: ITokenService;
}

const toCandidateProfileResponse = (profile: CandidateProfile) => {
  const { id, ...profileFields } = profile;
  return { _id: id, ...profileFields };
};

export const createCandidateProfileController = (
  dependencies: CandidateProfileControllerDependencies,
) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  return {
    create: wrap(async (req, res) => {
      const profile = await dependencies.createCandidateProfileUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.CREATED).json({ message: "Candidate profile created successfully", profile: toCandidateProfileResponse(profile) });
    }),
    get: wrap(async (req, res) => {
      const profile = await dependencies.getCandidateProfileUseCase.execute(req.user!.userId);
      res.status(HttpStatus.OK).json({ message: "Candidate profile retrieved successfully", profile: toCandidateProfileResponse(profile) });
    }),
    update: wrap(async (req, res) => {
      const profile = await dependencies.updateCandidateProfileUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.OK).json({ message: "Candidate profile updated successfully", profile: toCandidateProfileResponse(profile) });
    }),
    updatePersonalInformation: wrap(async (req, res) => {
      const profile = await dependencies.updateCandidatePersonalInformationUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.OK).json({ message: "Personal information updated successfully", profile: toCandidateProfileResponse(profile) });
    }),
  };
};
