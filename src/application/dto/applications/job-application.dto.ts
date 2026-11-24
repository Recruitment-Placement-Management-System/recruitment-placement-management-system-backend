export interface SubmitJobApplicationDto {
  jobId: string;
  coverLetter: string;
}

export type GetJobApplicationRole = "candidate" | "recruiter";
export type UpdateJobApplicationStatusDto = Extract<import("../../../domain/entities/job-application.entity.js").JobApplicationStatus, "under_review" | "shortlisted" | "rejected">;

export interface JobApplicationQueryDto {
  page: number;
  limit: number;
  status?: "submitted" | "under_review" | "shortlisted" | "rejected" | "withdrawn" | undefined;
  jobId?: string | undefined;
}

export interface PaginatedJobApplications {
  applications: import("../../../domain/entities/job-application.entity.js").JobApplication[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
