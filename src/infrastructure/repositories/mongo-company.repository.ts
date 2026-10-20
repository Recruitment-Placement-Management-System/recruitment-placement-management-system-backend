import type { ICompanyRepository } from "../../application/interfaces/repositories/company.repository.js";
import { Company } from "../../domain/entities/company.entity.js";

import { CompanyModel } from "../database/models/company.model.js";
import { CompanyMapper } from "../mappers/company.mapper.js";

export class MongoCompanyRepository implements ICompanyRepository{
  async findByName(name: string): Promise<Company | null> {
    const company = await CompanyModel.findOne({
      name:name.trim(),
    }).exec()

    if(!company)return null;

    return CompanyMapper.toDomain(company)
  }

  async create(company: Company): Promise<Company> {
    const createdCompany = await CompanyModel.create(CompanyMapper.toPersistence(company))

    return CompanyMapper.toDomain(createdCompany)
  }

  async update(company: Company): Promise<Company> {
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      company.id,
      {
        $set:{
          ...CompanyMapper.toPersistence(company),
        },
      },
      {
        new:true,
        runValidators:true
      },
    ).exec()

    if(!updatedCompany){
      throw new Error("company not found")
    }

    return CompanyMapper.toDomain(updatedCompany)
  }
}
