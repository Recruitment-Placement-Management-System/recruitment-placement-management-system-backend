import type { UpdateRecruiterProfileDto } from "../../dto/recruiter-profile/recruiter-profile.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { IRecruiterProfileRepository } from "../../interfaces/repositories/recruiter-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class UpdateRecruiterProfileUseCase {
  constructor(private readonly recruiterProfileRepository: IRecruiterProfileRepository) {}

  async execute(userId: string, input: UpdateRecruiterProfileDto) {
    const profile = await this.recruiterProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Recruiter profile not found", "RECRUITER_PROFILE_NOT_FOUND");
    }

    if (input.fullName !== undefined) profile.fullName = input.fullName;
    if (input.designation !== undefined) profile.designation = input.designation;
    return this.recruiterProfileRepository.update(profile);
  }
}