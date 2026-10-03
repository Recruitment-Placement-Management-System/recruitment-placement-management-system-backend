export type VerificationEntityType = "recruiter";

export type VerificationRequestStatus =
  | "pending"
  | "approved"
  | "rejected";

export type VerificationPriority = "low" | "normal" | "high";

export class VerificationRequest {
  constructor(
    public readonly id: string | undefined,
    public readonly entityId: string,
    public readonly entityType: VerificationEntityType,
    public readonly submittedBy: string,
    public readonly status: VerificationRequestStatus,
    public readonly priority: VerificationPriority,
    public readonly documents: string[] = [],
    public adminNotes?: string,
    public reviewedBy?: string,
    public submittedAt: Date = new Date(),
    public reviewedAt?: Date,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}