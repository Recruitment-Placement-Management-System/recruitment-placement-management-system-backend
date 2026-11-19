import { AppError } from "../../errors/app-error.js";
import type { IRecruiterProfileRepository } from "../../interfaces/repositories/recruiter-profile.repository.js";
import type { IVerificationRequestRepository } from "../../interfaces/repositories/verification-request.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class GetRecruiterVerificationHistoryUseCase {
  constructor(
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
    private readonly verificationRequestRepository: IVerificationRequestRepository,
  ) {}

  async execute(userId: string) {
    const profile = await this.recruiterProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Recruiter profile not found", "RECRUITER_PROFILE_NOT_FOUND");
    }
    return this.verificationRequestRepository.findAllByEntity(profile.id!, "recruiter");
  }
}
