import { Job } from "../../domain/entities/job.entity.js";
import type { JobDocument } from "../database/models/job.model.js";

export class JobMapper {
  static toDomain(document: JobDocument): Job {
    return new Job(
      String(document._id),
      String(document.recruiterId),
      String(document.companyId),
      document.companyName,
      document.title,
      document.description,
      [...document.responsibilities],
      [...document.requirements],
      [...document.skills],
      document.location,
      document.employmentType,
      document.workMode,
      document.experienceLevel,
      document.salaryRange ? {
        minimum: document.salaryRange.minimum,
        maximum: document.salaryRange.maximum,
        currency: document.salaryRange.currency,
      } : null,
      document.openings,
      document.applicationDeadline,
      document.status,
      document.createdAt,
      document.updatedAt,
    );
  }

  static toPersistence(job: Job) {
    return {
      recruiterId: job.recruiterId,
      companyId: job.companyId,
      companyName: job.companyName,
      title: job.title,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      skills: job.skills,
      location: job.location,
      employmentType: job.employmentType,
      workMode: job.workMode,
      experienceLevel: job.experienceLevel,
      salaryRange: job.salaryRange,
      openings: job.openings,
      applicationDeadline: job.applicationDeadline,
      status: job.status,
    };
  }
}