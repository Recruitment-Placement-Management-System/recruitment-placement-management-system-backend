import { GetJobDetailsUseCase } from "../application/use-cases/jobs/get-job-details.use-case.js";
import { GetRelatedJobsUseCase } from "../application/use-cases/jobs/get-related-jobs.use-case.js";
import { ListCandidateSavedJobsUseCase } from "../application/use-cases/jobs/list-candidate-saved-jobs.use-case.js";
import { RemoveCandidateSavedJobUseCase } from "../application/use-cases/jobs/remove-candidate-saved-job.use-case.js";
import { SaveCandidateJobUseCase } from "../application/use-cases/jobs/save-candidate-job.use-case.js";
import { SearchPublishedJobsUseCase } from "../application/use-cases/jobs/search-published-jobs.use-case.js";
import { MongoJobRepository } from "../infrastructure/repositories/mongo-job.repository.js";
import { MongoSavedJobRepository } from "../infrastructure/repositories/mongo-saved-job.repository.js";
import { JobResponseMapper } from "../presentation/jobs/mappers/job-response.mapper.js";
import { tokenService } from "./container.js";

const jobRepository = new MongoJobRepository();
const savedJobRepository = new MongoSavedJobRepository();
const jobResponseMapper = new JobResponseMapper();

export const candidateJobDependencies = {
  searchPublishedJobsUseCase: new SearchPublishedJobsUseCase(jobRepository),
  getJobDetailsUseCase: new GetJobDetailsUseCase(jobRepository),
  getRelatedJobsUseCase: new GetRelatedJobsUseCase(jobRepository),
  listCandidateSavedJobsUseCase: new ListCandidateSavedJobsUseCase(savedJobRepository, jobRepository),
  saveCandidateJobUseCase: new SaveCandidateJobUseCase(savedJobRepository, jobRepository),
  removeCandidateSavedJobUseCase: new RemoveCandidateSavedJobUseCase(savedJobRepository),
  jobResponseMapper,
  tokenService,
};
