import type { Company } from "../../../domain/entities/company.entity.js";
import type { IRepository } from "./repository.js";

export interface ICompanyRepository extends IRepository<Company> {
  findByName(name: string): Promise<Company | null>;
}
