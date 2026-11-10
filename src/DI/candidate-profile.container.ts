import { CreateCandidateProfileUseCase } from "../application/use-cases/candidate-profile/create-candidate-profile.use-case.js";
import { GetCandidateProfileUseCase } from "../application/use-cases/candidate-profile/get-candidate-profile.use-case.js";
import { UpdateCandidateProfileUseCase } from "../application/use-cases/candidate-profile/update-candidate-profile.use-case.js";
import { UpdateCandidatePersonalInformationUseCase } from "../application/use-cases/candidate-profile/update-candidate-personal-information.use-case.js";
import { MongoCandidateProfileRepository } from "../infrastructure/repositories/mongo-candidate-profile.repository.js";
import { AddCandidateSkillsUseCase } from "../application/use-cases/candidate-profile/add-candidate-skills.use-case.js";
import { UpdateCandidateSkillUseCase } from "../application/use-cases/candidate-profile/update-candidate-skill.use-case.js";
import { RemoveCandidateSkillUseCase } from "../application/use-cases/candidate-profile/remove-candidate-skill.use-case.js";
import { tokenService } from "./container.js";

const candidateProfileRepository = new MongoCandidateProfileRepository();

export const candidateProfileDependencies = {
  createCandidateProfileUseCase: new CreateCandidateProfileUseCase(candidateProfileRepository),
  getCandidateProfileUseCase: new GetCandidateProfileUseCase(candidateProfileRepository),
  updateCandidateProfileUseCase: new UpdateCandidateProfileUseCase(candidateProfileRepository),
  updateCandidatePersonalInformationUseCase: new UpdateCandidatePersonalInformationUseCase(candidateProfileRepository),
  addCandidateSkillsUseCase: new AddCandidateSkillsUseCase(candidateProfileRepository),
  updateCandidateSkillUseCase: new UpdateCandidateSkillUseCase(candidateProfileRepository),
  removeCandidateSkillUseCase: new RemoveCandidateSkillUseCase(candidateProfileRepository),
  tokenService,
};
