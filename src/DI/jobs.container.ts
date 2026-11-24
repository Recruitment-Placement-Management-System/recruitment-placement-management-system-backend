import { CreateJobUseCase } from "../application/use-cases/jobs/create-job.use-case.js";
import { UpdateJobUseCase } from "../application/use-cases/jobs/update-job.use-case.js";
import { DeleteJobUseCase } from "../application/use-cases/jobs/delete-job.use-case.js";
import { SetJobPublicationUseCase } from "../application/use-cases/jobs/set-job-publication.use-case.js";
import { GetJobDetailsUseCase } from "../application/use-cases/jobs/get-job-details.use-case.js";
import { GetRecruiterJobDetailsUseCase } from "../application/use-cases/jobs/get-recruiter-job-details.use-case.js";
import { ListRecruiterJobsUseCase } from "../application/use-cases/jobs/list-recruiter-jobs.use-case.js";
import { SearchPublishedJobsUseCase } from "../application/use-cases/jobs/search-published-jobs.use-case.js";
import { MongoJobRepository } from "../infrastructure/repositories/mongo-job.repository.js";
import { MongoRecruiterProfileRepository } from "../infrastructure/repositories/mongo-recruiter-profile.repository.js";
import { MongoCompanyRepository } from "../infrastructure/repositories/mongo-company.repository.js";
import { JobResponseMapper } from "../presentation/jobs/mappers/job-response.mapper.js";
import { tokenService } from "./container.js";

const jobRepository = new MongoJobRepository();
const recruiterProfileRepository = new MongoRecruiterProfileRepository();
const companyRepository = new MongoCompanyRepository();
const jobResponseMapper = new JobResponseMapper();

export const jobDependencies = {
  createJobUseCase: new CreateJobUseCase(jobRepository, recruiterProfileRepository, companyRepository),
  updateJobUseCase: new UpdateJobUseCase(jobRepository),
  deleteJobUseCase: new DeleteJobUseCase(jobRepository),
  setJobPublicationUseCase: new SetJobPublicationUseCase(jobRepository),
  getJobDetailsUseCase: new GetJobDetailsUseCase(jobRepository),
  getRecruiterJobDetailsUseCase: new GetRecruiterJobDetailsUseCase(jobRepository),
  listRecruiterJobsUseCase: new ListRecruiterJobsUseCase(jobRepository),
  searchPublishedJobsUseCase: new SearchPublishedJobsUseCase(jobRepository),
  jobResponseMapper,
  tokenService,
};
