import { Company } from "../../domain/entities/company.entity.js";
import type { CompanyDocument } from "../database/models/company.model.js";

export class CompanyMapper {
  static toDomain(document: CompanyDocument): Company {
    return new Company(String(document._id), document.name, document.location,
      document.website, document.status, document.verificationStatus,
      document.createdAt, document.updatedAt);
  }

  static toPersistence(company: Company) {
    return {
      name: company.name, location: company.location, website: company.website,
      status: company.status, verificationStatus: company.verificationStatus,
    };
  }
}