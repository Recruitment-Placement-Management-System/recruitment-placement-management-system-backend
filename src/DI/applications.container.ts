import { GetJobApplicationUseCase } from "../application/use-cases/applications/get-job-application.use-case.js";
import { ListCandidateApplicationsUseCase } from "../application/use-cases/applications/list-candidate-applications.use-case.js";
import { ListRecruiterApplicationsUseCase } from "../application/use-cases/applications/list-recruiter-applications.use-case.js";
import { SubmitJobApplicationUseCase } from "../application/use-cases/applications/submit-job-application.use-case.js";
import { UpdateApplicationStatusUseCase } from "../application/use-cases/applications/update-application-status.use-case.js";
import { WithdrawJobApplicationUseCase } from "../application/use-cases/applications/withdraw-job-application.use-case.js";
import { MongoCandidateProfileRepository } from "../infrastructure/repositories/mongo-candidate-profile.repository.js";
import { MongoJobApplicationRepository } from "../infrastructure/repositories/mongo-job-application.repository.js";
import { MongoJobRepository } from "../infrastructure/repositories/mongo-job.repository.js";
import { MongoUserRepository } from "../infrastructure/repositories/mongo-user.repository.js";
import { S3FileStorageService } from "../infrastructure/services/s3-file-storage.service.js";
import { JobApplicationResponseMapper } from "../presentation/applications/mappers/job-application-response.mapper.js";
import { tokenService } from "./container.js";

const applicationRepository = new MongoJobApplicationRepository();
const jobRepository = new MongoJobRepository();
const profileRepository = new MongoCandidateProfileRepository();
const userRepository = new MongoUserRepository();
const fileStorage = new S3FileStorageService();
const responseMapper = new JobApplicationResponseMapper();

export const candidateApplicationDependencies = {
  submitJobApplicationUseCase: new SubmitJobApplicationUseCase(applicationRepository, jobRepository, profileRepository, userRepository, fileStorage),
  listCandidateApplicationsUseCase: new ListCandidateApplicationsUseCase(applicationRepository),
  getJobApplicationUseCase: new GetJobApplicationUseCase(applicationRepository),
  withdrawJobApplicationUseCase: new WithdrawJobApplicationUseCase(applicationRepository),
  responseMapper,
  fileStorage,
  tokenService,
};

export const recruiterApplicationDependencies = {
  listRecruiterApplicationsUseCase: new ListRecruiterApplicationsUseCase(applicationRepository),
  getJobApplicationUseCase: new GetJobApplicationUseCase(applicationRepository),
  updateApplicationStatusUseCase: new UpdateApplicationStatusUseCase(applicationRepository),
  responseMapper,
  fileStorage,
  tokenService,
};
