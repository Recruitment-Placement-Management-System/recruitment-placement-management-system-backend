import type { UpdateRecruiterCompanyDto } from "../../dto/recruiter-company/recruiter-company.dto.js";
import { AppError } from "../../errors/app-error.js";
import type { ICompanyRepository } from "../../interfaces/repositories/company.repository.js";
import type { IRecruiterProfileRepository } from "../../interfaces/repositories/recruiter-profile.repository.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export class UpdateRecruiterCompanyUseCase {
  constructor(
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(userId: string, input: UpdateRecruiterCompanyDto) {
    const recruiterProfile = await this.recruiterProfileRepository.findByUserId(userId);
    if (!recruiterProfile) {
      throw new AppError(HttpStatus.NOT_FOUND, "Recruiter profile not found", "RECRUITER_PROFILE_NOT_FOUND");
    }

    const company = await this.companyRepository.findById(recruiterProfile.companyId);
    if (!company) {
      throw new AppError(HttpStatus.NOT_FOUND, "Recruiter's company not found", "RECRUITER_COMPANY_NOT_FOUND");
    }

    if (input.name !== undefined) company.name = input.name;
    if (input.location !== undefined) company.location = input.location;
    if (input.website !== undefined) company.website = input.website;
    return this.companyRepository.update(company);
  }
}
