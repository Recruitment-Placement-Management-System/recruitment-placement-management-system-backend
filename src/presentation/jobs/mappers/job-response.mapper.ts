import type { JobResponseDto } from "../../../application/dto/jobs/job.dto.js";
import type { Job } from "../../../domain/entities/job.entity.js";

export class JobResponseMapper {
  toDto(job: Job): JobResponseDto {
    return {
      _id: job.id ?? "",
      recruiterId: job.recruiterId,
      companyId: job.companyId,
      companyName: job.companyName,
      title: job.title,
      description: job.description,
      responsibilities: [...job.responsibilities],
      requirements: [...job.requirements],
      skills: [...job.skills],
      location: job.location,
      employmentType: job.employmentType,
      workMode: job.workMode,
      experienceLevel: job.experienceLevel,
      salaryRange: job.salaryRange ? { ...job.salaryRange } : null,
      openings: job.openings,
      applicationDeadline: job.applicationDeadline?.toISOString().slice(0, 10) ?? null,
      status: job.status,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    };
  }

  toPageDto(page: { jobs: Job[]; total: number; page: number; limit: number; pages: number }) {
    return {
      jobs: page.jobs.map((job) => this.toDto(job)),
      pagination: { total: page.total, page: page.page, limit: page.limit, pages: page.pages },
    };
  }
}
