import type { Company } from "../../../domain/entities/company.entity.js";

export interface ICompanyRepository {
  findByName(name: string): Promise<Company | null>;
  create(company: Company): Promise<Company>;
  update(company: Company): Promise<Company>;
}