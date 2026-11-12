import type { Request, RequestHandler } from "express";
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
import type { AddCandidateExperienceUseCase } from "../../../application/use-cases/candidate-profile/add-candidate-experience.use-case.js";
import type { UpdateCandidateExperienceUseCase } from "../../../application/use-cases/candidate-profile/update-candidate-experience.use-case.js";
import type { DeleteCandidateExperienceUseCase } from "../../../application/use-cases/candidate-profile/delete-candidate-experience.use-case.js";
import type { AddCandidateProjectUseCase } from "../../../application/use-cases/candidate-profile/add-candidate-project.use-case.js";
import type { UpdateCandidateProjectUseCase } from "../../../application/use-cases/candidate-profile/update-candidate-project.use-case.js";
import type { DeleteCandidateProjectUseCase } from "../../../application/use-cases/candidate-profile/delete-candidate-project.use-case.js";
import type { AddCandidateCertificationUseCase } from "../../../application/use-cases/candidate-profile/add-candidate-certification.use-case.js";
import type { UpdateCandidateCertificationUseCase } from "../../../application/use-cases/candidate-profile/update-candidate-certification.use-case.js";
import type { DeleteCandidateCertificationUseCase } from "../../../application/use-cases/candidate-profile/delete-candidate-certification.use-case.js";
import type { AddCandidateLanguageUseCase } from "../../../application/use-cases/candidate-profile/add-candidate-language.use-case.js";
import type { UpdateCandidateLanguageProficiencyUseCase } from "../../../application/use-cases/candidate-profile/update-candidate-language-proficiency.use-case.js";
import type { RemoveCandidateLanguageUseCase } from "../../../application/use-cases/candidate-profile/remove-candidate-language.use-case.js";
import type { UploadCandidateProfilePhotoUseCase } from "../../../application/use-cases/candidate-profile/upload-candidate-profile-photo.use-case.js";
import type { DeleteCandidateProfilePhotoUseCase } from "../../../application/use-cases/candidate-profile/delete-candidate-profile-photo.use-case.js";
import type { CandidateProfileResponseMapper } from "../mappers/candidate-profile-response.mapper.js";
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
  addCandidateExperienceUseCase: AddCandidateExperienceUseCase;
  updateCandidateExperienceUseCase: UpdateCandidateExperienceUseCase;
  deleteCandidateExperienceUseCase: DeleteCandidateExperienceUseCase;
  addCandidateProjectUseCase: AddCandidateProjectUseCase;
  updateCandidateProjectUseCase: UpdateCandidateProjectUseCase;
  deleteCandidateProjectUseCase: DeleteCandidateProjectUseCase;
  addCandidateCertificationUseCase: AddCandidateCertificationUseCase;
  updateCandidateCertificationUseCase: UpdateCandidateCertificationUseCase;
  deleteCandidateCertificationUseCase: DeleteCandidateCertificationUseCase;
  addCandidateLanguageUseCase: AddCandidateLanguageUseCase;
  updateCandidateLanguageProficiencyUseCase: UpdateCandidateLanguageProficiencyUseCase;
  removeCandidateLanguageUseCase: RemoveCandidateLanguageUseCase;
  uploadCandidateProfilePhotoUseCase: UploadCandidateProfilePhotoUseCase;
  deleteCandidateProfilePhotoUseCase: DeleteCandidateProfilePhotoUseCase;
  candidateProfileResponseMapper: CandidateProfileResponseMapper;
  tokenService: ITokenService;
}

type CandidateProfileResult = Parameters<CandidateProfileResponseMapper["toDto"]>[0];
type CandidateProfileAction = (req: Request) => Promise<CandidateProfileResult>;

