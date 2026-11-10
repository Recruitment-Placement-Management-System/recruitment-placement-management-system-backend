import type { RequestHandler } from "express";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { CreateCandidateProfileUseCase } from "../../../application/use-cases/candidate-profile/create-candidate-profile.use-case.js";
import type { GetCandidateProfileUseCase } from "../../../application/use-cases/candidate-profile/get-candidate-profile.use-case.js";
import type { UpdateCandidateProfileUseCase } from "../../../application/use-cases/candidate-profile/update-candidate-profile.use-case.js";
import type { UpdateCandidatePersonalInformationUseCase } from "../../../application/use-cases/candidate-profile/update-candidate-personal-information.use-case.js";
import type { AddCandidateSkillsUseCase } from "../../../application/use-cases/candidate-profile/add-candidate-skills.use-case.js";
import type { UpdateCandidateSkillUseCase } from "../../../application/use-cases/candidate-profile/update-candidate-skill.use-case.js";
import type { RemoveCandidateSkillUseCase } from "../../../application/use-cases/candidate-profile/remove-candidate-skill.use-case.js";
import type { AddCandidateEducationUseCase } from "../../../application/use-cases/candidate-profile/add-candidate-education.use-case.js";
import type { UpdateCandidateEducationUseCase } from "../../../application/use-cases/candidate-profile/update-candidate-education.use-case.js";
import type { DeleteCandidateEducationUseCase } from "../../../application/use-cases/candidate-profile/delete-candidate-education.use-case.js";
import type { CandidateProfile } from "../../../domain/entities/candidate-profile.entity.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export interface CandidateProfileControllerDependencies {
  createCandidateProfileUseCase: CreateCandidateProfileUseCase;
  getCandidateProfileUseCase: GetCandidateProfileUseCase;
  updateCandidateProfileUseCase: UpdateCandidateProfileUseCase;
  updateCandidatePersonalInformationUseCase: UpdateCandidatePersonalInformationUseCase;
  addCandidateSkillsUseCase: AddCandidateSkillsUseCase;
  updateCandidateSkillUseCase: UpdateCandidateSkillUseCase;
  removeCandidateSkillUseCase: RemoveCandidateSkillUseCase;
  addCandidateEducationUseCase: AddCandidateEducationUseCase;
  updateCandidateEducationUseCase: UpdateCandidateEducationUseCase;
  deleteCandidateEducationUseCase: DeleteCandidateEducationUseCase;
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

    addSkills: wrap(async (req, res) => {
      const profile = await dependencies.addCandidateSkillsUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.OK).json({ message: "Skills added successfully", profile: toCandidateProfileResponse(profile) });
    }),

    updateSkill: wrap(async (req, res) => {
      const profile = await dependencies.updateCandidateSkillUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.OK).json({ message: "Skill updated successfully", profile: toCandidateProfileResponse(profile) });
    }),

    removeSkill: wrap(async (req, res) => {
      const profile = await dependencies.removeCandidateSkillUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.OK).json({ message: "Skill removed successfully", profile: toCandidateProfileResponse(profile) });
    }),

    addEducation: wrap(async (req, res) => {
      const profile = await dependencies.addCandidateEducationUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.CREATED).json({ message: "Education added successfully", profile: toCandidateProfileResponse(profile) });
    }),

    updateEducation: wrap(async (req, res) => {
      const profile = await dependencies.updateCandidateEducationUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.OK).json({ message: "Education updated successfully", profile: toCandidateProfileResponse(profile) });
    }),
    
    deleteEducation: wrap(async (req, res) => {
      const profile = await dependencies.deleteCandidateEducationUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.OK).json({ message: "Education deleted successfully", profile: toCandidateProfileResponse(profile) });
    }),
  };
};
