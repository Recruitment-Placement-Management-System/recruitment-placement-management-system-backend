import { Types } from "mongoose";
import { JobApplication } from "../../domain/entities/job-application.entity.js";
import type { JobApplicationDocument } from "../database/models/job-application.model.js";

export class JobApplicationMapper {
  static toDomain(document: JobApplicationDocument): JobApplication {
    return new JobApplication(
      document._id.toString(), document.jobId.toString(), document.candidateId.toString(), document.recruiterId.toString(),
      document.candidateName, document.candidateEmail, document.candidatePhone,
      { ...document.resume }, document.coverLetter, document.status, document.submittedAt, document.updatedAt,
    );
  }

  static toPersistence(application: JobApplication) {
    return {
      jobId: new Types.ObjectId(application.jobId), candidateId: new Types.ObjectId(application.candidateId),
      recruiterId: new Types.ObjectId(application.recruiterId), candidateName: application.candidateName,
      candidateEmail: application.candidateEmail, candidatePhone: application.candidatePhone,
      resume: { ...application.resume }, coverLetter: application.coverLetter, status: application.status,
      submittedAt: application.submittedAt,
    };
  }
}
