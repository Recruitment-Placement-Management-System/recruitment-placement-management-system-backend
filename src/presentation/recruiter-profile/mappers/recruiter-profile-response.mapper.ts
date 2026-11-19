import type { RecruiterProfileResponseDto } from "../../../application/dto/recruiter-profile/recruiter-profile.dto.js";
import type { RecruiterProfile } from "../../../domain/entities/recruiter-profile.entity.js";

export class RecruiterProfileResponseMapper {
  toDto(profile: RecruiterProfile): RecruiterProfileResponseDto {
    return {
      _id: profile.id ?? "",
      userId: profile.userId,
      companyId: profile.companyId,
      fullName: profile.fullName,
      designation: profile.designation,
      verificationStatus: profile.verificationStatus,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}