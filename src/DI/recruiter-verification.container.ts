import { GetRecruiterVerificationHistoryUseCase } from "../application/use-cases/recruiter-verification/get-recruiter-verification-history.use-case.js";
import { SubmitRecruiterVerificationUseCase } from "../application/use-cases/recruiter-verification/submit-recruiter-verification.use-case.js";
import { MongoRecruiterProfileRepository } from "../infrastructure/repositories/mongo-recruiter-profile.repository.js";
import { MongoVerificationRequestRepository } from "../infrastructure/repositories/mongo-verification-request.repository.js";
import { S3FileStorageService } from "../infrastructure/services/s3-file-storage.service.js";
import { RecruiterVerificationResponseMapper } from "../presentation/recruiter-verification/mappers/recruiter-verification-response.mapper.js";
import { tokenService } from "./container.js";

const recruiterProfileRepository = new MongoRecruiterProfileRepository();
const verificationRequestRepository = new MongoVerificationRequestRepository();
const fileStorage = new S3FileStorageService();

export const recruiterVerificationDependencies = {
  getRecruiterVerificationHistoryUseCase: new GetRecruiterVerificationHistoryUseCase(
    recruiterProfileRepository,
    verificationRequestRepository,
  ),
  submitRecruiterVerificationUseCase: new SubmitRecruiterVerificationUseCase(
    recruiterProfileRepository,
    verificationRequestRepository,
    fileStorage,
  ),
  recruiterVerificationResponseMapper: new RecruiterVerificationResponseMapper(fileStorage),
  tokenService,
};
