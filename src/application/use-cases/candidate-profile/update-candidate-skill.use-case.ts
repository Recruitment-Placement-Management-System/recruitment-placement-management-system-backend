import type { UpdateCandidateSkillDto } from "../../dto/candidate-profile/candidate-skills.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";
import { getCandidateSkillName, normalizeSkillName, replaceCandidateSkillName } from "../../../shared/utils/candidate-skill.utils.js";

export class UpdateCandidateSkillUseCase {
  constructor(private readonly candidateProfileRepository: ICandidateProfileRepository) {}

  async execute(userId: string, input: UpdateCandidateSkillDto) {
    const profile = await this.candidateProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    }

    const currentSkillKey = normalizeSkillName(input.currentSkill);
    const skillIndex = profile.skills.findIndex((skill) => {
      const name = getCandidateSkillName(skill);
      return name !== null && normalizeSkillName(name) === currentSkillKey;
    });
    if (skillIndex === -1) {
      throw new AppError(HttpStatus.NOT_FOUND, "Skill not found", "SKILL_NOT_FOUND");
    }

    const newSkillKey = normalizeSkillName(input.newSkill);
    const duplicateExists = profile.skills.some((skill, index) => {
      if (index === skillIndex) return false;
      const name = getCandidateSkillName(skill);
      return name !== null && normalizeSkillName(name) === newSkillKey;
    });
    if (duplicateExists) {
      throw new AppError(HttpStatus.CONFLICT, "Skill already exists", "SKILL_ALREADY_EXISTS");
    }

    profile.skills = profile.skills.map((skill, index) =>
      index === skillIndex ? replaceCandidateSkillName(skill, input.newSkill.trim()) : skill,
    );
    return this.candidateProfileRepository.update(profile);
  }
}
