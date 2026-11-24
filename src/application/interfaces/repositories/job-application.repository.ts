import type { JobApplication, JobApplicationStatus } from "../../../domain/entities/job-application.entity.js";
import type { JobApplicationQueryDto, PaginatedJobApplications } from "../../dto/applications/job-application.dto.js";

export interface IJobApplicationRepository {
  getCandidateDashboardData(candidateId: string, recentLimit: number): Promise<{ total: number; statusCounts: Record<JobApplicationStatus, number>; recent: JobApplication[]; appliedJobIds: string[] }>;
  create(application: JobApplication): Promise<JobApplication>;
  findById(id: string): Promise<JobApplication | null>;
  findByCandidateAndJob(candidateId: string, jobId: string): Promise<JobApplication | null>;
  findForCandidate(candidateId: string, options: JobApplicationQueryDto): Promise<PaginatedJobApplications>;
  findForRecruiter(recruiterId: string, options: JobApplicationQueryDto): Promise<PaginatedJobApplications>;
  updateStatus(id: string, status: JobApplicationStatus): Promise<JobApplication | null>;
}