export type RecruiterVerificationStatus =
  | "pending"
  | "verified"
  | "rejected";

export class RecruiterProfile {
  constructor(
    public readonly id: string | undefined,
    public readonly userId: string,
    public readonly companyId: string,
    public fullName: string,
    public designation: string,
    public verificationStatus: RecruiterVerificationStatus,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}