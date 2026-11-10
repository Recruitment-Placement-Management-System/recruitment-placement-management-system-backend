export interface AddCandidateSkillsDto {
  skills: string[];
}

export interface UpdateCandidateSkillDto {
  currentSkill: string;
  newSkill: string;
}

export interface RemoveCandidateSkillDto {
  skill: string;
}
