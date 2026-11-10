import type { AddCandidateSkillsDto } from "../../dto/candidate-profile/candidate-skills.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";
import { getCandidateSkillName,normalizeSkillName } from "../../../shared/utils/candidate-skill.utils.js";

export class AddCandidateSkillsUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: AddCandidateSkillsDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const newSkills = input.skills.map((skill) => skill.trim());
    const newSkillKeys = newSkills.map(normalizeSkillName);
    if (new Set(newSkillKeys).size !== newSkillKeys.length) {
      throw new AppError(HttpStatus.CONFLICT, "The request contains duplicate skills", "DUPLICATE_SKILLS");
    }

    const existingSkillKeys = new Set(
      profile.skills.map(getCandidateSkillName).filter((name): name is string => name !== null).map(normalizeSkillName),
    );
    if (newSkillKeys.some((skill) => existingSkillKeys.has(skill))) {
      throw new AppError(HttpStatus.CONFLICT, "One or more skills already exist", "SKILL_ALREADY_EXISTS");
    }

    profile.skills = [...profile.skills, ...newSkills];
    return this.candidateProfileRepository.update(profile);
  }
}
