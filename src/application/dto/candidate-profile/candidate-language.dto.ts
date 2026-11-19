export interface AddCandidateLanguageDto {
  name: string;
  proficiency: string;
}

export interface UpdateCandidateLanguageProficiencyDto {
  index: number;
  proficiency: string;
}

export interface RemoveCandidateLanguageDto {
  index: number;
}
