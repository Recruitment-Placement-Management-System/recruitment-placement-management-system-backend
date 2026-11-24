import type { JobApplication } from "../../../domain/entities/job-application.entity.js";

export class JobApplicationResponseMapper {
  toDto(application: JobApplication) {
    return {
      _id: application.id ?? "",
      jobId: application.jobId,
      candidateId: application.candidateId,
      recruiterId: application.recruiterId,
      candidate: { fullName: application.candidateName, email: application.candidateEmail, phone: application.candidatePhone },
      resume: { fileName: application.resume.fileName, contentType: application.resume.contentType },
      coverLetter: application.coverLetter,
      status: application.status,
      submittedAt: application.submittedAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    };
  }

  toPageDto(page: { applications: JobApplication[]; total: number; page: number; limit: number; pages: number }) {
    return { applications: page.applications.map((application) => this.toDto(application)), pagination: { total: page.total, page: page.page, limit: page.limit, pages: page.pages } };
  }
}
