import type { RemoveCandidateSkillDto } from "../../dto/candidate-profile/candidate-skills.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";
import { getCandidateSkillName, normalizeSkillName } from "../../../shared/utils/candidate-skill.utils.js";

export class RemoveCandidateSkillUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: RemoveCandidateSkillDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const skillKey = normalizeSkillName(input.skill);
    const matchingSkillsExist = profile.skills.some((skill) => {
      const name = getCandidateSkillName(skill);
      return name !== null && normalizeSkillName(name) === skillKey;
    });
    if (!matchingSkillsExist) {
      throw new AppError(HttpStatus.NOT_FOUND, "Skill not found", "SKILL_NOT_FOUND");
    }

    profile.skills = profile.skills.filter((skill) => {
      const name = getCandidateSkillName(skill);
      return name === null || normalizeSkillName(name) !== skillKey;
    });
    return this.candidateProfileRepository.update(profile);
  }
}
