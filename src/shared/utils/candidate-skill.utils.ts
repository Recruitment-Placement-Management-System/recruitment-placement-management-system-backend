import type { CandidateProfileItem } from "../../domain/entities/candidate-profile.entity.js";

export const normalizeSkillName = (value: string): string => value.trim().toLowerCase();

export const getCandidateSkillName = (item: CandidateProfileItem): string | null => {
  if (typeof item === "string") return item.trim();
  return typeof item.name === "string" ? item.name.trim() : null;
};

export const replaceCandidateSkillName = (item: CandidateProfileItem, name: string): CandidateProfileItem =>
  typeof item === "string" ? name : { ...item, name };
