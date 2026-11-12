import type { CandidateProfileResponseDto } from "../../../application/dto/candidate-profile/candidate-profile.dto.js";
import type { IFileStorageService } from "../../../application/interfaces/services/file-storage.service.js";
import type { CandidateProfile } from "../../../domain/entities/candidate-profile.entity.js";

export class CandidateProfileResponseMapper {
  constructor(private readonly fileStorage: IFileStorageService) {}

  async toDto(profile: CandidateProfile): Promise<CandidateProfileResponseDto> {
    const profilePhoto = profile.profilePhoto.startsWith("candidate-profiles/")
      ? await this.fileStorage.getDownloadUrl(profile.profilePhoto)
      : profile.profilePhoto;

    return {
      _id: profile.id ?? "",
      userId: profile.userId,
      fullName: profile.fullName,
      profilePhoto,
      headline: profile.headline,
      bio: profile.bio,
      location: { ...profile.location },
      personalInfo: { ...profile.personalInfo },
      contactLinks: { ...profile.contactLinks },
      skills: profile.skills.map((skill) => typeof skill === "string" ? skill : { ...skill }),
      education: profile.education.map((item) => ({ ...item })),
      experience: profile.experience.map((item) => ({ ...item })),
      projects: profile.projects.map((item) => ({ ...item, technologies: [...item.technologies] })),
      certifications: profile.certifications.map((item) => ({ ...item })),
      languages: profile.languages.map((item) => ({ ...item })),
      resume: { ...profile.resume },
      jobPreferences: { ...profile.jobPreferences },
      verificationStatus: profile.verificationStatus,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
