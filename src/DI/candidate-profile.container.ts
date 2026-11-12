import { CreateCandidateProfileUseCase } from "../application/use-cases/candidate-profile/create-candidate-profile.use-case.js";
import { GetCandidateProfileUseCase } from "../application/use-cases/candidate-profile/get-candidate-profile.use-case.js";
import { UpdateCandidateProfileUseCase } from "../application/use-cases/candidate-profile/update-candidate-profile.use-case.js";
import { UpdateCandidatePersonalInformationUseCase } from "../application/use-cases/candidate-profile/update-candidate-personal-information.use-case.js";
import { MongoCandidateProfileRepository } from "../infrastructure/repositories/mongo-candidate-profile.repository.js";
import { AddCandidateSkillsUseCase } from "../application/use-cases/candidate-profile/add-candidate-skills.use-case.js";
import { UpdateCandidateSkillUseCase } from "../application/use-cases/candidate-profile/update-candidate-skill.use-case.js";
import { RemoveCandidateSkillUseCase } from "../application/use-cases/candidate-profile/remove-candidate-skill.use-case.js";
import { AddCandidateEducationUseCase } from "../application/use-cases/candidate-profile/add-candidate-education.use-case.js";
import { UpdateCandidateEducationUseCase } from "../application/use-cases/candidate-profile/update-candidate-education.use-case.js";
import { DeleteCandidateEducationUseCase } from "../application/use-cases/candidate-profile/delete-candidate-education.use-case.js";
import { AddCandidateExperienceUseCase } from "../application/use-cases/candidate-profile/add-candidate-experience.use-case.js";
import { UpdateCandidateExperienceUseCase } from "../application/use-cases/candidate-profile/update-candidate-experience.use-case.js";
import { DeleteCandidateExperienceUseCase } from "../application/use-cases/candidate-profile/delete-candidate-experience.use-case.js";
import { AddCandidateProjectUseCase } from "../application/use-cases/candidate-profile/add-candidate-project.use-case.js";
import { UpdateCandidateProjectUseCase } from "../application/use-cases/candidate-profile/update-candidate-project.use-case.js";
import { DeleteCandidateProjectUseCase } from "../application/use-cases/candidate-profile/delete-candidate-project.use-case.js";
import { AddCandidateCertificationUseCase } from "../application/use-cases/candidate-profile/add-candidate-certification.use-case.js";
import { UpdateCandidateCertificationUseCase } from "../application/use-cases/candidate-profile/update-candidate-certification.use-case.js";
import { DeleteCandidateCertificationUseCase } from "../application/use-cases/candidate-profile/delete-candidate-certification.use-case.js";
import { AddCandidateLanguageUseCase } from "../application/use-cases/candidate-profile/add-candidate-language.use-case.js";
import { UpdateCandidateLanguageProficiencyUseCase } from "../application/use-cases/candidate-profile/update-candidate-language-proficiency.use-case.js";
import { RemoveCandidateLanguageUseCase } from "../application/use-cases/candidate-profile/remove-candidate-language.use-case.js";
import { tokenService } from "./container.js";
import { UploadCandidateProfilePhotoUseCase } from "../application/use-cases/candidate-profile/upload-candidate-profile-photo.use-case.js";
import { DeleteCandidateProfilePhotoUseCase } from "../application/use-cases/candidate-profile/delete-candidate-profile-photo.use-case.js";
import { S3FileStorageService } from "../infrastructure/services/s3-file-storage.service.js";
import { CandidateProfileResponseMapper } from "../presentation/candidate-profile/mappers/candidate-profile-response.mapper.js";

const candidateProfileRepository = new MongoCandidateProfileRepository();
const fileStorageService = new S3FileStorageService();
const candidateProfileResponseMapper = new CandidateProfileResponseMapper(fileStorageService);

export const candidateProfileDependencies = {
  createCandidateProfileUseCase: new CreateCandidateProfileUseCase(candidateProfileRepository),
  getCandidateProfileUseCase: new GetCandidateProfileUseCase(candidateProfileRepository),
  updateCandidateProfileUseCase: new UpdateCandidateProfileUseCase(candidateProfileRepository),
  updateCandidatePersonalInformationUseCase: new UpdateCandidatePersonalInformationUseCase(candidateProfileRepository),
  addCandidateSkillsUseCase: new AddCandidateSkillsUseCase(candidateProfileRepository),
  updateCandidateSkillUseCase: new UpdateCandidateSkillUseCase(candidateProfileRepository),
  removeCandidateSkillUseCase: new RemoveCandidateSkillUseCase(candidateProfileRepository),
  addCandidateEducationUseCase: new AddCandidateEducationUseCase(candidateProfileRepository),
  updateCandidateEducationUseCase: new UpdateCandidateEducationUseCase(candidateProfileRepository),
  deleteCandidateEducationUseCase: new DeleteCandidateEducationUseCase(candidateProfileRepository),
  addCandidateExperienceUseCase: new AddCandidateExperienceUseCase(candidateProfileRepository),
  updateCandidateExperienceUseCase: new UpdateCandidateExperienceUseCase(candidateProfileRepository),
  deleteCandidateExperienceUseCase: new DeleteCandidateExperienceUseCase(candidateProfileRepository),
  addCandidateProjectUseCase: new AddCandidateProjectUseCase(candidateProfileRepository),
  updateCandidateProjectUseCase: new UpdateCandidateProjectUseCase(candidateProfileRepository),
  deleteCandidateProjectUseCase: new DeleteCandidateProjectUseCase(candidateProfileRepository),
  addCandidateCertificationUseCase: new AddCandidateCertificationUseCase(candidateProfileRepository),
  updateCandidateCertificationUseCase: new UpdateCandidateCertificationUseCase(candidateProfileRepository),
  deleteCandidateCertificationUseCase: new DeleteCandidateCertificationUseCase(candidateProfileRepository),
  addCandidateLanguageUseCase: new AddCandidateLanguageUseCase(candidateProfileRepository),
  updateCandidateLanguageProficiencyUseCase: new UpdateCandidateLanguageProficiencyUseCase(candidateProfileRepository),
  removeCandidateLanguageUseCase: new RemoveCandidateLanguageUseCase(candidateProfileRepository),
  uploadCandidateProfilePhotoUseCase: new UploadCandidateProfilePhotoUseCase(candidateProfileRepository, fileStorageService),
  deleteCandidateProfilePhotoUseCase: new DeleteCandidateProfilePhotoUseCase(candidateProfileRepository, fileStorageService),
  candidateProfileResponseMapper,
  tokenService,
};
