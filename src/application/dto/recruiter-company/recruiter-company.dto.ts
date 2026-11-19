import type { CompanyStatus, CompanyVerificationStatus } from "../../../domain/entities/company.entity.js";

export interface UpdateRecruiterCompanyDto {
  name?: string;
  location?: string;
  website?: string;
}

export interface RecruiterCompanyResponseDto {
  _id: string;
  name: string;
  location: string;
  website: string;
  status: CompanyStatus;
  verificationStatus: CompanyVerificationStatus;
  createdAt: string;
  updatedAt: string;
}
