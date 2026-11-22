import type { UpdateJobDto } from "../../dto/jobs/job.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class UpdateJobUseCase {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(jobId: string, recruiterId: string, input: UpdateJobDto) {
    const job = await this.jobRepository.findByIdForRecruiter(jobId, recruiterId);
    if (!job) throw new AppError(HttpStatus.NOT_FOUND, "Job not found", "JOB_NOT_FOUND");

    if (input.title !== undefined) job.title = input.title;
    if (input.description !== undefined) job.description = input.description;
    if (input.responsibilities !== undefined) job.responsibilities = input.responsibilities;
    if (input.requirements !== undefined) job.requirements = input.requirements;
    if (input.skills !== undefined) job.skills = input.skills;
    if (input.location !== undefined) job.location = input.location;
    if (input.employmentType !== undefined) job.employmentType = input.employmentType;
    if (input.workMode !== undefined) job.workMode = input.workMode;
    if (input.experienceLevel !== undefined) job.experienceLevel = input.experienceLevel;
    if (input.salaryRange !== undefined) job.salaryRange = input.salaryRange;
    if (input.openings !== undefined) job.openings = input.openings;
    if (input.applicationDeadline !== undefined) {
      job.applicationDeadline = input.applicationDeadline
        ? new Date(`${input.applicationDeadline}T23:59:59.999Z`)
        : null;
      if (job.applicationDeadline && Number.isNaN(job.applicationDeadline.getTime())) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Application deadline is invalid", "INVALID_APPLICATION_DEADLINE");
      }
    }
    return this.jobRepository.update(job);
  }
}
