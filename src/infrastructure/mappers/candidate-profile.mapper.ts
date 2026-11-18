import { CandidateProfile, createEmptyCandidateJobPreferences } from "../../domain/entities/candidate-profile.entity.js";
import type { CandidateProfileDocument } from "../database/models/candidate-profile.model.js";

export class CandidateProfileMapper {
  static toDomain(document: CandidateProfileDocument): CandidateProfile {
    return new CandidateProfile(
      String(document._id),
      String(document.userId),
      document.fullName,
      document.profilePhoto,
      document.headline,
      document.bio,
      document.location,
      document.personalInfo,
      document.contactLinks,
      document.skills,
      document.education,
      document.experience,
      document.projects,
      document.certifications,
      document.languages,
      document.resume && typeof document.resume.storageKey === "string" ? document.resume : null,
      {
        ...createEmptyCandidateJobPreferences(),
        ...document.jobPreferences,
        expectedSalary: document.jobPreferences?.expectedSalary ?? null,
      },
      document.verificationStatus,
      document.createdAt,
      document.updatedAt,
    );
  }

  static toPersistence(profile: CandidateProfile) {
    return {
      userId: profile.userId,
      fullName: profile.fullName,
      profilePhoto: profile.profilePhoto,
      headline: profile.headline,
      bio: profile.bio,
      location: profile.location,
      personalInfo: profile.personalInfo,
      contactLinks: profile.contactLinks,
      skills: profile.skills,
      education: profile.education,
      experience: profile.experience,
      projects: profile.projects,
      certifications: profile.certifications,
      languages: profile.languages,
      resume: profile.resume,
      jobPreferences: profile.jobPreferences,
      verificationStatus: profile.verificationStatus,
    };
  }
}
