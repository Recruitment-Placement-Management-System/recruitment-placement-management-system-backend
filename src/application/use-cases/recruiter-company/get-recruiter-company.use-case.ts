import { AppError } from "../../errors/app-error.js";
import type { ICompanyRepository } from "../../interfaces/repositories/company.repository.js";
import type { IRecruiterProfileRepository } from "../../interfaces/repositories/recruiter-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class GetRecruiterCompanyUseCase {
  constructor(
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(userId: string) {
    const recruiterProfile = await this.recruiterProfileRepository.findByUserId(userId);
    if (!recruiterProfile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Recruiter profile not found", "RECRUITER_PROFILE_NOT_FOUND");
    }

    const company = await this.companyRepository.findById(recruiterProfile.companyId);
    if (!company) {
      throw new AppError(HttpStatus.NOT_FOUND, "Recruiter's company not found", "RECRUITER_COMPANY_NOT_FOUND");
    }
    return company;
  }
}
