import type { ICompanyRepository } from "../../application/interfaces/repositories/company.repository.js";
import { Company,CompanyStatus,CompanyVerificationStatus } from "../../domain/entities/company.entity.js";

import { CompanyModel } from "../database/models/company.model.js";

export class MongoCompanyRepository implements ICompanyRepository{
  private toDomain(document:{
    _id:unknown;
    name:string;
    location:string;
    website:string;
    status:CompanyStatus;
    verificationStatus:CompanyVerificationStatus
    createdAt:Date;
    updatedAt:Date;
  }):Company{
    return new Company(
      String(document._id),
      document.name,
      document.location,
      document.website,
      document.status,
      document.verificationStatus,
      document.createdAt,
      document.updatedAt,
    );
  }

  async findByName(name: string): Promise<Company | null> {
    const company = await CompanyModel.findOne({
      name:name.trim(),
    }).exec()

    if(!company)return null;

    return this.toDomain(company)
  }

  async create(company: Company): Promise<Company> {
    const createdCompany = await CompanyModel.create({
      name:company.name,
      location:company.location,
      website:company.website,
      status:company.status,
      verificationStatus:company.verificationStatus,
    })

    return this.toDomain(createdCompany)
  }

  async update(company: Company): Promise<Company> {
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      company.id,
      {
        $set:{
          name:company.name,
          location:company.location,
          website:company.website,
          status:company.status,
          verificationStatus:company.verificationStatus
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

    return this.toDomain(updatedCompany)
  }
}