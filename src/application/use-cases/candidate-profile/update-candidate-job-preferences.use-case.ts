import type { UpdateCandidateJobPreferencesDto } from "../../dto/candidate-profile/candidate-job-preferences.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class UpdateCandidateJobPreferencesUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: UpdateCandidateJobPreferencesDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const currentPreferences = profile.jobPreferences;
    const { expectedSalary, ...preferenceFields } = input;
    const nextPreferences = { ...currentPreferences, ...preferenceFields };

    if (expectedSalary === null) {
      nextPreferences.expectedSalary = null;
    } else if (expectedSalary) {
      const currentSalary = currentPreferences.expectedSalary ?? { minimum: null, maximum: null, currency: null };
      const nextSalary = { ...currentSalary, ...expectedSalary };
      const hasAmount = nextSalary.minimum !== null || nextSalary.maximum !== null;
      if (nextSalary.minimum !== null && nextSalary.maximum !== null && nextSalary.minimum > nextSalary.maximum) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Minimum salary cannot exceed maximum salary", "INVALID_SALARY_RANGE");
      }
      if (hasAmount && !nextSalary.currency) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Currency is required when an expected salary is provided", "SALARY_CURRENCY_REQUIRED");
      }
      if (nextSalary.currency && !hasAmount) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Provide a minimum or maximum salary with the currency", "SALARY_AMOUNT_REQUIRED");
      }
      nextPreferences.expectedSalary = hasAmount ? nextSalary : null;
    }

    profile.jobPreferences = nextPreferences;
    return this.candidateProfileRepository.update(profile);
  }
}
