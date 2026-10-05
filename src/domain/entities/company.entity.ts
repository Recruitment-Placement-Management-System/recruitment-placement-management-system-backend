export type CompanyStatus = "pending" | "active" | "suspended";

export type CompanyVerificationStatus =
  | "pending"
  | "verified"
  | "rejected";

export class Company {
  constructor(
    public readonly id: string | undefined,
    public name: string,
    public location: string,
    public website: string,
    public status: CompanyStatus,
    public verificationStatus: CompanyVerificationStatus,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}