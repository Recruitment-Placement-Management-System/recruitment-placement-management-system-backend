import { AppError } from "../../errors/app-error.js";
import type { IRecruiterProfileRepository } from "../../interfaces/repositories/recruiter-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class GetRecruiterProfileUseCase {
  constructor(private readonly recruiterProfileRepository: IRecruiterProfileRepository) {}

  async execute(userId: string) {
    const profile = await this.recruiterProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Recruiter profile not found", "RECRUITER_PROFILE_NOT_FOUND");
    }
    return profile;
  }
}