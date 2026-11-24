import { JobApplication } from "../../../domain/entities/job-application.entity.js";
import type { SubmitJobApplicationDto } from "../../dto/applications/job-application.dto.js";
import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import type { IJobApplicationRepository } from "../../interfaces/repositories/job-application.repository.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";
import type { IUserRepository } from "../../interfaces/repositories/user.repository.js";
import type { IFileStorageService } from "../../interfaces/services/file-storage.service.js";
import { AppError } from "../../errors/app-error.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class SubmitJobApplicationUseCase {
  constructor(private readonly applications: IJobApplicationRepository, private readonly jobs: IJobRepository, private readonly profiles: ICandidateProfileRepository, private readonly users: IUserRepository, private readonly fileStorage: IFileStorageService) {}

  async execute(candidateId: string, input: SubmitJobApplicationDto) {
    const job = await this.jobs.findById(input.jobId);

    if (!job || job.status !== "published" || (job.applicationDeadline && job.applicationDeadline.getTime() < Date.now())) throw new AppError(HttpStatus.NOT_FOUND, "Job is not accepting applications", "JOB_NOT_ACCEPTING_APPLICATIONS");
    if (await this.applications.findByCandidateAndJob(candidateId, input.jobId)) throw new AppError(HttpStatus.CONFLICT, "You have already applied for this job", "APPLICATION_ALREADY_EXISTS");

    const [profile, user] = await Promise.all([this.profiles.findByUserId(candidateId), this.users.findById(candidateId)]);

    if (!profile) throw new AppError(HttpStatus.NOT_FOUND, "Candidate profile not found", "CANDIDATE_PROFILE_NOT_FOUND");
    if (!profile.resume) throw new AppError(HttpStatus.BAD_REQUEST, "Upload a resume before applying", "RESUME_REQUIRED");
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "Candidate account not found", "CANDIDATE_NOT_FOUND");
    
    const safeFileName = basename(profile.resume.fileName).replace(/[^\w. -]/g, "_").slice(0, 180) || `resume${extname(profile.resume.fileName)}`;
    const applicationResumeKey = `candidate-applications/${candidateId}/${randomUUID()}/${safeFileName}`;
    await this.fileStorage.copy(profile.resume.storageKey, applicationResumeKey);
    try {
      return await this.applications.create(new JobApplication(undefined, input.jobId, candidateId, job.recruiterId, profile.fullName, user.email, user.phone ?? null, { storageKey: applicationResumeKey, fileName: safeFileName, contentType: profile.resume.contentType }, input.coverLetter, "submitted"));
    } catch (error) {
      await this.fileStorage.delete(applicationResumeKey).catch(() => undefined);
      throw error;
    }
  }
}
import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
