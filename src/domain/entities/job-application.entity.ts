export type JobApplicationStatus = "submitted" | "under_review" | "shortlisted" | "rejected" | "withdrawn";

export interface JobApplicationResume {
  storageKey: string;
  fileName: string;
  contentType: string;
}

export class JobApplication {
  constructor(
    public readonly id: string | undefined,
    public readonly jobId: string,
    public readonly candidateId: string,
    public readonly recruiterId: string,
    public readonly candidateName: string,
    public readonly candidateEmail: string,
    public readonly candidatePhone: string | null,
    public readonly resume: JobApplicationResume,
    public coverLetter: string,
    public status: JobApplicationStatus,
    public readonly submittedAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
