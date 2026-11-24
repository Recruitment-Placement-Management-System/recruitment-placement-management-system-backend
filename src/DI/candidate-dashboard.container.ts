import { GetCandidateDashboardUseCase } from "../application/use-cases/candidate-dashboard/get-candidate-dashboard.use-case.js";
import { MongoCandidateProfileRepository } from "../infrastructure/repositories/mongo-candidate-profile.repository.js";
import { MongoJobApplicationRepository } from "../infrastructure/repositories/mongo-job-application.repository.js";
import { MongoJobRepository } from "../infrastructure/repositories/mongo-job.repository.js";
import { JobResponseMapper } from "../presentation/jobs/mappers/job-response.mapper.js";
import { tokenService } from "./container.js";

export const candidateDashboardDependencies = {
  getCandidateDashboardUseCase: new GetCandidateDashboardUseCase(
    new MongoCandidateProfileRepository(), new MongoJobApplicationRepository(), new MongoJobRepository(),
  ),
  jobResponseMapper: new JobResponseMapper(),
  tokenService,
};
