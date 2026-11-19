import { MongoCompanyRepository } from "../infrastructure/repositories/mongo-company.repository.js";
import { MongoRecruiterProfileRepository } from "../infrastructure/repositories/mongo-recruiter-profile.repository.js";
import { GetRecruiterCompanyUseCase } from "../application/use-cases/recruiter-company/get-recruiter-company.use-case.js";
import { UpdateRecruiterCompanyUseCase } from "../application/use-cases/recruiter-company/update-recruiter-company.use-case.js";
import { RecruiterCompanyResponseMapper } from "../presentation/recruiter-company/mappers/recruiter-company-response.mapper.js";
import { tokenService } from "./container.js";

const companyRepository = new MongoCompanyRepository();
const recruiterProfileRepository = new MongoRecruiterProfileRepository();

export const recruiterCompanyDependencies = {
  getRecruiterCompanyUseCase: new GetRecruiterCompanyUseCase(recruiterProfileRepository, companyRepository),
  updateRecruiterCompanyUseCase: new UpdateRecruiterCompanyUseCase(recruiterProfileRepository, companyRepository),
  recruiterCompanyResponseMapper: new RecruiterCompanyResponseMapper(),
  tokenService,
};
