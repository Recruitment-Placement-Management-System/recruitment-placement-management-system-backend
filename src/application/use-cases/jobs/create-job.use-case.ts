import { Job } from "../../../domain/entities/job.entity.js";
import type { CreateJobDto } from "../../dto/jobs/job.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICompanyRepository } from "../../interfaces/repositories/company.repository.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";
import type { IRecruiterProfileRepository } from "../../interfaces/repositories/recruiter-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class CreateJobUseCase {
  constructor(
    private readonly jobRepository: IJobRepository,
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(userId: string, input: CreateJobDto) {
    const recruiter = await this.recruiterProfileRepository.findByUserId(userId);
    if (!recruiter) throw new AppError(HttpStatus.NOT_FOUND, "Recruiter profile not found", "RECRUITER_PROFILE_NOT_FOUND");
    const company = await this.companyRepository.findById(recruiter.companyId);
    if (!company) throw new AppError(HttpStatus.NOT_FOUND, "Recruiter's company not found", "RECRUITER_COMPANY_NOT_FOUND");

    const deadline = input.applicationDeadline ? new Date(`${input.applicationDeadline}T23:59:59.999Z`) : null;
    if (deadline && Number.isNaN(deadline.getTime())) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Application deadline is invalid", "INVALID_APPLICATION_DEADLINE");
    }

    return this.jobRepository.create(new Job(
      undefined,
      userId,
      company.id!,
      company.name,
      input.title,
      input.description,
      input.responsibilities ?? [],
      input.requirements ?? [],
      input.skills ?? [],
      input.location,
      input.employmentType,
      input.workMode,
      input.experienceLevel,
      input.salaryRange ?? null,
      input.openings ?? 1,
      deadline,
      "draft",
    ));
  }
}
