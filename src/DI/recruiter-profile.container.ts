import { GetRecruiterProfileUseCase } from "../application/use-cases/recruiter-profile/get-recruiter-profile.use-case.js";
import { UpdateRecruiterProfileUseCase } from "../application/use-cases/recruiter-profile/update-recruiter-profile.use-case.js";
import { MongoRecruiterProfileRepository } from "../infrastructure/repositories/mongo-recruiter-profile.repository.js";
import { RecruiterProfileResponseMapper } from "../presentation/recruiter-profile/mappers/recruiter-profile-response.mapper.js";
import { tokenService } from "./container.js";

const recruiterProfileRepository = new MongoRecruiterProfileRepository();

export const recruiterProfileDependencies = {
  getRecruiterProfileUseCase: new GetRecruiterProfileUseCase(recruiterProfileRepository),
  updateRecruiterProfileUseCase: new UpdateRecruiterProfileUseCase(recruiterProfileRepository),
  recruiterProfileResponseMapper: new RecruiterProfileResponseMapper(),
  tokenService,
};