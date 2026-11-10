import { CreateCandidateProfileUseCase } from "../application/use-cases/candidate-profile/create-candidate-profile.use-case.js";
import { GetCandidateProfileUseCase } from "../application/use-cases/candidate-profile/get-candidate-profile.use-case.js";
import { UpdateCandidateProfileUseCase } from "../application/use-cases/candidate-profile/update-candidate-profile.use-case.js";
import { MongoCandidateProfileRepository } from "../infrastructure/repositories/mongo-candidate-profile.repository.js";
import { tokenService } from "./container.js";

const candidateProfileRepository = new MongoCandidateProfileRepository();

export const candidateProfileDependencies = {
  createCandidateProfileUseCase: new CreateCandidateProfileUseCase(candidateProfileRepository),
  getCandidateProfileUseCase: new GetCandidateProfileUseCase(candidateProfileRepository),
  updateCandidateProfileUseCase: new UpdateCandidateProfileUseCase(candidateProfileRepository),
  tokenService,
};
