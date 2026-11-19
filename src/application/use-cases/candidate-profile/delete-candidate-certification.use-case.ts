import type { DeleteCandidateCertificationDto } from "../../dto/candidate-profile/candidate-certification.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class DeleteCandidateCertificationUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: DeleteCandidateCertificationDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }
    if (!profile.certifications[input.index]) {
      throw new AppError(HttpStatus.NOT_FOUND, "Certification not found", "CERTIFICATION_NOT_FOUND");
    }

    profile.certifications = profile.certifications.filter((_certification, index) => index !== input.index);
    return this.candidateProfileRepository.update(profile);
  }
}
