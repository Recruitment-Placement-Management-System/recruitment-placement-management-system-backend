import type { UpdateCandidateCertificationDto } from "../../dto/candidate-profile/candidate-certification.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class UpdateCandidateCertificationUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: UpdateCandidateCertificationDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const existingCertification = profile.certifications[input.index];
    if (!existingCertification) {
      throw new AppError(HttpStatus.NOT_FOUND, "Certification not found", "CERTIFICATION_NOT_FOUND");
    }

    const { index, ...updates } = input;
    profile.certifications = profile.certifications.map((certification, certificationIndex) =>
      certificationIndex === index ? { ...certification, ...updates } : certification,
    );
    return this.candidateProfileRepository.update(profile);
  }
}
