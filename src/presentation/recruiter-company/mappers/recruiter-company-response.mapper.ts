import type { RecruiterCompanyResponseDto } from "../../../application/dto/recruiter-company/recruiter-company.dto.js";
import type { Company } from "../../../domain/entities/company.entity.js";

export class RecruiterCompanyResponseMapper {
  toDto(company: Company): RecruiterCompanyResponseDto {
    return {
      _id: company.id ?? "",
      name: company.name,
      location: company.location,
      website: company.website,
      status: company.status,
      verificationStatus: company.verificationStatus,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    };
  }
}
