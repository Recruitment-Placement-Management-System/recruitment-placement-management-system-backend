import type { ICompanyRepository } from "../../application/interfaces/repositories/company.repository.js";
import type { Company } from "../../domain/entities/company.entity.js";
import { CompanyModel } from "../database/models/company.model.js";
import { CompanyMapper } from "../mappers/company.mapper.js";
import { MongoBaseRepository } from "./mongo-base.repository.js";

export class MongoCompanyRepository extends MongoBaseRepository<Company, import("../database/models/company.model.js").CompanyDocument, ReturnType<typeof CompanyMapper.toPersistence>> implements ICompanyRepository {
  constructor() {
    super(CompanyModel, CompanyMapper.toDomain, CompanyMapper.toPersistence, (company) => ({ $set: CompanyMapper.toPersistence(company) }), "Company not found");
  }

  async findByName(name: string): Promise<Company | null> {
    const company = await CompanyModel.findOne({
      name:name.trim(),
    }).exec()

    if(!company)return null;

    return CompanyMapper.toDomain(company)
  }

}