export const createCandidateProfileController = (
  dependencies: CandidateProfileControllerDependencies,
) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  const withProfileResponse = (
    status: number,
    message: string,
    action: CandidateProfileAction,
  ): RequestHandler => wrap(async (req, res) => {
    const profile = await action(req);
    const profileDto = await dependencies.candidateProfileResponseMapper.toDto(profile);
    res.status(status).json({ message, profile: profileDto });
  });

  return {
    create: withProfileResponse(HttpStatus.CREATED, "Candidate profile created successfully", (req) =>
      dependencies.createCandidateProfileUseCase.execute(req.user!.userId, req.body)),

    get: withProfileResponse(HttpStatus.OK, "Candidate profile retrieved successfully", (req) =>
      dependencies.getCandidateProfileUseCase.execute(req.user!.userId)),

    update: withProfileResponse(HttpStatus.OK, "Candidate profile updated successfully", (req) =>
      dependencies.updateCandidateProfileUseCase.execute(req.user!.userId, req.body)),

    updatePersonalInformation: withProfileResponse(HttpStatus.OK, "Personal information updated successfully", (req) =>
      dependencies.updateCandidatePersonalInformationUseCase.execute(req.user!.userId, req.body)),

    addSkills: withProfileResponse(HttpStatus.OK, "Skills added successfully", (req) =>
      dependencies.addCandidateSkillsUseCase.execute(req.user!.userId, req.body)),

    updateSkill: withProfileResponse(HttpStatus.OK, "Skill updated successfully", (req) =>
      dependencies.updateCandidateSkillUseCase.execute(req.user!.userId, req.body)),

    removeSkill: withProfileResponse(HttpStatus.OK, "Skill removed successfully", (req) =>
      dependencies.removeCandidateSkillUseCase.execute(req.user!.userId, req.body)),

    addEducation: withProfileResponse(HttpStatus.CREATED, "Education added successfully", (req) =>
      dependencies.addCandidateEducationUseCase.execute(req.user!.userId, req.body)),

    updateEducation: withProfileResponse(HttpStatus.OK, "Education updated successfully", (req) =>
      dependencies.updateCandidateEducationUseCase.execute(req.user!.userId, req.body)),

    deleteEducation: withProfileResponse(HttpStatus.OK, "Education deleted successfully", (req) =>
      dependencies.deleteCandidateEducationUseCase.execute(req.user!.userId, req.body)),

    addExperience: withProfileResponse(HttpStatus.CREATED, "Work experience added successfully", (req) =>
      dependencies.addCandidateExperienceUseCase.execute(req.user!.userId, req.body)),

    updateExperience: withProfileResponse(HttpStatus.OK, "Work experience updated successfully", (req) =>
      dependencies.updateCandidateExperienceUseCase.execute(req.user!.userId, req.body)),

    deleteExperience: withProfileResponse(HttpStatus.OK, "Work experience deleted successfully", (req) =>
      dependencies.deleteCandidateExperienceUseCase.execute(req.user!.userId, req.body)),

    addProject: withProfileResponse(HttpStatus.CREATED, "Project added successfully", (req) =>
      dependencies.addCandidateProjectUseCase.execute(req.user!.userId, req.body)),

    updateProject: withProfileResponse(HttpStatus.OK, "Project updated successfully", (req) =>
      dependencies.updateCandidateProjectUseCase.execute(req.user!.userId, req.body)),

    deleteProject: withProfileResponse(HttpStatus.OK, "Project deleted successfully", (req) =>
      dependencies.deleteCandidateProjectUseCase.execute(req.user!.userId, req.body)),

    addCertification: withProfileResponse(HttpStatus.CREATED, "Certification added successfully", (req) =>
      dependencies.addCandidateCertificationUseCase.execute(req.user!.userId, req.body)),

    updateCertification: withProfileResponse(HttpStatus.OK, "Certification updated successfully", (req) =>
      dependencies.updateCandidateCertificationUseCase.execute(req.user!.userId, req.body)),

    deleteCertification: withProfileResponse(HttpStatus.OK, "Certification deleted successfully", (req) =>
      dependencies.deleteCandidateCertificationUseCase.execute(req.user!.userId, req.body)),

    addLanguage: withProfileResponse(HttpStatus.CREATED, "Language added successfully", (req) =>
      dependencies.addCandidateLanguageUseCase.execute(req.user!.userId, req.body)),

    updateLanguageProficiency: withProfileResponse(HttpStatus.OK, "Language proficiency updated successfully", (req) =>
      dependencies.updateCandidateLanguageProficiencyUseCase.execute(req.user!.userId, req.body)),

    removeLanguage: withProfileResponse(HttpStatus.OK, "Language removed successfully", (req) =>
      dependencies.removeCandidateLanguageUseCase.execute(req.user!.userId, req.body)),

    uploadProfilePhoto: withProfileResponse(HttpStatus.OK, "Profile photo uploaded successfully", (req) =>
      dependencies.uploadCandidateProfilePhotoUseCase.execute(req.user!.userId, {
        buffer: req.file!.buffer,
        contentType: req.file!.mimetype,
      })),

    deleteProfilePhoto: withProfileResponse(HttpStatus.OK, "Profile photo deleted successfully", (req) =>
      dependencies.deleteCandidateProfilePhotoUseCase.execute(req.user!.userId)),

  };
};
