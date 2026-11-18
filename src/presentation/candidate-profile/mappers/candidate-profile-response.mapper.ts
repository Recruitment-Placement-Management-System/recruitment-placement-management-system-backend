import type { CandidateProfileResponseDto, CandidateResumeResponseDto } from "../../../application/dto/candidate-profile/candidate-profile.dto.js";
import type { IFileStorageService } from "../../../application/interfaces/services/file-storage.service.js";
import type { CandidateProfile, CandidateResume } from "../../../domain/entities/candidate-profile.entity.js";

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
      resume: await this.toResumeDto(profile.resume),
      jobPreferences: {
        preferredRoles: [...profile.jobPreferences.preferredRoles],
        preferredLocations: [...profile.jobPreferences.preferredLocations],
        employmentTypes: [...profile.jobPreferences.employmentTypes],
        workModes: [...profile.jobPreferences.workModes],
        expectedSalary: profile.jobPreferences.expectedSalary ? { ...profile.jobPreferences.expectedSalary } : null,
        experienceLevel: profile.jobPreferences.experienceLevel,
        noticePeriodDays: profile.jobPreferences.noticePeriodDays,
      },
      verificationStatus: profile.verificationStatus,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  async  toResumeDto(resume: CandidateResume | null): Promise<CandidateResumeResponseDto | null> {
    if (!resume) return null;
    return {
      fileName: resume.fileName,
      contentType: resume.contentType,
      fileSize: resume.fileSize,
      uploadedAt: resume.uploadedAt,
      parsingStatus: resume.parsingStatus,
      downloadUrl: await this.fileStorage.getDownloadUrl(resume.storageKey),
    };
  }
}
