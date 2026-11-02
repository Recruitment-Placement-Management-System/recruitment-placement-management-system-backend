import { RecruiterProfile } from "../../domain/entities/recruiter-profile.entity.js";
import type { RecruiterProfileDocument } from "../database/models/recruiter-profile.model.js";

export class RecruiterProfileMapper {
  static toDomain(document: RecruiterProfileDocument): RecruiterProfile {
    return new RecruiterProfile(String(document._id), String(document.userId),
      String(document.companyId), document.fullName, document.designation,
      document.verificationStatus, document.createdAt, document.updatedAt);
  }

  static toPersistence(profile: RecruiterProfile) {
    return {
      userId: profile.userId, companyId: profile.companyId,
      fullName: profile.fullName, designation: profile.designation,
      verificationStatus: profile.verificationStatus,
    };
  }
}
